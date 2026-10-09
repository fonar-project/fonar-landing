import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { Fundo, Legenda, VozDaCena } from "../ui/cena";
import voz from "../dados/voz.json";
import { cor } from "../tema";
import { DEIXAS_DE_VOZ, VOGAL, quadros } from "../linhaDoTempo";
import { entra, mix, prog } from "../movimento";

// 7b · Ciência, no tema escuro do app. Visualização DIDÁTICA feita a partir da
// gravação que toca — não é a medida do app (essa vem do servidor, pelo Praat).
const [V_INI, , V_DUR] = DEIXAS_DE_VOZ.Ciencia[0];
const V_FIM = V_INI + quadros(V_DUR);
const CPPS_DE = 150;
const AVQI_DE = 290;
const CICLOS_DE = 345;

const rotulo: React.CSSProperties = { fontSize: 24, fontWeight: 700, color: cor.escuroAcento };
const apoio: React.CSSProperties = { fontSize: 20, fontWeight: 500, color: cor.escuroSecundario };

// ------------------------------------------------------------ gráficos --

const caminho = (xs: number[], ys: number[], xr: [number, number], yr: [number, number], w: number, h: number, ate = 1) => {
  const n = Math.max(2, Math.floor(xs.length * ate));
  let d = "";
  for (let i = 0; i < n; i++) {
    const x = ((xs[i] - xr[0]) / (xr[1] - xr[0])) * w;
    const y = h - ((ys[i] - yr[0]) / (yr[1] - yr[0])) * h;
    d += `${i ? "L" : "M"}${x.toFixed(1)},${Math.max(-20, Math.min(h + 20, y)).toFixed(1)}`;
  }
  return d;
};

const Eixos: React.FC<{ w: number; h: number; x: string; y: string }> = ({ w, h, x, y }) => (
  <>
    <line x1={0} y1={h} x2={w} y2={h} stroke={cor.escuroBorda} strokeWidth={2} />
    <line x1={0} y1={0} x2={0} y2={h} stroke={cor.escuroBorda} strokeWidth={2} />
    <text x={w} y={h + 34} textAnchor="end" fill={cor.escuroSecundario} fontSize={20}>
      {x}
    </text>
    <text x={-12} y={-14} fill={cor.escuroSecundario} fontSize={20}>
      {y}
    </text>
  </>
);

// ------------------------------------------------------- espectrograma --

const Espectrograma: React.FC<{ frame: number }> = ({ frame }) => {
  const e = voz.espectrograma;
  const W = 1500;
  const H = 520;
  const janela = VOGAL.ate - VOGAL.de + 0.3; // só a vogal, com folga
  const larguraImg = (W * (e.t1 - e.t0)) / janela;
  const revelado = (0.15 + Math.max(0, Math.min(V_DUR, (frame - V_INI) / 30))) / janela;
  const recolhe = prog(frame, CPPS_DE, CPPS_DE + 20);
  const some = prog(frame, AVQI_DE - 12, AVQI_DE);
  const f0 = voz.f0_aprox_hz;
  const fatiaX = W * ((VOGAL.ate - VOGAL.de) / 2 + 0.15) / janela;
  return (
    <div
      style={{
        position: "absolute",
        left: mix(250, 140, recolhe),
        top: mix(210, 190, recolhe),
        width: W,
        height: H,
        scale: String(mix(1, 0.36, recolhe)),
        transformOrigin: "0 0",
        opacity: 1 - some,
      }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", width: W * revelado, borderRadius: 6 }}>
        <Img src={staticFile("espectrograma.png")} style={{ width: larguraImg, height: H, maxWidth: "none" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, border: `2px solid ${cor.escuroBorda}`, borderRadius: 6 }} />
      {[0, 1000, 2000, 3000, 4000].map((f) => (
        <div key={f} style={{ position: "absolute", left: -110, width: 96, textAlign: "right", top: H - (f / e.fmax) * H - 13, fontSize: 22, color: cor.escuroSecundario, opacity: 1 - recolhe }}>
          {f.toLocaleString("pt-BR")} Hz
        </div>
      ))}
      {[1, 2, 3, 4, 5].map((k) => {
        const y = H - ((k * f0) / e.fmax) * H;
        const op = prog(frame, 60 + k * 8, 72 + k * 8) * (1 - recolhe);
        return (
          <div key={k} style={{ position: "absolute", left: W + 18, top: y - 15, opacity: op, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 16, height: 2, background: cor.escuroAcento }} />
            <span style={{ ...rotulo, fontSize: 24 }}>{k === 1 ? "f0" : `${k}f0`}</span>
          </div>
        );
      })}
      {frame >= CPPS_DE ? (
        <div style={{ position: "absolute", left: fatiaX - 3, top: 0, width: 6, height: H, background: cor.escuroTexto, opacity: prog(frame, CPPS_DE + 4, CPPS_DE + 14) }} />
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------- CPPS --

const Cpps: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < CPPS_DE + 14 || frame >= AVQI_DE) return null;
  const sai = prog(frame, AVQI_DE - 12, AVQI_DE);
  const esp = voz.espectro;
  const cep = voz.cepstro;
  const W = 640;
  const H = 360;
  const fs = esp.f.map((f, i) => [f, esp.db[i]] as const).filter(([f]) => f <= 4000);
  const dbMax = Math.max(...fs.map(([, d]) => d));
  const pEsp = prog(frame, CPPS_DE + 16, CPPS_DE + 40);
  const pCep = prog(frame, CPPS_DE + 44, CPPS_DE + 70);
  const pReta = prog(frame, CPPS_DE + 72, CPPS_DE + 84);
  const pPico = prog(frame, CPPS_DE + 86, CPPS_DE + 98);
  const pCpps = prog(frame, CPPS_DE + 98, CPPS_DE + 108);

  const qr: [number, number] = [1, 16.7];
  const yMin = Math.min(...cep.db);
  const yr: [number, number] = [yMin - 2, cep.pico.db + 6];
  const xq = (q: number) => ((q - qr[0]) / (qr[1] - qr[0])) * W;
  const yq = (d: number) => H - ((d - yr[0]) / (yr[1] - yr[0])) * H;
  const reta = (q: number) => cep.reta.a * q + cep.reta.b;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - sai }}>
      {/* espectro da fatia */}
      <div style={{ position: "absolute", left: 140, top: 420, ...entra(frame, CPPS_DE + 14, 10, 12) }}>
        <div style={{ ...rotulo, marginBottom: 20 }}>1 · espectro de uma fatia</div>
        <svg width={W} height={H + 50} style={{ overflow: "visible" }}>
          <Eixos w={W} h={H} x="frequência (Hz)" y="dB" />
          <path
            d={caminho(fs.map(([f]) => f), fs.map(([, d]) => d), [0, 4000], [dbMax - 80, dbMax + 4], W, H, pEsp)}
            fill="none"
            stroke={cor.escuroTexto}
            strokeWidth={2.5}
          />
        </svg>
      </div>
      {/* seta */}
      <svg width={120} height={40} style={{ position: "absolute", left: 850, top: 620, opacity: prog(frame, CPPS_DE + 38, CPPS_DE + 46) }}>
        <path d="M5 20h100M90 8l16 12-16 12" stroke={cor.escuroAcento} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {/* cepstro */}
      <div style={{ position: "absolute", left: 1010, top: 190, opacity: prog(frame, CPPS_DE + 40, CPPS_DE + 48) }}>
        <div style={{ ...rotulo, marginBottom: 20 }}>2 · cepstro: o espectro do espectro</div>
        <svg width={W + 140} height={H + 50} style={{ overflow: "visible" }}>
          <Eixos w={W} h={H} x="quefrência (ms)" y="dB" />
          <path d={caminho(cep.q_ms, cep.db, qr, yr, W, H, pCep)} fill="none" stroke={cor.escuroTexto} strokeWidth={2.2} />
          {pReta > 0 ? (
            <line
              x1={xq(qr[0])}
              y1={yq(reta(qr[0]))}
              x2={xq(mix(qr[0], qr[1], pReta))}
              y2={yq(reta(mix(qr[0], qr[1], pReta)))}
              stroke={cor.escuroAcento}
              strokeWidth={3}
              strokeDasharray="10 8"
            />
          ) : null}
          {pPico > 0 ? (
            <>
              <circle cx={xq(cep.pico.q_ms)} cy={yq(cep.pico.db)} r={10 * pPico} fill={cor.escuroAcento} />
              <text x={xq(cep.pico.q_ms) + 18} y={yq(cep.pico.db) - 10} fill={cor.escuroAcento} fontSize={22} fontWeight={700} opacity={pPico}>
                4 · pico cepstral (≈ 1/f0)
              </text>
            </>
          ) : null}
          {pCpps > 0 ? (
            <>
              <line
                x1={xq(cep.pico.q_ms)}
                x2={xq(cep.pico.q_ms)}
                y1={yq(cep.pico.reta_db)}
                y2={mix(yq(cep.pico.reta_db), yq(cep.pico.db), pCpps)}
                stroke={cor.escuroTexto}
                strokeWidth={4}
              />
              <text x={xq(cep.pico.q_ms) - 16} y={(yq(cep.pico.reta_db) + yq(cep.pico.db)) / 2 + 8} textAnchor="end" fill={cor.escuroTexto} fontSize={30} fontWeight={800} opacity={pCpps}>
                CPPS
              </text>
            </>
          ) : null}
          {pReta > 0 ? (
            <text x={W} y={yq(reta(qr[1])) - 14} textAnchor="end" fill={cor.escuroAcento} fontSize={20} opacity={pReta}>
              3 · regressão
            </text>
          ) : null}
        </svg>
        <div style={{ ...apoio, marginTop: 8, width: 760, opacity: pCpps }}>
          CPPS: quanto o pico cepstral se destaca da linha de regressão. Voz mais periódica, pico mais saliente.
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- AVQI --

const COMPONENTES = ["CPPS", "HNR", "Shimmer local", "Shimmer local (dB)", "Slope do LTAS", "Tilt do LTAS"];

const Avqi: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < AVQI_DE || frame >= CICLOS_DE) return null;
  const sai = prog(frame, CICLOS_DE - 10, CICLOS_DE);
  const junta = prog(frame, AVQI_DE + 26, AVQI_DE + 44);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - sai }}>
      {COMPONENTES.map((c, i) => {
        const ang = (i / COMPONENTES.length) * Math.PI * 2 - Math.PI / 2;
        const x0 = 960 + Math.cos(ang) * 470;
        const y0 = 520 + Math.sin(ang) * 300;
        const x1 = 960 + Math.cos(ang) * 270;
        const y1 = 520 + Math.sin(ang) * 175;
        const e = prog(frame, AVQI_DE + i * 3, AVQI_DE + 12 + i * 3);
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: mix(x0, x1, junta) - 160,
              top: mix(y0, y1, junta) - 30,
              width: 320,
              height: 60,
              borderRadius: 999,
              border: `2px solid ${cor.escuroBorda}`,
              background: cor.escuroCartao,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              color: cor.escuroTexto,
              opacity: e,
            }}
          >
            {c}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 960 - 170,
          top: 520 - 80,
          width: 340,
          height: 160,
          borderRadius: 28,
          background: cor.escuroPrimaria,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: junta,
          scale: String(mix(0.92, 1, junta)),
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, color: cor.escuroTexto, letterSpacing: 1 }}>AVQI</div>
        <div style={{ fontSize: 20, color: cor.escuroTexto, opacity: 0.85 }}>{"Índice de qualidade vocal acústica"}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", ...apoio, fontSize: 26, opacity: junta }}>
        Seis medidas, da vogal sustentada e da fala encadeada, num índice só.
      </div>
    </div>
  );
};

// --------------------------------------------------- jitter e shimmer --

const Ciclos: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < CICLOS_DE) return null;
  const c = voz.ciclos;
  const picos = c.picos.slice(0, 4);
  const W = 1400;
  const H = 360;
  const n = c.amostras.length;
  const xs = c.amostras.map((_, i) => i);
  const p = prog(frame, CICLOS_DE + 2, CICLOS_DE + 20);
  const pT = prog(frame, CICLOS_DE + 18, CICLOS_DE + 30);
  const pA = prog(frame, CICLOS_DE + 30, CICLOS_DE + 42);
  const x = (i: number) => (i / (n - 1)) * W;
  const y = (a: number) => H / 2 - a * (H / 2) * 0.9;
  return (
    <div style={{ position: "absolute", left: 260, top: 260, ...entra(frame, CICLOS_DE, 10, 12) }}>
      <svg width={W} height={H + 120} style={{ overflow: "visible" }}>
        <line x1={0} x2={W} y1={H / 2} y2={H / 2} stroke={cor.escuroBorda} strokeWidth={2} />
        <path d={caminho(xs, c.amostras, [0, n - 1], [-1.11, 1.11], W, H, p)} fill="none" stroke={cor.escuroTexto} strokeWidth={3} />
        {picos.slice(0, 3).map((pk, k) => {
          const x1 = x(pk.i);
          const x2 = x(picos[k + 1].i);
          return (
            <g key={k} opacity={pT}>
              <line x1={x1} x2={x2} y1={-30} y2={-30} stroke={cor.escuroAcento} strokeWidth={3} />
              <line x1={x1} x2={x1} y1={-42} y2={-18} stroke={cor.escuroAcento} strokeWidth={3} />
              <line x1={x2} x2={x2} y1={-42} y2={-18} stroke={cor.escuroAcento} strokeWidth={3} />
              <text x={(x1 + x2) / 2} y={-50} textAnchor="middle" fill={cor.escuroAcento} fontSize={26} fontWeight={700}>
                T{k + 1}
              </text>
            </g>
          );
        })}
        {picos.map((pk, k) => (
          <g key={k} opacity={pA}>
            <line x1={x(pk.i)} x2={x(pk.i)} y1={H / 2} y2={y(pk.a)} stroke={cor.escuroPrimaria} strokeWidth={6} />
            <circle cx={x(pk.i)} cy={y(pk.a)} r={7} fill={cor.escuroAcento} />
            <text x={x(pk.i) + 12} y={y(pk.a) + 8} fill={cor.escuroTexto} fontSize={24} fontWeight={700}>
              A{k + 1}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", gap: 80, marginTop: 10 }}>
        <div style={{ opacity: pT }}>
          <div style={{ ...rotulo, fontSize: 30 }}>Jitter</div>
          <div style={{ ...apoio, fontSize: 24 }}>variação do período (T), ciclo a ciclo</div>
        </div>
        <div style={{ opacity: pA }}>
          <div style={{ ...rotulo, fontSize: 30 }}>Shimmer</div>
          <div style={{ ...apoio, fontSize: 24 }}>variação da amplitude (A), ciclo a ciclo</div>
        </div>
      </div>
    </div>
  );
};

export const Ciencia: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Fundo escuro>
      <VozDaCena cena="Ciencia" />
      <Espectrograma frame={frame} />
      <Cpps frame={frame} />
      <Avqi frame={frame} />
      <Ciclos frame={frame} />
      <Legenda
        escuro
        de={4}
        ate={CPPS_DE}
        titulo="Os harmônicos da voz, um sobre o outro."
        apoio="Espectrograma de banda estreita do /a/: cada linha é um múltiplo de f0."
        style={{ left: 250, top: 760, width: 1500 }}
        tamanho={52}
      />
      <Legenda escuro de={CPPS_DE + 6} ate={AVQI_DE} titulo="CPPS em quatro passos." style={{ left: 140, top: 80, width: 900 }} tamanho={52} />
      <Legenda escuro de={AVQI_DE} ate={CICLOS_DE} titulo="AVQI" apoio="sem ponto de corte: classificação só com referência validada" style={{ left: 120, top: 90, width: 900 }} tamanho={52} />
      <Legenda escuro de={CICLOS_DE} titulo="Jitter e shimmer, ciclo a ciclo." style={{ left: 260, top: 90, width: 1400 }} tamanho={52} />
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 50,
          padding: "10px 18px",
          borderRadius: 999,
          border: `1.5px solid ${cor.escuroBorda}`,
          fontSize: 20,
          fontWeight: 600,
          color: cor.escuroSecundario,
        }}
      >
        Visualização didática da gravação · no app, as medidas vêm do servidor (Praat)
      </div>
    </Fundo>
  );
};

export const V_FIM_CIENCIA = V_FIM;
