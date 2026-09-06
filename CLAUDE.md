# Praatico — Landing Page

## Contexto
Landing page comercial e informativa do Praatico, plataforma de avaliação
vocal clínica para fonoaudiólogos. TCC de Engenharia de Software,
PUC-Campinas. Público: fonoaudiólogos e clínicas de voz, não é público
técnico.

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

- **Server Action quebra o build na hora**, com erro explícito
  ("Server Actions are not supported with static export"). Esse é o caso bom.
- **API route NÃO quebra o build.** Ela compila, o build sai com código 0,
  a rota aparece como `ƒ (Dynamic)` no relatório e simplesmente NÃO é
  escrita em `out/`. Vira 404 silencioso em produção.

Heurística: se aparecer QUALQUER `ƒ` no relatório de build, está errado.
Tudo neste projeto deve ser `○ (Static)`.

Qualquer necessidade dinâmica se resolve no cliente, em componente
`"use client"`. O formulário de captação escreve direto no Firestore pelo
SDK web do Firebase, sem backend intermediário.

## Estado atual
Apenas a fundação técnica existe. Conteúdo e identidade visual ainda não
foram feitos — dependem do Figma, e `src/app/page.tsx` continua sendo a
página padrão do create-next-app.

Não invente textos definitivos, depoimentos, números ou logos. Onde faltar
conteúdo real, deixe um TODO visível.

## Convenções
- Componentes em `src/components`, páginas em `src/app`
- Server Components por padrão; `"use client"` só quando houver interatividade
- Apenas classes utilitárias do Tailwind, sem CSS solto
- Textos em português do Brasil
- Nenhuma dependência nova sem justificativa explícita
- Acessibilidade: contraste AA, foco visível, navegação por teclado
- Responsivo de 360px a 1920px
- `npm start` não serve para nada aqui (pressupõe servidor Node). Para
  conferir o build estático: `npm run build && npx serve out`

## Deploy
Automático via GitHub Actions: merge na `main` publica em produção, e cada
PR gera canal de preview. Deploy manual só em emergência:
`npm run build && firebase deploy --only hosting:praatico`

## Git
Branch: `nome/USxx-featureImplementada` — ex.: `rafael/US01-secaoDownload`
Commit: Conventional Commits em português
A `main` é protegida por ruleset: push direto é bloqueado pelo servidor.