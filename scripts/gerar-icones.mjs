// Regenera src/components/icones/conteudo.gerado.ts a partir de public/icons.
// Rode depois de adicionar, remover ou reeditar qualquer .svg — e commite o
// arquivo gerado junto, porque o build não o regenera.

import { writeFileSync } from "node:fs";

import {
  ARQUIVO_GERADO,
  gerarFonte,
  lerSvg,
  listarNomes,
  relativo,
  validarIcone,
} from "./lib-icones.mjs";

const nomes = listarNomes();
const problemas = nomes.flatMap((nome) => validarIcone(nome, lerSvg(nome)));

if (problemas.length > 0) {
  console.error("Não gerei nada — conserte os ícones primeiro:\n");
  for (const problema of problemas) console.error(`  · ${problema}`);
  process.exit(1);
}

writeFileSync(ARQUIVO_GERADO, gerarFonte(nomes), "utf8");
console.log(`${relativo(ARQUIVO_GERADO)} atualizado com ${nomes.length} ícones.`);
