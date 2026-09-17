// ARQUIVO GERADO — não edite à mão.
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
  "adicionar": "<path d=\"M12 5v14M5 12h14\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "alerta": "<path d=\"M12 4l9 16H3z\" fill=\"currentColor\"></path>",
  "avancar": "<path d=\"M9 5l7 7-7 7\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "confirmacao": "<path d=\"M5 12.5l4.5 4.5L19 7\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "estado-online": "<circle cx=\"12\" cy=\"12\" r=\"5\" fill=\"currentColor\"></circle>",
  "estado-sem-conexao": "<circle cx=\"12\" cy=\"12\" r=\"5\" stroke=\"currentColor\" stroke-width=\"2.5\"></circle>",
  "girar-aparelho": "<path d=\"M4 12a8 8 0 1 0 2.34-5.66\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\"></path><path d=\"M4 3.5V8h4.5\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "gravar": "<circle cx=\"12\" cy=\"12\" r=\"7\" fill=\"currentColor\"></circle>",
  "informacao": "<circle cx=\"12\" cy=\"12\" r=\"9\" stroke=\"currentColor\" stroke-width=\"1.8\"></circle><path d=\"M12 11v6\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\"></path><circle cx=\"12\" cy=\"7.4\" r=\"1.3\" fill=\"currentColor\"></circle>",
  "negacao": "<path d=\"M6 6l12 12M18 6L6 18\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "passo-pendente": "<circle cx=\"12\" cy=\"12\" r=\"7\" stroke=\"currentColor\" stroke-width=\"2\"></circle>",
  "pausar": "<rect x=\"7\" y=\"5\" width=\"3.5\" height=\"14\" rx=\"1\" fill=\"currentColor\"></rect><rect x=\"13.5\" y=\"5\" width=\"3.5\" height=\"14\" rx=\"1\" fill=\"currentColor\"></rect>",
  "reproduzir": "<path d=\"M8 5l12 7-12 7z\" fill=\"currentColor\"></path>",
  "sem-referencia": "<path d=\"M12 3l7 9-7 9-7-9z\" fill=\"currentColor\"></path>",
  "tendencia-estavel": "<path d=\"M4 12h15M14 7l5 5-5 5\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "tendencia-melhora": "<path d=\"M6 18L18 6M9 6h9v9\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "tendencia-piora": "<path d=\"M6 6l12 12M18 9v9H9\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "virar-para-paciente": "<path d=\"M20 12a8 8 0 1 1-2.34-5.66\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\"></path><path d=\"M20 3.5V8h-4.5\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "voltar": "<path d=\"M15 5l-7 7 7 7\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
} as const;

/** Nome de ícone existente em public/icons. */
export type NomeIcone = keyof typeof MIOLO_ICONES;

export const NOMES_ICONES = Object.keys(MIOLO_ICONES) as NomeIcone[];
