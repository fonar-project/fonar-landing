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
- API routes (`app/api/...`)
- Server Actions
- SSR ou ISR
- `next/image` com otimização (usar `images: { unoptimized: true }`)

Qualquer necessidade dinâmica se resolve no cliente. O formulário de
captação escreve direto no Firestore pelo SDK web do Firebase.

## Estado atual
Apenas a fundação técnica. Conteúdo e identidade visual ainda não existem
— dependem do Figma. Não invente textos definitivos, depoimentos, números
ou logos. Onde faltar conteúdo real, deixe TODO visível.

## Convenções
- Componentes em `src/components`, páginas em `src/app`
- Server Components por padrão; `"use client"` só quando houver interatividade
- Apenas classes utilitárias do Tailwind, sem CSS solto
- Textos em português do Brasil
- Nenhuma dependência nova sem justificativa explícita
- Acessibilidade: contraste AA, foco visível, navegação por teclado
- Responsivo de 360px a 1920px

## Git
Branch: `nome/USxx-featureImplementada` — ex.: `rafael/US01-secaoDownload`
Commit: Conventional Commits em português