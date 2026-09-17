// Regras compartilhadas entre o gerador e o verificador de ícones.
// Fonte da verdade: os arquivos .svg em public/icons (pasta espelhada com o
// repositório do aplicativo). Tudo o mais é derivado deles.

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const RAIZ = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
export const DIR_ICONES = path.join(RAIZ, "public", "icons");
export const README_ICONES = path.join(DIR_ICONES, "README.md");
export const ARQUIVO_GERADO = path.join(
  RAIZ,
  "src",
  "components",
  "icones",
  "conteudo.gerado.ts",
);

/** Caminho relativo à raiz, sempre com barra normal, para as mensagens. */
export const relativo = (absoluto) =>
  path.relative(RAIZ, absoluto).split(path.sep).join("/");

const NOME_VALIDO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAGS_PERMITIDAS = new Set([
  "path",
  "circle",
  "ellipse",
  "rect",
  "line",
  "polyline",
  "polygon",
  "g",
]);

/** Nomes dos ícones existentes em public/icons, em ordem estável. */
export function listarNomes() {
  return readdirSync(DIR_ICONES)
    .filter((arquivo) => arquivo.endsWith(".svg"))
    .map((arquivo) => arquivo.slice(0, -".svg".length))
    .sort((a, b) => a.localeCompare(b, "en"));
}

export const lerSvg = (nome) =>
  readFileSync(path.join(DIR_ICONES, `${nome}.svg`), "utf8");

/**
 * Miolo do <svg> — o que vai para dentro do componente — com o espaço em
 * branco entre as tags colapsado, para o arquivo gerado não mudar só porque
 * o editor reindentou o SVG.
 */
export function extrairMiolo(svg) {
  const casamento = svg.match(/<svg\b[^>]*>([\s\S]*)<\/svg>/);
  if (!casamento) return null;
  return casamento[1]
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Problemas de um ícone: nomenclatura, contrato visual (24x24, currentColor)
 * e higiene do arquivo (sem metadado C2PA, sem script, sem recurso externo).
 * Retorna [] quando está tudo certo.
 */
export function validarIcone(nome, svg) {
  const problemas = [];
  const arquivo = `${nome}.svg`;

  if (!NOME_VALIDO.test(nome)) {
    problemas.push(`${arquivo}: nome fora do padrão kebab-case.`);
  }

  const abertura = svg.match(/<svg\b([^>]*)>/);
  if (!abertura) {
    problemas.push(`${arquivo}: não tem um elemento <svg> raiz.`);
    return problemas;
  }
  const atributos = abertura[1];

  if (!/viewBox\s*=\s*"0 0 24 24"/.test(atributos)) {
    problemas.push(`${arquivo}: viewBox precisa ser exatamente "0 0 24 24".`);
  }
  if (/\b(?:width|height)\s*=/.test(atributos)) {
    problemas.push(
      `${arquivo}: <svg> não pode ter width/height fixos — quem usa é que dimensiona.`,
    );
  }

  const miolo = extrairMiolo(svg);
  if (miolo === null || miolo === "") {
    problemas.push(`${arquivo}: <svg> está vazio.`);
    return problemas;
  }

  if (!miolo.includes("currentColor")) {
    problemas.push(`${arquivo}: não usa currentColor em nenhum traço ou preenchimento.`);
  }
  for (const [, atributo, valor] of miolo.matchAll(
    /\b(fill|stroke)\s*=\s*"([^"]*)"/g,
  )) {
    if (valor !== "currentColor" && valor !== "none") {
      problemas.push(
        `${arquivo}: ${atributo}="${valor}" é cor fixa — use currentColor ou none.`,
      );
    }
  }

  for (const [, tag] of miolo.matchAll(/<([a-zA-Z][\w:-]*)/g)) {
    if (!TAGS_PERMITIDAS.has(tag)) {
      problemas.push(`${arquivo}: elemento <${tag}> não é permitido no miolo do ícone.`);
    }
  }
  if (/\son[a-z]+\s*=/i.test(miolo) || /\b(?:xlink:)?href\s*=/i.test(miolo)) {
    problemas.push(`${arquivo}: contém handler de evento ou referência externa.`);
  }
  if (/<metadata\b|xmpmeta|<\?xpacket|c2pa/i.test(svg)) {
    problemas.push(
      `${arquivo}: sobrou metadado (C2PA/XMP) — remova antes de commitar.`,
    );
  }

  return problemas;
}

/** Conteúdo completo de conteudo.gerado.ts para os ícones atuais. */
export function gerarFonte(nomes) {
  const entradas = nomes
    .map((nome) => `  ${JSON.stringify(nome)}: ${JSON.stringify(extrairMiolo(lerSvg(nome)))},`)
    .join("\n");

  return `// ARQUIVO GERADO — não edite à mão.
// Origem: public/icons/*.svg
// Gerar de novo: npm run icones:gerar
// Conferir: npm run icones:verificar
//
// O miolo de cada SVG vive aqui, e não em <img src="/icons/...">, porque o
// site é export estático com images.unoptimized: inline não custa nenhuma
// requisição por ícone e deixa a cor vir do currentColor de quem usa.
// O gerador só aceita formas simples com currentColor — nada de script,
// href externo ou metadado.

export const MIOLO_ICONES = {
${entradas}
} as const;

/** Nome de ícone existente em public/icons. */
export type NomeIcone = keyof typeof MIOLO_ICONES;

export const NOMES_ICONES = Object.keys(MIOLO_ICONES) as NomeIcone[];
`;
}
