import React from "react";
import { useCurrentFrame } from "remotion";
import { Fundo, Legenda } from "../ui/cena";
import { cor, raio } from "../tema";
import { easeOutCubic, prog } from "../movimento";

// 2 · O problema: as quatro peças de hoje caem em lugares diferentes da tela.
// Itens da seção "Comparativo" da landing (com CAPE-V no lugar de "escalas").
const PECAS = [
  { titulo: "Gravador do celular", apoio: "sem protocolo nem orientação", x: 150, y: 120, rot: -2.5 },
  { titulo: "Praat no computador", apoio: "valores anotados à mão", x: 1190, y: 90, rot: 2 },
  { titulo: "CAPE-V no papel", apoio: "sem histórico", x: 260, y: 600, rot: 1.5 },
  { titulo: "Laudo no editor de texto", apoio: "digitado peça por peça", x: 1120, y: 640, rot: -2 },
] as const;

const Glifo: React.FC<{ i: number }> = ({ i }) => {
  const s = { stroke: cor.secundario, strokeWidth: 2.4, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={56} height={56} viewBox="0 0 56 56">
      {i === 0 ? (
        <>
          <rect x="18" y="6" width="20" height="44" rx="4" {...s} />
          <circle cx="28" cy="34" r="5" {...s} />
        </>
      ) : null}
      {i === 1 ? (
        <>
          <rect x="6" y="10" width="44" height="28" rx="3" {...s} />
          <path d="M14 30l6-10 6 6 6-12 6 8 6-4" {...s} />
          <path d="M20 46h16M28 38v8" {...s} />
        </>
      ) : null}
      {i === 2 ? (
        <>
          <path d="M12 6h24l8 8v36H12z" {...s} />
          <path d="M18 22h22M18 30h22M18 38h22" {...s} />
          <path d="M24 19v6M32 27v6M22 35v6" {...s} />
        </>
      ) : null}
      {i === 3 ? (
        <>
          <rect x="8" y="8" width="40" height="40" rx="3" {...s} />
          <path d="M8 18h40M16 26h24M16 33h24M16 40h14" {...s} />
        </>
      ) : null}
    </svg>
  );
};

export const Problema: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Fundo>
      {/* Ligações que tentam fechar e não fecham */}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {[
          [470, 230, 1180, 200],
          [1350, 300, 1300, 630],
          [560, 700, 1110, 740],
        ].map(([x1, y1, x2, y2], k) => {
          const p = prog(frame, 70 + k * 12, 110 + k * 12);
          return (
            <line
              key={k}
              x1={x1}
              y1={y1}
              x2={x1 + (x2 - x1) * 0.62 * p}
              y2={y1 + (y2 - y1) * 0.62 * p}
              stroke={cor.lavanda}
              strokeWidth={3}
              strokeDasharray="10 12"
              opacity={p > 0 ? 1 : 0}
            />
          );
        })}
      </svg>
      {PECAS.map((p, i) => {
        const t = prog(frame, 8 + i * 9, 34 + i * 9, easeOutCubic);
        return (
          <div
            key={p.titulo}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: 520,
              boxSizing: "border-box",
              padding: "28px 32px",
              display: "flex",
              gap: 24,
              alignItems: "center",
              background: cor.branco,
              border: `1.5px solid ${cor.lavanda}`,
              borderRadius: raio.grande,
              opacity: t,
              translate: `0px ${(1 - t) * -60}px`,
              rotate: `${p.rot * t}deg`,
            }}
          >
            <Glifo i={i} />
            <div>
              <div style={{ fontSize: 34, fontWeight: 800, color: cor.chumbo }}>{p.titulo}</div>
              <div style={{ fontSize: 26, color: cor.secundario, marginTop: 4 }}>{p.apoio}</div>
            </div>
          </div>
        );
      })}
      <Legenda
        de={95}
        titulo="Cada etapa num lugar diferente."
        apoio="Uma avaliação vocal completa hoje depende de ferramentas que não conversam entre si."
        style={{ left: 330, right: 330, top: 395, textAlign: "center" }}
        tamanho={68}
      />
    </Fundo>
  );
};
