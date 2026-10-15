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
  "ajuda": "<circle cx=\"12\" cy=\"12\" r=\"9\" stroke=\"currentColor\" stroke-width=\"1.8\"></circle><path d=\"M9.6 9.6a2.45 2.45 0 1 1 3.55 2.2c-.72.36-1.15.93-1.15 1.75v.35\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><circle cx=\"12\" cy=\"16.9\" r=\"1.2\" fill=\"currentColor\"></circle>",
  "alerta": "<path d=\"M12 4l9 16H3z\" fill=\"currentColor\"></path>",
  "avancar": "<path d=\"M9 5l7 7-7 7\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "confirmacao": "<path d=\"M5 12.5l4.5 4.5L19 7\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "documento": "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M14 2v6h6M9 13h6M9 17h4\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "estado-online": "<circle cx=\"12\" cy=\"12\" r=\"5\" fill=\"currentColor\"></circle>",
  "estado-sem-conexao": "<circle cx=\"12\" cy=\"12\" r=\"5\" stroke=\"currentColor\" stroke-width=\"2.5\"></circle>",
  "girar-aparelho": "<path d=\"M4 12a8 8 0 1 0 2.34-5.66\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\"></path><path d=\"M4 3.5V8h4.5\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "gravar": "<circle cx=\"12\" cy=\"12\" r=\"7\" fill=\"currentColor\"></circle>",
  "informacao": "<circle cx=\"12\" cy=\"12\" r=\"9\" stroke=\"currentColor\" stroke-width=\"1.8\"></circle><path d=\"M12 11v6\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\"></path><circle cx=\"12\" cy=\"7.4\" r=\"1.3\" fill=\"currentColor\"></circle>",
  "mostrar-senha": "<path d=\"M2.5 12C4.6 7.9 8 5.5 12 5.5s7.4 2.4 9.5 6.5c-2.1 4.1-5.5 6.5-9.5 6.5S4.6 16.1 2.5 12z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><circle cx=\"12\" cy=\"12\" r=\"3\" stroke=\"currentColor\" stroke-width=\"2\"></circle>",
  "negacao": "<path d=\"M6 6l12 12M18 6L6 18\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "ocultar-senha": "<path d=\"M2.5 12C4.6 7.9 8 5.5 12 5.5s7.4 2.4 9.5 6.5c-2.1 4.1-5.5 6.5-9.5 6.5S4.6 16.1 2.5 12z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><circle cx=\"12\" cy=\"12\" r=\"3\" stroke=\"currentColor\" stroke-width=\"2\"></circle><path d=\"M4 4l16 16\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"></path>",
  "passo-pendente": "<circle cx=\"12\" cy=\"12\" r=\"7\" stroke=\"currentColor\" stroke-width=\"2\"></circle>",
  "pausar": "<rect x=\"7\" y=\"5\" width=\"3.5\" height=\"14\" rx=\"1\" fill=\"currentColor\"></rect><rect x=\"13.5\" y=\"5\" width=\"3.5\" height=\"14\" rx=\"1\" fill=\"currentColor\"></rect>",
  "reproduzir": "<path d=\"M8 5l12 7-12 7z\" fill=\"currentColor\"></path>",
  "sem-referencia": "<path d=\"M12 3l7 9-7 9-7-9z\" fill=\"currentColor\"></path>",
  "tendencia-desce": "<path d=\"M6 6l12 12M18 9v9H9\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "tendencia-estavel": "<path d=\"M4 12h15M14 7l5 5-5 5\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "tendencia-sobe": "<path d=\"M6 18L18 6M9 6h9v9\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "virar-para-paciente": "<path d=\"M20 12a8 8 0 1 1-2.34-5.66\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\"></path><path d=\"M20 3.5V8h-4.5\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
  "voltar": "<path d=\"M15 5l-7 7 7 7\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>",
} as const;

/** Nome de ícone existente em public/icons. */
export type NomeIcone = keyof typeof MIOLO_ICONES;

export const NOMES_ICONES = Object.keys(MIOLO_ICONES) as NomeIcone[];
