# FONAR — Landing Page

## Contexto
Landing page comercial e informativa do FONAR, plataforma de avaliação vocal
clínica para fonoaudiólogos. TCC de Engenharia de Software, PUC-Campinas.
Público: fonoaudiólogos e clínicas de voz, não é público técnico.

Produção: https://appfonar.web.app

## Stack
Next.js (App Router), TypeScript, Tailwind CSS.
Deploy: Firebase Hosting via export estático (`output: 'export'`).

## Restrição de arquitetura decorrente do deploy
O site é EXPORTADO COMO ESTÁTICO. Portanto NÃO existem:
- API routes (`src/app/api/.../route.ts`)
- Server Actions (`"use server"`)
- SSR e ISR (`fetch` com `cache`/`revalidate`, `cookies()`, `headers()`)
- `next/image` com otimização (usar `images: { unoptimized: true }`)

ATENÇÃO — os dois casos falham de formas OPOSTAS, verificado no Next 16.3.4:

- **Server Action quebra o build na hora**, com erro explícito. Esse é o
  caso bom.
- **API route NÃO quebra o build.** Ela compila, o build sai com código 0, a
  rota aparece como `ƒ (Dynamic)` no relatório e NÃO é escrita em `out/`.
  Vira 404 silencioso em produção.

Heurística: se aparecer QUALQUER `ƒ` no relatório de build, está errado. Tudo
neste projeto deve ser `○ (Static)`.

Como `images.unoptimized` está ligado, nenhuma imagem passa por conversão nem
por redimensionamento responsivo — cada arquivo é servido cru, do mesmo
tamanho, para celular e desktop. Prefira SVG a PNG sempre que possível e
mantenha os PNG enxutos.

Qualquer necessidade dinâmica se resolve no cliente, em componente
`"use client"`. O formulário de captação escreve direto no Firestore pelo SDK
web do Firebase, sem backend intermediário.

## Design system
Paleta:
- `#FFF7EB` creme — fundo principal
- `#40085E` roxo profundo — primária, botões, header
- `#413C58` cinza chumbo — textos e títulos
- `#DBD2E0` lavanda claro — bordas, cards secundários, divisórias
- `#6E6787` secundário sobre CREME (5,00:1)
- `#5A5472` secundário sobre LAVANDA (4,86:1) — o `#6E6787` sobre lavanda dá
  só 3,62:1 e reprova para texto pequeno. Use o token certo para cada fundo.

Tipografia: Urbanist. Bold para títulos e destaques, Regular para corpo.

Acessibilidade: WCAG AA, foco visível, navegação por teclado.
Nenhuma informação crítica comunicada apenas por cor.

Animação de rolagem: entradas discretas, fade com deslocamento vertical curto,
escalonado entre irmãos. Nada de parallax pesado, rotação, zoom agressivo ou
elemento que se mova durante a leitura. Nada pisca nem repete.
Respeitar `prefers-reduced-motion`: com a preferência ativa, tudo estático.
Animação não pode atrasar a leitura nem mexer no layout.

## Ícones e marca — duas pastas, regras opostas
São coisas diferentes e não podem se misturar: `icons` é design system
compartilhado com o app, `marca` é identidade visual só da landing.

### `public/icons/` — design system, espelhado com o app
SVG 24x24, `currentColor`, sem width/height fixos.

- **Esta pasta é espelhada com o repositório do aplicativo.** Alteração em um
  exige alteração no outro. Só entra aqui o que faz sentido nas duas pontas —
  logo de rede social e badge de loja NÃO fazem
- Ícone exportado do Claude Design vem com ~8KB de metadados C2PA que DEVEM
  ser removidos antes de commitar
- Nada aqui é carregado por URL. `src/components/icones/Icone.tsx` é o único
  ponto do site que renderiza SVG: ele embute o desenho no HTML, a partir de
  `conteudo.gerado.ts`, e evita uma requisição por ícone
- Mexeu num `.svg`? Rode `npm run icones:gerar` e commite o arquivo gerado

### `public/marca/` — exclusivo da landing
Marca FONAR, og-image, favicon, logos de plataforma (Windows, Android),
redes sociais e marca de instituição. Ver `public/marca/README.md`.

- Fora do espelho com o app e fora do verificador de ícones. Não precisa ser
  24x24 nem `currentColor`
- Carregado por URL (`/marca/...`), não pelo componente `Icone` — é imagem de
  marca, não ícone de interface. O ESLint libera `.svg` só neste caminho
- Logo de terceiro segue a diretriz de marca oficial de quem é dono dela.
  Marca de instituição só com autorização de uso

### Verificação
`npm run icones:verificar` roda no CI antes do build e reprova se nome
tipado, arquivo `.svg` e índice do README saírem de sincronia, ou se algum
ícone violar o contrato (tamanho fixo, cor fixa, metadado, script).

## Conteúdo — o que pode e o que não pode ser afirmado
- Não inventar depoimentos, logos de clientes, números de usuários ou qualquer
  métrica. Onde faltar conteúdo real, deixar TODO visível
- Não afirmar redução de tempo em porcentagem ou fração. Isso é exatamente o
  que o experimento do TCC vai medir, e afirmar antes de medir cria
  contradição com a monografia
- Nenhuma afirmação de eficácia clínica ou diagnóstico. O produto é ferramenta
  de apoio à decisão e nunca emite diagnóstico
- Ao citar o Praat, deixar claro que é software independente da Universidade
  de Amsterdam, sem vínculo com o FONAR
- O produto roda em Windows e Android. Nenhum mockup com macOS ou iPhone

## Convenções
- Componentes em `src/components`, páginas em `src/app`
- Server Components por padrão; `"use client"` só quando houver interatividade
- Apenas classes utilitárias do Tailwind, sem CSS solto
- Textos em português do Brasil
- Responsivo de 360px a 1920px
- Nenhuma dependência nova sem justificativa explícita
- `npm start` não serve para nada aqui. Para conferir o build estático:
  `npm run build && npx serve out`

## Deploy
Automático via GitHub Actions: merge na `main` publica em produção, cada PR
gera canal de preview. Manual só em emergência:
`npm run build && firebase deploy --only hosting:fonar`

O projeto Firebase tem dois sites. O deploy vai para o target `fonar`.
Nunca rode deploy sem nomear o target.

## Estado atual
Fundação técnica e design definido. A implementação das seções ainda não foi
feita — `src/app/page.tsx` pode ainda ser o template do create-next-app.

## Git
Branch: `nome/USxx-featureImplementada` — ex.: `rafael/US01-secaoDownload`
Commit: Conventional Commits em português
A `main` é protegida por ruleset: push direto é bloqueado pelo servidor.