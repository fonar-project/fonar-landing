import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { CENAS, DURACAO_TOTAL, TRANSICAO, inicioDe, vozGlobal } from "./linhaDoTempo";
import { cor, fonte } from "./tema";
import { Gancho } from "./cenas/Gancho";
import { Problema } from "./cenas/Problema";
import { Consentimento } from "./cenas/Consentimento";
import { Sala } from "./cenas/Sala";
import { Gravacao } from "./cenas/Gravacao";
import { Fila } from "./cenas/Fila";
import { Resultado } from "./cenas/Resultado";
import { Ciencia } from "./cenas/Ciencia";
import { CapeV } from "./cenas/CapeV";
import { Evolucao } from "./cenas/Evolucao";
import { Laudo } from "./cenas/Laudo";
import { Fechamento } from "./cenas/Fechamento";

export const COMPONENTES = {
  Gancho,
  Problema,
  Consentimento,
  Sala,
  Gravacao,
  Fila,
  Resultado,
  Ciencia,
  CapeV,
  Evolucao,
  Laudo,
  Fechamento,
} as const;

// Ducking: a trilha baixa sempre que a voz do paciente toca. A voz é o centro.
const VOZ = vozGlobal();
const TRILHA_BASE = 0.32;
const TRILHA_SOB_VOZ = 0.06;
const RAMPA = 10;
const volumeDaTrilha = (f: number) => {
  let ducking = 0;
  for (const [a, b] of VOZ) {
    const d = interpolate(f, [a - RAMPA, a, b, b + RAMPA], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    ducking = Math.max(ducking, d);
  }
  const entrada = interpolate(f, [60, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const saida = interpolate(f, [DURACAO_TOTAL - 60, DURACAO_TOTAL], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (TRILHA_BASE + (TRILHA_SOB_VOZ - TRILHA_BASE) * ducking) * entrada * saida;
};

/** Linha discreta de honestidade, em toda cena com tela do app. */
const Rodape: React.FC = () => {
  const frame = useCurrentFrame();
  const visivel = frame >= inicioDe("Problema") && frame < inicioDe("Fechamento");
  const escuro = frame >= inicioDe("Ciencia") + 8 && frame < inicioDe("CapeV") + 8;
  if (!visivel) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        bottom: 34,
        fontFamily: fonte,
        fontSize: 18,
        fontWeight: 500,
        color: escuro ? cor.escuroSecundario : cor.secundario,
      }}
    >
      Telas recriadas a partir do código do FONAR · dados de exemplo do app · voz sintética provisória
    </div>
  );
};

export const FonarBanca: React.FC = () => (
  <AbsoluteFill style={{ background: cor.creme }}>
    <TransitionSeries>
      {CENAS.map((c, i) => {
        const Cena = COMPONENTES[c.id];
        return (
          <React.Fragment key={c.id}>
            {i > 0 ? <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSICAO })} /> : null}
            <TransitionSeries.Sequence name={c.id} durationInFrames={c.dur}>
              <Cena />
            </TransitionSeries.Sequence>
          </React.Fragment>
        );
      })}
    </TransitionSeries>
    <Rodape />
    <Audio src={staticFile("audio/trilha.mp3")} volume={volumeDaTrilha} />
  </AbsoluteFill>
);
