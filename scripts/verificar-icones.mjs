// Garante que public/icons, o arquivo gerado e o README do índice contam a
// mesma história. Roda no CI antes do build; sai com código 1 na primeira
// divergência encontrada (reportando todas de uma vez).
//
// O que é verificado:
//   1. todo nome tipado tem arquivo .svg e todo .svg tem nome tipado;
//   2. o conteúdo gerado corresponde aos .svg de hoje (nada de arquivo
//      gerado velho no commit);
//   3. cada .svg respeita o contrato: 24x24, currentColor, sem tamanho fixo,
//      sem metadado C2PA, sem script nem recurso externo;
//   4. o índice em public/icons/README.md cita todos os arquivos, e só eles.

import { existsSync, readFileSync } from "node:fs";

import {
  ARQUIVO_GERADO,
  DIR_ICONES,
  README_ICONES,
  gerarFonte,
  lerSvg,
  listarNomes,
  relativo,
  validarIcone,
} from "./lib-icones.mjs";

/**
 * Fim de linha normalizado para comparação. O arquivo gerado é escrito em LF,
 * mas um clone feito antes do .gitattributes — ou qualquer checkout com
 * core.autocrlf=true — deixa CRLF no disco. Comparar cru faria o verificador
 * reprovar no Windows e passar no CI, com o conteúdo idêntico nos dois.
 */
const normalizarEol = (texto) => texto.replace(/\r\n/g, "\n");

const erros = [];
const reprovar = (mensagem) => erros.push(mensagem);

const nomesEmArquivo = listarNomes();

if (nomesEmArquivo.length === 0) {
  reprovar(`${relativo(DIR_ICONES)} não tem nenhum .svg.`);
}

// 3. Contrato de cada arquivo.
for (const nome of nomesEmArquivo) {
  for (const problema of validarIcone(nome, lerSvg(nome))) reprovar(problema);
}

// 1. Nomes tipados x arquivos.
if (!existsSync(ARQUIVO_GERADO)) {
  reprovar(
    `${relativo(ARQUIVO_GERADO)} não existe. Rode: npm run icones:gerar`,
  );
} else {
  const fonteAtual = normalizarEol(readFileSync(ARQUIVO_GERADO, "utf8"));
  const nomesTipados = [
    ...fonteAtual.matchAll(/^ {2}"([^"]+)":/gm),
  ].map(([, nome]) => nome);

  const arquivos = new Set(nomesEmArquivo);
  const tipados = new Set(nomesTipados);

  for (const nome of nomesTipados) {
    if (!arquivos.has(nome)) {
      reprovar(
        `nome tipado "${nome}" não tem arquivo em ${relativo(DIR_ICONES)}.`,
      );
    }
  }
  for (const nome of nomesEmArquivo) {
    if (!tipados.has(nome)) {
      reprovar(
        `${nome}.svg existe mas não é um nome tipado. Rode: npm run icones:gerar`,
      );
    }
  }

  // 2. Conteúdo gerado x arquivos de hoje.
  if (
    erros.length === 0 &&
    fonteAtual !== normalizarEol(gerarFonte(nomesEmArquivo))
  ) {
    reprovar(
      `${relativo(ARQUIVO_GERADO)} está desatualizado em relação aos .svg. ` +
        `Rode: npm run icones:gerar`,
    );
  }
}

// 4. Índice do README.
if (!existsSync(README_ICONES)) {
  reprovar(`${relativo(README_ICONES)} não existe — o índice é obrigatório.`);
} else {
  const readme = readFileSync(README_ICONES, "utf8");
  const citados = new Set(
    [...readme.matchAll(/`([a-z0-9-]+)\.svg`/g)].map(([, nome]) => nome),
  );
  for (const nome of nomesEmArquivo) {
    if (!citados.has(nome)) {
      reprovar(`${nome}.svg não está no índice de ${relativo(README_ICONES)}.`);
    }
  }
  for (const nome of citados) {
    if (!nomesEmArquivo.includes(nome)) {
      reprovar(
        `${relativo(README_ICONES)} cita ${nome}.svg, que não existe mais.`,
      );
    }
  }
}

if (erros.length > 0) {
  console.error(`Ícones reprovados (${erros.length}):\n`);
  for (const erro of erros) console.error(`  · ${erro}`);
  console.error("");
  process.exit(1);
}

console.log(
  `Ícones conferidos: ${nomesEmArquivo.length} arquivos, nomes tipados e índice em dia.`,
);
