import { Easing, interpolate } from "remotion";

// app_movimento.dart: easeOutCubic, 150/220 ms, deslize de 8 px.
// No vídeo o mesmo vocabulário, só um pouco mais lento fora das telas.
export const easeOutCubic = Easing.bezier(0.33, 1, 0.68, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Progresso 0→1 entre dois quadros, com easeOutCubic. */
export const prog = (frame: number, de: number, ate: number, easing = easeOutCubic) =>
  interpolate(frame, [de, ate], [0, 1], { ...clamp, easing });

/** Entrada da interface: opacidade + deslize curto para cima (8 px, ~220 ms). */
export const entra = (frame: number, inicio: number, duracao = 7, deslize = 8) => {
  const p = prog(frame, inicio, inicio + duracao);
  return { opacity: p, translate: `0px ${(1 - p) * deslize}px` };
};

/** Saída imediata (no app, o conteúdo antigo sai na hora). */
export const ate = (frame: number, fim: number) => (frame < fim ? 1 : 0);

/** Visível só dentro do intervalo [de, ate). */
export const entre = (frame: number, de: number, ateQ: number) => frame >= de && frame < ateQ;

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
