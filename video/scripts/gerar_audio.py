"""Gera o áudio PROVISÓRIO do vídeo e a análise dele.

    python3 scripts/gerar_audio.py

Saídas:
- public/audio/voz.wav     voz SINTÉTICA provisória: ~3 s de sala, /a/ sustentado
                           e um trecho de "fala" sintética. Trocar pela gravação
                           real (mesmo nome, mesma estrutura) e rodar
                           `python3 scripts/analisar_voz.py` de novo.
- public/audio/trilha.mp3  trilha instrumental calma, gerada aqui (precisa de ffmpeg).
- public/audio/clique.wav, enviado.wav   efeitos discretos de interface.

Só depende de numpy. Determinístico (semente fixa).
"""

from pathlib import Path
import subprocess
import wave

import numpy as np

SR = 44100
RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / "public" / "audio"
rng = np.random.default_rng(7)


def gravar_wav(caminho: Path, sinal: np.ndarray) -> None:
    caminho.parent.mkdir(parents=True, exist_ok=True)
    pcm = np.clip(sinal, -1, 1)
    pcm = (pcm * 32767).astype("<i2")
    with wave.open(str(caminho), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def db(x: float) -> float:
    return 10 ** (x / 20)


# ------------------------------------------------------------------ voz --

def pulso_rosenberg(n: int) -> np.ndarray:
    """Um ciclo glotal (Rosenberg) com n amostras, já derivado (radiação)."""
    tp, tn = int(0.42 * n), int(0.16 * n)
    g = np.zeros(n)
    t = np.arange(tp)
    g[:tp] = 0.5 * (1 - np.cos(np.pi * t / tp))
    t = np.arange(tn)
    g[tp:tp + tn] = np.cos(0.5 * np.pi * t / tn)
    return np.diff(g, prepend=0.0)


def fonte_vozeada(f0: np.ndarray, amp: np.ndarray, jitter=0.005, shimmer=0.03):
    """Trem de pulsos ciclo a ciclo, com micro-variação de período e amplitude.

    f0 e amp são contornos por amostra. Devolve o sinal e o índice de início
    de cada ciclo (usado pela análise para marcar período e amplitude).
    """
    n_total = len(f0)
    saida = np.zeros(n_total)
    inicios = []
    i = 0
    while i < n_total - 2:
        f = f0[i]
        if f <= 0 or amp[i] <= 1e-4:
            i += 64
            continue
        periodo = (1 / f) * (1 + rng.normal(0, jitter))
        n = max(8, int(round(periodo * SR)))
        a = amp[i] * (1 + rng.normal(0, shimmer))
        ciclo = pulso_rosenberg(n) * a
        fim = min(n_total, i + n)
        saida[i:fim] += ciclo[: fim - i]
        inicios.append(i)
        i += n
    return saida, inicios


def ressonador(x: np.ndarray, freqs: np.ndarray, bws: np.ndarray) -> np.ndarray:
    """Ressonador de 2 polos com frequência e banda variando por amostra."""
    y = np.zeros_like(x)
    r = np.exp(-np.pi * bws / SR)
    c1 = 2 * r * np.cos(2 * np.pi * freqs / SR)
    c2 = -(r ** 2)
    g = 1 - r
    y1 = y2 = 0.0
    for k in range(len(x)):
        v = g[k] * x[k] + c1[k] * y1 + c2[k] * y2
        y[k] = v
        y2, y1 = y1, v
    return y


VOGAIS = {  # F1..F4 (Hz) para voz adulta de f0 por volta de 200 Hz
    "a": (850, 1250, 2850, 3900),
    "e": (480, 2050, 2800, 3800),
    "i": (330, 2650, 3250, 4000),
    "o": (520, 920, 2750, 3700),
    "u": (360, 820, 2650, 3600),
    "ɛ": (620, 1850, 2700, 3750),
}
BANDAS = (80, 100, 150, 250)


def sintetizar_voz():
    dur = 12.2
    n = int(dur * SR)
    t = np.arange(n) / SR
    f0 = np.zeros(n)
    amp = np.zeros(n)
    formantes = np.tile(np.array(VOGAIS["a"], dtype=float), (n, 1))

    # /a/ sustentado: 3,2 s a 7,7 s, f0 ~212 Hz com vibrato discreto.
    a0, a1 = 3.2, 7.7
    m = (t >= a0) & (t < a1)
    f0[m] = 212 * (1 + 0.004 * np.sin(2 * np.pi * 5.2 * t[m]))
    env = np.clip((t - a0) / 0.09, 0, 1) * np.clip((a1 - t) / 0.12, 0, 1)
    amp[m] = env[m]

    # "Fala" sintética: 8,5 s a 11,5 s. Sílabas com vogais diferentes,
    # entonação declinante e pausas curtas — NÃO é fala real.
    silabas = ["o", "i", "a", "e", "ɛ", "a", "u", "o", "i", "a", "o"]
    inicio, dur_sil = 8.5, 0.255
    for k, v in enumerate(silabas):
        s0 = inicio + k * dur_sil
        s1 = s0 + dur_sil * (0.78 if k not in (4, 8) else 0.6)
        mm = (t >= s0) & (t < s1)
        prog = (s0 - inicio) / (len(silabas) * dur_sil)
        acento = 1.08 if k in (2, 6, 9) else 1.0
        f0[mm] = (228 - 48 * prog) * acento * (1 + 0.02 * np.sin(np.pi * (t[mm] - s0) / (s1 - s0)))
        e = np.clip((t - s0) / 0.03, 0, 1) * np.clip((s1 - t) / 0.04, 0, 1)
        amp[mm] = 0.85 * e[mm]
        alvo = np.array(VOGAIS[v], dtype=float)
        anterior = np.array(VOGAIS[silabas[k - 1]] if k else VOGAIS[v], dtype=float)
        idx = np.where(mm)[0]
        trans = np.clip((t[idx] - s0) / 0.06, 0, 1)[:, None]
        formantes[idx] = anterior * (1 - trans) + alvo * trans

    fonte, inicios = fonte_vozeada(f0, amp)
    aspiracao = rng.normal(0, 1, n) * amp * 0.006
    x = fonte + aspiracao
    sinal = np.zeros(n)
    for j in range(4):
        sinal += ressonador(x, formantes[:, j], np.full(n, BANDAS[j])) * (1.0, 0.6, 0.35, 0.2)[j]

    sinal = sinal / np.max(np.abs(sinal)) * db(-6)  # pico em −6 dBFS: sem saturar

    # Ruído de sala, contínuo, em torno de −61 dBFS RMS.
    ruido = rng.normal(0, 1, n)
    ruido = np.convolve(ruido, np.ones(12) / 12, mode="same")
    ruido = ruido / np.sqrt(np.mean(ruido ** 2)) * db(-61)
    return sinal + ruido, [i for i in inicios if a0 * SR <= i < a1 * SR]


# --------------------------------------------------------------- trilha --

def nota(freq, dur, ataque=1.8, soltura=2.2, harmonicos=(1, 0.35, 0.12)):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for h, a in enumerate(harmonicos, start=1):
        for desafino in (-0.18, 0.0, 0.21):
            s += a * np.sin(2 * np.pi * freq * h * (1 + desafino / 100) * t + rng.uniform(0, 6.28))
    env = np.clip(t / ataque, 0, 1) * np.clip((dur - t) / soltura, 0, 1)
    return s * env


def sino(freq, dur=2.4):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * freq * 2.01 * t)
    return s * np.exp(-t * 2.2) * np.clip(t / 0.01, 0, 1)


def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)


def sintetizar_trilha(dur=96.0):
    n = int(dur * SR)
    mix = np.zeros(n)
    # Fmaj7 – Am7 – Dm9 – G6sus, 8 s cada, em loop. Calmo, sem pulso marcado.
    acordes = [
        [53, 57, 60, 64], [57, 60, 64, 67], [50, 57, 60, 64], [55, 59, 62, 64],
    ]
    passo = 8.0
    k = 0
    while k * passo < dur:
        ac = acordes[k % len(acordes)]
        ini = int(k * passo * SR)
        for m in ac:
            s = nota(hz(m), passo + 2.5) * 0.12
            fim = min(n, ini + len(s))
            mix[ini:fim] += s[: fim - ini]
        baixo = nota(hz(ac[0] - 12), passo + 2.5, harmonicos=(1, 0.2)) * 0.16
        fim = min(n, ini + len(baixo))
        mix[ini:fim] += baixo[: fim - ini]
        # sinos esparsos, pentatônica, 2 por acorde
        for j, off in enumerate((1.5, 5.25)):
            m = ac[(j + k) % 4] + 12
            s = sino(hz(m)) * 0.08
            i0 = ini + int(off * SR)
            fim = min(n, i0 + len(s))
            if i0 < n:
                mix[i0:fim] += s[: fim - i0]
        k += 1
    # entrada e saída suaves
    t = np.arange(n) / SR
    mix *= np.clip(t / 3, 0, 1) * np.clip((dur - t) / 4, 0, 1)
    return mix / np.max(np.abs(mix)) * db(-9)


def efeitos():
    t = np.arange(int(0.06 * SR)) / SR
    clique = np.sin(2 * np.pi * 1500 * t) * np.exp(-t * 90) * db(-18)
    t2 = np.arange(int(0.5 * SR)) / SR
    enviado = (
        np.sin(2 * np.pi * 880 * t2) * np.exp(-t2 * 9) * (t2 < 0.5)
        + np.sin(2 * np.pi * 1318.5 * t2) * np.exp(-np.maximum(t2 - 0.09, 0) * 9) * (t2 >= 0.09)
    ) * db(-20)
    return clique, enviado


if __name__ == "__main__":
    voz, _ = sintetizar_voz()
    gravar_wav(SAIDA / "voz.wav", voz)
    # A trilha vai em MP3 (via ffmpeg) para não pesar no repositório.
    gravar_wav(SAIDA / "trilha.wav", sintetizar_trilha())
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(SAIDA / "trilha.wav"), "-b:a", "160k", str(SAIDA / "trilha.mp3")],
        check=True,
    )
    (SAIDA / "trilha.wav").unlink()
    clique, enviado = efeitos()
    gravar_wav(SAIDA / "clique.wav", clique)
    gravar_wav(SAIDA / "enviado.wav", enviado)
    print("ok:", sorted(p.name for p in SAIDA.glob("*.wav")))
