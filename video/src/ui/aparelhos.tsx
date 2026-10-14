// Molduras de aparelho: celular Android e notebook com Windows.
// O app roda nas duas plataformas com o mesmo código; nada de iPhone ou macOS.
import React from "react";
import { cor, fonte } from "../tema";

export const CELULAR_LARGURA = 414;
export const CELULAR_ALTURA = 844 + 28 + 22 + 24;

/** Celular Android: câmera em furo, barra de gestos. Tela 390×844. */
export const Celular: React.FC<{
  children: React.ReactNode;
  escala?: number;
  style?: React.CSSProperties;
  barraDeStatus?: boolean;
}> = ({ children, escala = 1, style, barraDeStatus = true }) => {
  const borda = 12;
  return (
    <div
      style={{
        width: 390 + borda * 2,
        height: CELULAR_ALTURA,
        borderRadius: 52,
        background: "#1E1A26",
        padding: borda,
        boxSizing: "border-box",
        boxShadow: "0 40px 80px -30px rgba(23, 19, 31, 0.55), inset 0 0 0 2px #2E2838",
        scale: String(escala),
        ...style,
      }}
    >
      <div style={{ width: 390, height: 844 + 28 + 22, borderRadius: 40, overflow: "hidden", background: cor.creme, position: "relative" }}>
        {barraDeStatus ? (
          <div
            style={{
              height: 28,
              display: "flex",
              alignItems: "center",
              padding: "0 22px",
              fontFamily: fonte,
              fontSize: 13,
              fontWeight: 600,
              color: cor.chumbo,
              background: cor.creme,
            }}
          >
            10:05
            <div style={{ marginLeft: "auto", display: "flex", gap: 5, alignItems: "center" }}>
              <div style={{ width: 14, height: 9, borderRadius: 2, border: `1.5px solid ${cor.chumbo}` }} />
            </div>
          </div>
        ) : null}
        <div style={{ position: "absolute", top: 9, left: 195 - 6, width: 12, height: 12, borderRadius: 6, background: "#1E1A26" }} />
        {children}
        <div style={{ position: "absolute", bottom: 8, left: 195 - 54, width: 108, height: 4, borderRadius: 2, background: "rgba(65, 60, 88, 0.55)" }} />
      </div>
    </div>
  );
};

/** Notebook com a janela do app no Windows (barra de título com –, □, ×). */
export const Notebook: React.FC<{ children: React.ReactNode; escala?: number; style?: React.CSSProperties }> = ({
  children,
  escala = 1,
  style,
}) => (
  <div style={{ scale: String(escala), ...style }}>
    <div
      style={{
        width: 1440 + 36,
        padding: "18px 18px 22px",
        boxSizing: "border-box",
        background: "#1E1A26",
        borderRadius: "22px 22px 6px 6px",
        boxShadow: "0 50px 90px -40px rgba(23, 19, 31, 0.55)",
      }}
    >
      <div style={{ width: 1440, background: cor.creme, overflow: "hidden" }}>
        <div
          style={{
            height: 34,
            display: "flex",
            alignItems: "center",
            background: "#F3EEE6",
            borderBottom: "1px solid #E6DED2",
            fontFamily: "Segoe UI, " + fonte,
            fontSize: 13,
            color: cor.chumbo,
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 4, background: cor.roxo, margin: "0 10px 0 12px" }} />
          FONAR
          <div style={{ marginLeft: "auto", display: "flex", height: "100%" }}>
            {["min", "max", "fechar"].map((b) => (
              <div key={b} style={{ width: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {b === "min" ? <div style={{ width: 10, height: 1, background: cor.chumbo }} /> : null}
                {b === "max" ? <div style={{ width: 9, height: 9, border: `1px solid ${cor.chumbo}` }} /> : null}
                {b === "fechar" ? <span style={{ fontSize: 16, lineHeight: 1 }}>✕</span> : null}
              </div>
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
    <div style={{ width: 1440 + 36 + 160, marginLeft: -80, height: 26, background: "linear-gradient(#2A2533, #16121C)", borderRadius: "0 0 26px 26px" }} />
  </div>
);
