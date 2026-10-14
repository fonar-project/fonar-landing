import React from "react";
import { useCurrentFrame } from "remotion";
import { Fundo, Legenda, Posicionar, VozDaCena } from "../ui/cena";
import { Notebook } from "../ui/aparelhos";
import { AppDesktop, Botao, Icone, Pilula } from "../ui/app";
import { PACIENTE, S } from "../dados/textos";
import { cor, raio, tipo } from "../tema";
import { DEIXAS_DE_VOZ } from "../linhaDoTempo";
import { easeInOut, entra, mix, prog } from "../movimento";

// 8 · CAPE-V: seis parâmetros na régua de 0 a 100, marcados ouvindo a amostra.
// O app não tem CAPE-V de exemplo: as posições aqui são ILUSTRATIVAS e o
// número não aparece — inventar uma nota seria inventar julgamento clínico.
const MARCAS = [
  { pos: 0.36, de: 60 },
  { pos: 0.28, de: 100 },
  { pos: 0.2, de: 140 },
];
const TOCA_DE = DEIXAS_DE_VOZ.CapeV[0][0];
const TOTAL_S = DEIXAS_DE_VOZ.CapeV.reduce((s, d) => s + d[2], 0);

// O − e o + do ajuste fino (US28, _BotaoDeAjuste): 48 px, centrados na
// linha. Sem marca, apagados, na cor da borda; com marca, na cor de acento.
const Ajuste: React.FC<{ simbolo: string; ativo: boolean }> = ({ simbolo, ativo }) => (
  <div
    style={{
      width: 48,
      height: 48,
      flex: "none",
      marginTop: 18 - 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...tipo.titleLarge,
      color: ativo ? cor.roxo : cor.lavanda,
    }}
  >
    {simbolo}
  </div>
);

const ReguaComAjuste: React.FC<{ marca: number | null; marcada: boolean }> = ({ marca, marcada }) => (
  <div style={{ display: "flex", gap: 4 }}>
    <Ajuste simbolo="−" ativo={marcada} />
    <div style={{ flex: 1 }}>
      <Regua marca={marca} />
    </div>
    <Ajuste simbolo="+" ativo={marcada} />
  </div>
);

const Regua: React.FC<{ marca: number | null }> = ({ marca }) => {
  const W = 730;
  return (
    <div style={{ position: "relative", height: 62 }}>
      <svg width={W + 4} height={30} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={2} x2={W + 2} y1={18} y2={18} stroke={cor.chumbo} strokeWidth={2} />
        {Array.from({ length: 51 }).map((_, i) => {
          const x = 2 + (i / 50) * W;
          const alto = i % 5 === 0 ? 14 : 7;
          return <line key={i} x1={x} x2={x} y1={18 - alto} y2={18} stroke={cor.chumbo} strokeWidth={i % 5 === 0 ? 1.6 : 1} />;
        })}
        {marca !== null ? (
          <g transform={`translate(${2 + marca * W} 0)`}>
            <rect x={-3} y={-6} width={6} height={30} rx={2} fill={cor.roxo} />
          </g>
        ) : null}
      </svg>
      <div style={{ position: "absolute", top: 26, left: 0, right: 0, display: "flex", justifyContent: "space-between", fontSize: 14, color: cor.secundario }}>
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => (
          <span key={n} style={{ width: 24, textAlign: "center", marginLeft: n === 0 ? -6 : 0 }}>
            {n}
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", top: 42, left: 0, right: 0, display: "flex", justifyContent: "space-between", fontSize: 14, color: cor.secundario }}>
        <span>{S.capeVSemDesvio}</span>
        <span>{S.capeVDesvioExtremo}</span>
      </div>
    </div>
  );
};

const Linha: React.FC<{ nome: string; frame: number; marca?: { pos: number; de: number } }> = ({ nome, frame, marca }) => {
  const ativa = marca && frame >= marca.de;
  const pos = ativa ? mix(0.02, marca.pos, prog(frame, marca.de, marca.de + 22, easeInOut)) : null;
  const marcada = marca && frame >= marca.de + 22;
  return (
    <div style={{ background: cor.branco, border: `1px solid ${ativa ? cor.roxo : cor.lavanda}`, borderRadius: raio.medio, padding: "16px 16px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ ...tipo.titleMedium }}>{nome}</span>
        <span style={{ fontSize: 14, color: cor.secundario, opacity: ativa ? 0 : 1 }}>{S.capeVNaoMarcado}</span>
      </div>
      <div style={{ marginTop: 6 }}>
        <ReguaComAjuste marca={pos} marcada={Boolean(marcada)} />
      </div>
      {marcada ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, ...entra(frame, marca!.de + 22) }}>
          <span style={{ ...tipo.labelMedium, marginRight: 6 }}>{S.capeVConsistencia}</span>
          {[S.capeVConsistente, S.capeVIntermitente].map((c, i) => {
            const escolhida = i === 0 && frame >= marca!.de + 30;
            return (
              <span
                key={c}
                style={{
                  padding: "6px 14px",
                  borderRadius: raio.pilula,
                  border: `1.5px solid ${escolhida ? cor.roxo : cor.lavanda}`,
                  background: escolhida ? cor.roxo : "transparent",
                  color: escolhida ? cor.branco : cor.chumbo,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {c}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

const Player: React.FC<{ frame: number }> = ({ frame }) => {
  const t = Math.max(0, Math.min(TOTAL_S, (frame - TOCA_DE) / 30));
  const tocando = frame >= TOCA_DE && t < TOTAL_S;
  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, background: cor.branco, border: `1px solid ${cor.lavanda}`, borderRadius: raio.medio, padding: "10px 16px" }}>
      <span style={{ ...tipo.labelMedium }}>{S.capeVAmostra}</span>
      <div style={{ width: 40, height: 40, borderRadius: 20, background: cor.roxo, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icone nome={tocando ? "pausar" : "reproduzir"} tamanho={20} cor={cor.branco} />
      </div>
      <div style={{ flex: 1, height: 4, background: cor.lavanda, borderRadius: 2 }}>
        <div style={{ width: `${(t / TOTAL_S) * 100}%`, height: "100%", background: cor.roxo, borderRadius: 2 }} />
      </div>
      <span style={{ ...tipo.bodySmall, fontVariantNumeric: "tabular-nums" }}>
        {mmss(t)} / {mmss(TOTAL_S)}
      </span>
    </div>
  );
};

export const CapeV: React.FC = () => {
  const frame = useCurrentFrame();
  const rolagem = mix(0, -110, prog(frame, 128, 150, easeInOut));
  return (
    <Fundo>
      <VozDaCena cena="CapeV" />
      <Posicionar w={1476} h={1000} cx={1215} cy={520} escala={0.72}>
        <Notebook>
          <AppDesktop ativo={0} trilha={[S.pacientesTitulo, PACIENTE, S.analiseResultadoTitulo, S.capeVTitulo]} pilula={<Pilula texto={S.situacaoCapeV} />}>
            <div style={{ position: "absolute", inset: "0 0 76px 0", overflow: "hidden" }}>
              <div style={{ width: 880, margin: "0 auto", paddingTop: 24, translate: `0px ${rolagem}px` }}>
                <div style={{ ...tipo.bodyMedium, color: cor.secundario }}>{S.capeVExplicacao}</div>
                <div style={{ marginTop: 16 }}>
                  <Player frame={frame} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
                  {S.capeVParametros.map((p, i) => (
                    <Linha key={p} nome={p} frame={frame} marca={MARCAS[i]} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 76, borderTop: `1px solid ${cor.lavanda}`, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 135px", background: cor.creme }}>
              <Botao rotulo={S.capeVRegistrar} primaria largura={186} />
            </div>
          </AppDesktop>
        </Notebook>
        <div
          style={{
            position: "absolute",
            left: 18 + 222 + 40,
            top: 18 + 34 + 900 - 66,
            padding: "8px 16px",
            borderRadius: 999,
            background: cor.chumbo,
            color: cor.branco,
            fontSize: 18,
            fontWeight: 700,
            opacity: prog(frame, 62, 72),
          }}
        >
          Marcação ilustrativa
        </div>
      </Posicionar>
      <Legenda
        de={8}
        titulo={<>O ouvido clínico continua no centro.</>}
        apoio="CAPE-V: seis parâmetros numa régua de 100 mm, marcados ouvindo a amostra, com a consistência de cada desvio."
        style={{ left: 110, width: 560, top: 330 }}
        tamanho={56}
      />
    </Fundo>
  );
};
