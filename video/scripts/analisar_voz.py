"""Analisa public/audio/voz.wav e gera os dados que o vídeo desenha.

    python3 scripts/analisar_voz.py

Rodar de novo sempre que voz.wav for trocado (por exemplo, pela gravação
real). Nada aqui é medida clínica: são visualizações didáticas do mesmo sinal
que toca no vídeo. As medidas do app (AVQI, CPPS…) vêm do servidor, com o
Praat, e no vídeo aparecem os valores de EXEMPLO do próprio app.

Saídas:
- src/dados/voz.json        segmentos, nível por quadro, espectro, cepstro, ciclos
- public/espectrograma.png  espectrograma de banda estreita (harmônicos visíveis)
"""

from pathlib import Path
import json
import struct
import wave
import zlib

import numpy as np

RAIZ = Path(__file__).resolve().parent.parent
FPS = 30


def ler_wav(caminho: Path):
    with wave.open(str(caminho), "rb") as w:
        sr = w.getframerate()
        canais = w.getnchannels()
        bits = w.getsampwidth() * 8
        dados = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2" if bits == 16 else "<i4")
    x = dados.astype(float).reshape(-1, canais).mean(axis=1)
    return x / (2 ** (bits - 1)), sr


def dbfs_rms(trecho: np.ndarray) -> float:
    rms = np.sqrt(np.mean(trecho ** 2)) if len(trecho) else 0
    return float(20 * np.log10(rms)) if rms > 0 else -120.0


def segmentos(x, sr):
    """Acha a vogal (1º trecho sonoro longo) e a fala (o resto) pela energia."""
    janela = int(0.1 * sr)
    niveis = np.array([dbfs_rms(x[i:i + janela]) for i in range(0, len(x) - janela, janela)])
    sala = float(np.median(niveis[: int(2.0 / 0.1)]))
    ativo = niveis > sala + 20
    trechos, ini = [], None
    for k, a in enumerate(ativo):
        if a and ini is None:
            ini = k
        if not a and ini is not None:
            trechos.append([ini, k])
            ini = None
    if ini is not None:
        trechos.append([ini, len(ativo)])
    # junta pausas curtas (< 0,4 s) — a fala tem pausas entre sílabas
    juntos = []
    for t in trechos:
        if juntos and t[0] - juntos[-1][1] < 4:
            juntos[-1][1] = t[1]
        else:
            juntos.append(t)
    juntos = [t for t in juntos if t[1] - t[0] >= 5]
    vogal = (juntos[0][0] * 0.1, juntos[0][1] * 0.1)
    fala = (juntos[1][0] * 0.1, juntos[-1][1] * 0.1) if len(juntos) > 1 else None
    return sala, vogal, fala


def aferir_sala(x, sr, ate_s):
    """Como `afericao_de_ruido.dart`: leituras de 100 ms, mediana."""
    janela = int(0.1 * sr)
    leituras = [dbfs_rms(x[i:i + janela]) for i in range(int(0.2 * sr), int(ate_s * sr) - janela, janela)]
    return [round(v, 1) for v in leituras], float(np.median(leituras))


def nivel_por_quadro(x, sr):
    """dBFS de uma janela de 100 ms terminando em cada quadro do vídeo."""
    janela = int(0.1 * sr)
    total = int(len(x) / sr * FPS)
    out = []
    for q in range(total):
        fim = int(q / FPS * sr)
        out.append(round(dbfs_rms(x[max(0, fim - janela):fim]), 1))
    return out


def espectrograma_png(x, sr, t0, t1, caminho: Path, fmax=4000, altura=420):
    janela = int(0.04 * sr)  # 40 ms: banda estreita, harmônicos resolvidos
    passo = int(0.008 * sr)
    nfft = 8192
    w = np.hanning(janela)
    colunas = []
    for i in range(int(t0 * sr), int(t1 * sr) - janela, passo):
        espectro = np.abs(np.fft.rfft(x[i:i + janela] * w, nfft)) ** 2
        colunas.append(10 * np.log10(espectro + 1e-14))
    S = np.array(colunas).T  # freq x tempo
    freqs = np.fft.rfftfreq(nfft, 1 / sr)
    alvo = np.linspace(0, fmax, altura)
    S = np.array([np.interp(alvo, freqs, S[:, j]) for j in range(S.shape[1])]).T
    topo = np.percentile(S, 99.7)
    S = np.clip((S - (topo - 65)) / 65, 0, 1)
    S = S[::-1]  # frequência alta em cima

    # Paleta escura do app: escuroFundo → escuroPrimaria → escuroAcento → escuroTexto
    paradas = np.array([[0x17, 0x13, 0x1F], [0x40, 0x18, 0x5E], [0x6A, 0x2F, 0x93], [0xD2, 0xB0, 0xEC], [0xF1, 0xE9, 0xDC]], float)
    pos = np.array([0, 0.35, 0.6, 0.85, 1.0])
    rgb = np.stack([np.interp(S ** 1.2, pos, paradas[:, c]) for c in range(3)], axis=-1).astype(np.uint8)

    h, wd, _ = rgb.shape
    linhas = b"".join(b"\x00" + rgb[r].tobytes() for r in range(h))

    def bloco(tipo, dados):
        return struct.pack(">I", len(dados)) + tipo + dados + struct.pack(">I", zlib.crc32(tipo + dados) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n" + bloco(b"IHDR", struct.pack(">IIBBBBB", wd, h, 8, 2, 0, 0, 0))
    png += bloco(b"IDAT", zlib.compress(linhas, 9)) + bloco(b"IEND", b"")
    caminho.write_bytes(png)
    return {"t0": t0, "t1": t1, "fmax": fmax, "largura": wd, "altura": h}


def fatia_e_cepstro(x, sr, t0, t1):
    """Espectro de uma fatia e o cepstro de potência suavizado, com regressão e pico.

    Segue a ideia do CPPS (Hillenbrand; Praat PowerCepstrogram): cepstros de
    janelas sucessivas da vogal, médios no tempo e suavizados na quefrência;
    o pico procurado entre 60 e 330 Hz; a altura dele acima da reta de
    regressão. Didático — não é a medida do app (essa vem do servidor).
    """
    n = 2048
    passo = int(0.01 * sr)
    w = np.hanning(n)
    meio = int((t0 + t1) / 2 * sr)
    X = np.abs(np.fft.rfft(x[meio:meio + n] * w)) ** 2
    log_esp = 10 * np.log10(X + 1e-14)
    freqs = np.fft.rfftfreq(n, 1 / sr)
    sel = freqs <= 4000
    espectro = {"f": [round(float(v), 1) for v in freqs[sel]], "db": [round(float(v), 1) for v in log_esp[sel]]}

    cepstros = []
    for i in range(int((t0 + 0.2) * sr), int((t1 - 0.2) * sr) - n, passo):
        Xi = np.abs(np.fft.rfft(x[i:i + n] * w)) ** 2
        Li = 10 * np.log10(Xi + 1e-14)
        cepstros.append(10 * np.log10(np.abs(np.fft.irfft(Li)) ** 2 + 1e-14))
    ceps_db = np.mean(cepstros, axis=0)
    ceps_db = np.convolve(ceps_db, np.ones(11) / 11, mode="same")  # ~0,25 ms
    q = np.arange(len(ceps_db)) / sr
    faixa = (q >= 1 / 1000) & (q <= 1 / 60)
    qf, cf = q[faixa], ceps_db[faixa]
    a, b = np.polyfit(qf, cf, 1)
    busca = (qf >= 1 / 330) & (qf <= 1 / 60)
    k = np.argmax(np.where(busca, cf, -1e9))
    pico_q, pico_db = float(qf[k]), float(cf[k])
    reta_no_pico = a * pico_q + b
    passo_q = max(1, len(qf) // 500)
    cepstro = {
        "q_ms": [round(float(v) * 1000, 3) for v in qf[::passo_q]],
        "db": [round(float(v), 2) for v in cf[::passo_q]],
        "reta": {"a": float(a) / 1000, "b": float(b)},  # db = a*q_ms + b
        "pico": {"q_ms": round(pico_q * 1000, 3), "db": round(pico_db, 2), "reta_db": round(float(reta_no_pico), 2)},
    }
    return espectro, cepstro, 1 / pico_q


def ciclos_ampliados(x, sr, t, f0, quantos=4):
    """Trecho de ~4 ciclos e o pico de cada um: período e amplitude, ciclo a ciclo."""
    periodo = int(sr / f0)
    i0 = int(t * sr)
    trecho = x[i0:i0 + periodo * (quantos + 1)]
    picos = []
    k = int(np.argmax(trecho[:periodo]))
    while k < len(trecho) and len(picos) < quantos + 1:
        picos.append(k)
        busca_ini = k + int(periodo * 0.7)
        busca_fim = min(len(trecho), k + int(periodo * 1.3))
        if busca_ini >= busca_fim:
            break
        k = busca_ini + int(np.argmax(trecho[busca_ini:busca_fim]))
    escala = float(np.max(np.abs(trecho)))
    return {
        "amostras": [round(float(v) / escala, 4) for v in trecho],
        "picos": [{"i": int(p), "a": round(float(trecho[p]) / escala, 4)} for p in picos],
        "sr": sr,
    }


if __name__ == "__main__":
    x, sr = ler_wav(RAIZ / "public" / "audio" / "voz.wav")
    sala_rapida, vogal, fala = segmentos(x, sr)
    leituras, sala = aferir_sala(x, sr, vogal[0] - 0.1)
    meio = (vogal[0] + vogal[1]) / 2
    espectro, cepstro, f0_cepstro = fatia_e_cepstro(x, sr, vogal[0], vogal[1])
    fim_esp = (fala[1] if fala else vogal[1]) + 0.2
    esp = espectrograma_png(x, sr, vogal[0] - 0.15, fim_esp, RAIZ / "public" / "espectrograma.png")
    dados = {
        "fonte": "public/audio/voz.wav",
        "sintetica": True,
        "duracao_s": round(len(x) / sr, 3),
        "vogal": [round(v, 2) for v in vogal],
        "fala": [round(v, 2) for v in fala] if fala else None,
        "sala": {"leituras": leituras, "mediana_dbfs": round(sala, 1)},
        "nivel_por_quadro": nivel_por_quadro(x, sr),
        "espectrograma": esp,
        "f0_aprox_hz": round(f0_cepstro, 1),
        "espectro": espectro,
        "cepstro": cepstro,
        "ciclos": ciclos_ampliados(x, sr, meio, f0_cepstro),
    }
    destino = RAIZ / "src" / "dados" / "voz.json"
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(json.dumps(dados, ensure_ascii=False))
    print(f"vogal {vogal}  fala {fala}  sala {sala:.1f} dBFS  f0≈{f0_cepstro:.0f} Hz  espectrograma {esp['largura']}x{esp['altura']}")
