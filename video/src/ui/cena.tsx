import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { cor, fonte } from "../tema";
import { entra } from "../movimento";
import { DEIXAS_DE_VOZ, quadros } from "../linhaDoTempo";
import { FPS } from "../tema";

export const Fundo: React.FC<{ escuro?: boolean; children: React.ReactNode }> = ({ escuro, children }) => (
  <AbsoluteFill style={{ background: escuro ? cor.escuroFundo : cor.creme, fontFamily: fonte, color: escuro ? cor.escuroTexto : cor.chumbo }}>
    {children}
  </AbsoluteFill>
);

/** Legenda do vídeo (fora do app): título + apoio opcional, entra com deslize curto. */
export const Legenda: React.FC<{
  de: number;
  ate?: number;
  titulo: React.ReactNode;
  apoio?: React.ReactNode;
  escuro?: boolean;
  style?: React.CSSProperties;
  tamanho?: number;
}> = ({ de, ate, titulo, apoio, escuro, style, tamanho = 60 }) => {
  const frame = useCurrentFrame();
  if (frame < de || (ate !== undefined && frame >= ate)) return null;
  const e = entra(frame, de, 12, 14);
  const saida = ate === undefined ? 1 : Math.min(1, Math.max(0, (ate - frame) / 8));
  return (
    <div style={{ position: "absolute", ...style, opacity: e.opacity * saida, translate: e.translate }}>
      <div style={{ fontSize: tamanho, lineHeight: 1.08, fontWeight: 800, letterSpacing: -1, color: escuro ? cor.escuroTexto : cor.roxo }}>
        {titulo}
      </div>
      {apoio ? (
        <div style={{ marginTop: 18, fontSize: 30, lineHeight: 1.35, fontWeight: 500, color: escuro ? cor.escuroSecundario : cor.secundario }}>
          {apoio}
        </div>
      ) : null}
    </div>
  );
};

/** Toca os trechos de voz desta cena, conforme DEIXAS_DE_VOZ. */
export const VozDaCena: React.FC<{ cena: string }> = ({ cena }) => (
  <>
    {(DEIXAS_DE_VOZ[cena] ?? []).map(([q, deS, durS]) => (
      <Sequence key={q} from={q} durationInFrames={quadros(durS)} layout="none">
        <Audio src={staticFile("audio/voz.wav")} trimBefore={Math.round(deS * FPS)} trimAfter={Math.round((deS + durS) * FPS)} />
      </Sequence>
    ))}
  </>
);

/** Efeito discreto de interface num quadro. */
export const Som: React.FC<{ em: number; arquivo: "clique" | "enviado"; volume?: number }> = ({ em, arquivo, volume = 1 }) => (
  <Sequence from={em} durationInFrames={20} layout="none">
    <Audio src={staticFile(`audio/${arquivo}.wav`)} volume={volume} />
  </Sequence>
);

/** Toque na tela: um círculo que se expande e some, sem repetir. */
export const Toque: React.FC<{ em: number; x: number; y: number; claro?: boolean }> = ({ em, x, y, claro }) => {
  const frame = useCurrentFrame();
  const t = frame - em;
  if (t < 0 || t > 14) return null;
  const p = t / 14;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 30,
        top: y - 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        background: claro ? "rgba(255,255,255,0.5)" : "rgba(64, 8, 94, 0.22)",
        scale: String(0.4 + p * 0.9),
        opacity: 1 - p,
      }}
    />
  );
};

/** Centraliza um elemento de tamanho natural (w×h) em (cx, cy) com escala. */
export const Posicionar: React.FC<{
  w: number;
  h: number;
  cx: number;
  cy: number;
  escala: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ w, h, cx, cy, escala, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: cx - w / 2,
      top: cy - h / 2,
      width: w,
      height: h,
      scale: String(escala),
      ...style,
    }}
  >
    {children}
  </div>
);
