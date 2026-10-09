import React from "react";
import { useCurrentFrame } from "remotion";
import { Fundo } from "../ui/cena";
import { cor } from "../tema";
import { entra } from "../movimento";

// 11 · Fechamento: marca, promessa, plataformas, endereço e origem acadêmica.
export const Fechamento: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Fundo>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, ...entra(frame, 4, 14, 14) }}>
          {/* Marca provisória da landing (public/marca/favicon.svg) */}
          <svg width={110} height={110} viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill={cor.roxo} />
            <path d="M22 16H44V25H31V29H40V38H31V48H22Z" fill={cor.creme} />
          </svg>
          <span style={{ fontSize: 120, fontWeight: 800, letterSpacing: 6, color: cor.roxo }}>FONAR</span>
        </div>
        <div style={{ marginTop: 34, fontSize: 52, fontWeight: 700, color: cor.chumbo, ...entra(frame, 14, 14, 14) }}>
          Avaliação vocal clínica, do consultório ao laudo.
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 22, alignItems: "center", fontSize: 32, fontWeight: 700, color: cor.secundario, ...entra(frame, 24, 14, 14) }}>
          <span>Android e Windows</span>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: cor.lavanda }} />
          <span style={{ color: cor.roxo }}>appfonar.web.app</span>
        </div>
        <div style={{ marginTop: 22, fontSize: 28, color: cor.secundario, ...entra(frame, 32, 14, 14) }}>
          TCC — Engenharia de Software, PUC-Campinas
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontSize: 19, color: cor.secundario, ...entra(frame, 40, 14, 6) }}>
        Praat é software independente da Universidade de Amsterdam, sem vínculo com o FONAR. O FONAR é ferramenta de apoio à decisão e não emite diagnóstico.
      </div>
    </Fundo>
  );
};
