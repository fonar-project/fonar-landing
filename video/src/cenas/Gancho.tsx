import React from "react";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { createSmoothSvgPath, useWindowedAudioData, visualizeAudioWaveform } from "@remotion/media-utils";
import { Fundo, Legenda, VozDaCena } from "../ui/cena";
import { cor } from "../tema";
import { DEIXAS_DE_VOZ } from "../linhaDoTempo";
import { prog } from "../movimento";

// 1 · Gancho: silêncio, o /a/ começa e a onda nasce no centro, desenhada pelo som.
export const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const [inicio, deS] = DEIXAS_DE_VOZ.Gancho[0];
  const tempoNoArquivo = deS + (frame - inicio) / fps;

  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: staticFile("audio/voz.wav"),
    frame: Math.max(0, Math.round(tempoNoArquivo * fps)),
    fps,
    windowInSeconds: 10,
  });

  const abertura = prog(frame, inicio, inicio + 30); // a onda se abre do centro
  const ALTURA = 360;
  let caminho = "";
  if (audioData && frame >= inicio) {
    const onda = visualizeAudioWaveform({
      fps,
      frame: Math.round(tempoNoArquivo * fps),
      audioData,
      numberOfSamples: 256,
      windowInSeconds: 0.03,
      dataOffsetInSeconds,
    });
    caminho = createSmoothSvgPath({
      points: onda.map((y, i) => {
        const x = i / (onda.length - 1);
        const janela = Math.exp(-(((x - 0.5) / (0.08 + 0.42 * abertura)) ** 2));
        return { x: x * width, y: ALTURA / 2 + y * ALTURA * 1.4 * janela };
      }),
    });
  }

  return (
    <Fundo>
      <VozDaCena cena="Gancho" />
      <svg width={width} height={ALTURA} style={{ position: "absolute", top: height / 2 - ALTURA / 2 - 60 }}>
        <line x1={0} x2={width} y1={ALTURA / 2} y2={ALTURA / 2} stroke={cor.lavanda} strokeWidth={2} opacity={frame < inicio ? prog(frame, 0, 15) : 1 - abertura} />
        {caminho ? <path d={caminho} fill="none" stroke={cor.roxo} strokeWidth={4} strokeLinecap="round" /> : null}
      </svg>
      <Legenda
        de={80}
        titulo="A voz do paciente, medida com rigor."
        style={{ left: 0, right: 0, top: 790, textAlign: "center" }}
        tamanho={72}
      />
    </Fundo>
  );
};
