import voz from "./dados/voz.json";
import { FPS } from "./tema";

// Duração de cada cena, em quadros (30 fps). A soma menos as transições dá o
// vídeo inteiro. Mudou aqui, muda em todo lugar (inclusive o ducking da trilha).
export const CENAS = [
  { id: "Gancho", dur: 180 },
  { id: "Problema", dur: 210 },
  { id: "Consentimento", dur: 195 },
  { id: "Sala", dur: 240 },
  { id: "Gravacao", dur: 420 },
  { id: "Fila", dur: 225 },
  { id: "Resultado", dur: 240 },
  { id: "Ciencia", dur: 405 },
  { id: "CapeV", dur: 270 },
  { id: "Evolucao", dur: 210 },
  { id: "Laudo", dur: 180 },
  { id: "Fechamento", dur: 150 },
] as const;

export type IdCena = (typeof CENAS)[number]["id"];
export const TRANSICAO = 15;

export const duracaoDe = (id: IdCena) => CENAS.find((c) => c.id === id)!.dur;

export const inicioDe = (id: IdCena) => {
  let t = 0;
  for (const c of CENAS) {
    if (c.id === id) return t;
    t += c.dur - TRANSICAO;
  }
  throw new Error(id);
};

export const DURACAO_TOTAL = CENAS.reduce((s, c) => s + c.dur, 0) - TRANSICAO * (CENAS.length - 1);

// Trechos da gravação (segundos dentro de voz.wav), achados por analisar_voz.py.
export const VOGAL = { de: voz.vogal[0], ate: voz.vogal[1] };
export const FALA = voz.fala ? { de: voz.fala[0], ate: voz.fala[1] } : null;
export const quadros = (s: number) => Math.round(s * FPS);

/**
 * Onde a voz toca dentro de cada cena: [quadro local de início, segundo
 * inicial no arquivo, duração em segundos]. Usado pela cena (<Audio>) e pelo
 * ducking da trilha — uma fonte só.
 */
export const DEIXAS_DE_VOZ: Record<string, [number, number, number][]> = {
  Gancho: [[20, VOGAL.de, VOGAL.ate - VOGAL.de]],
  Gravacao: [
    [40, VOGAL.de, VOGAL.ate - VOGAL.de],
    ...(FALA ? ([[250, FALA.de, FALA.ate - FALA.de]] as [number, number, number][]) : []),
  ],
  Ciencia: [[10, VOGAL.de, VOGAL.ate - VOGAL.de]],
  CapeV: [[40, VOGAL.de, VOGAL.ate - VOGAL.de], ...(FALA ? ([[40 + quadros(VOGAL.ate - VOGAL.de) + 15, FALA.de, FALA.ate - FALA.de]] as [number, number, number][]) : [])],
};

/** Intervalos globais (em quadros) em que a voz está tocando. */
export const vozGlobal = () =>
  Object.entries(DEIXAS_DE_VOZ).flatMap(([cena, deixas]) =>
    deixas.map(([q, , dur]) => {
      const ini = inicioDe(cena as IdCena) + q;
      return [ini, ini + quadros(dur)] as const;
    }),
  );
