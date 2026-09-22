# FONAR — Landing Page

Landing page comercial e informativa do **FONAR**, plataforma de avaliação
vocal clínica para fonoaudiólogos. Projeto de TCC de Engenharia de Software —
PUC-Campinas.

Produção: **https://appfonar.web.app**

> [!WARNING]
> **Só a fundação técnica existe.** O que está no repositório hoje é o esqueleto
> Next.js + Tailwind + deploy configurado. O conteúdo e a identidade visual ainda
> não foram feitos — dependem do Figma. A `src/app/page.tsx` ainda é a página
> padrão do `create-next-app`.
>
> Não invente textos definitivos, depoimentos, números ou logos. Onde faltar
> conteúdo real, deixe um `TODO` visível.

---

## Stack

| Item | Versão |
|---|---|
| Next.js (App Router) | 16.3.4 |
| React | 19.2.8 |
| TypeScript | ^5 |
| Tailwind CSS | ^4 (via `@tailwindcss/postcss`) |
| Hospedagem | Firebase Hosting (export estático) |

---

## Pré-requisitos

| Ferramenta | Mínimo | Verificado nesta máquina |
|---|---|---|
| Node.js | `>=20.9.0` (exigido pelo `next@16.3.4`) | 24.15.0 |
| npm | acompanha o Node | 11.12.1 |
| Git | — | 2.53.0 |
| firebase-tools | — | 15.29.0 |

O `firebase-tools` **só é necessário para deploy manual de emergência**. Para
rodar o projeto localmente você não precisa dele, nem de conta no Firebase.

```
npm install -g firebase-tools
firebase login
```

---

## Setup

Clonar, instalar e subir em desenvolvimento. Os comandos são idênticos nos dois
shells — não há passo de `.env`, o projeto sobe sem nenhuma variável de ambiente.

**PowerShell**

```powershell
git clone git@github.com:fonar-project/fonar-landing.git
cd fonar-landing
npm install
npm run dev
```

**bash**

```bash
git clone git@github.com:fonar-project/fonar-landing.git
cd fonar-landing
npm install
npm run dev
```

Abre em **http://localhost:3000**.

Scripts disponíveis (`package.json`):

| Script | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento (Turbopack), porta 3000 |
| `npm run build` | build de produção **e** export estático para `out/` |
| `npm run lint` | ESLint |
| `npm start` | **não use** — pressupõe servidor Node, que não existe neste deploy |

---

## A restrição do export estático

`next.config.ts` fixa `output: "export"`. O `npm run build` não gera um servidor:
gera uma pasta `out/` com HTML, CSS e JS puros, e é isso que o Firebase publica.
Não existe processo Node rodando em produção.

Consequência direta — **nada disso funciona neste projeto**:

- API routes (`src/app/api/.../route.ts`)
- Server Actions (`"use server"`)
- SSR e ISR (`fetch` com `cache`/`revalidate`, `cookies()`, `headers()`)
- `next/image` com otimização — por isso `images: { unoptimized: true }`

### O que fazer quando precisar de algo dinâmico

Resolva **no cliente**, dentro de um componente `"use client"`:

- **Formulário de captação de leads:** escreve direto no Firestore pelo SDK web
  do Firebase, a partir do browser. Sem backend intermediário.
- **Qualquer outra chamada:** `fetch` para um serviço externo, feito no browser.

Server Components continuam sendo o padrão para renderizar conteúdo — eles rodam
em *build time*, não em request time. Use `"use client"` só onde houver
interatividade real.

---

## Deploy

### Automático (o caminho normal)

Configurado em `.github/workflows/`:

- **`firebase-hosting-merge.yml`** — todo push na `main` builda e publica no canal
  `live`, ou seja, em https://appfonar.web.app.
- **`firebase-hosting-pull-request.yml`** — todo PR aberto a partir de uma branch
  **deste** repositório gera um canal de preview com URL própria, comentada no PR.
  PRs vindos de forks são ignorados de propósito (o `if` compara
  `head.repo.full_name` com o repositório).

Ambos autenticam com o secret `FIREBASE_SERVICE_ACCOUNT_FONAR_763DB` e passam
`target: fonar` explicitamente.

Na prática: **abra PR, veja o preview, faça merge — o deploy sai sozinho.** Você
não precisa rodar nada localmente.

> Os workflows não têm `actions/setup-node`; usam o Node pré-instalado no runner
> `ubuntu-latest`. Funciona hoje porque esse Node satisfaz o `>=20.9.0` do Next.
> Se o build quebrar no CI mas passar local, verifique a versão de Node do runner
> antes de procurar em outro lugar.

### Manual (só emergência)

Se o Actions estiver fora do ar:

```bash
npm run build
firebase deploy --only hosting:fonar
```

O `build` **precisa** rodar antes — o `firebase deploy` só empacota a pasta `out/`
que já existe, ele não builda nada. Publicar sem buildar republica a versão
anterior.

---

## Configuração de target do Firebase

O projeto Firebase `fonar-763db` tem **dois sites de hosting**:

| Site | URL | Papel |
|---|---|---|
| `appfonar` | https://appfonar.web.app | **produção** |
| `fonar-763db` | https://fonar-763db.web.app | site default criado junto com o projeto, não usado |

O `.firebaserc` mapeia o target `fonar` → site `appfonar`, e o `firebase.json`
fixa `"target": "fonar"`. Os dois arquivos estão commitados, então um clone
novo já vem apontando para o lugar certo.

Confira o mapeamento a qualquer momento:

```bash
firebase target --project fonar-763db
# [ hosting ]
# fonar (appfonar)
```

**Sempre nomeie o target no deploy** (`--only hosting:fonar`). Como o
`firebase.json` fixa o target, hoje um `firebase deploy --only hosting` sem nome
também resolve certo — mas essa proteção some se alguém remover a chave
`"target"` do `firebase.json` ou bagunçar o mapeamento com `firebase
target:apply`. Sem o target, o deploy cai no site default `fonar-763db`, e o
sintoma é confuso: o comando termina com sucesso e a produção simplesmente não
muda.

---

## Estrutura de pastas

```
.github/workflows/     CI — deploy na main e preview em PR
public/                assets servidos na raiz do site (/next.svg, ...)
src/
  app/                 App Router
    layout.tsx         layout raiz (fontes, <html>, metadata)
    page.tsx           home — ainda o template do create-next-app
    globals.css        entrada do Tailwind
    favicon.ico
  components/          NÃO EXISTE AINDA — criar aqui os componentes
out/                   saída do build; é o que o Firebase publica (git-ignored)
.next/                 cache de build do Next (git-ignored)
.firebase/             cache local do CLI do Firebase (git-ignored)
next.config.ts         output:'export', images.unoptimized, trailingSlash
firebase.json          hosting: public=out, target=fonar
.firebaserc            projeto default + mapeamento target -> site
CLAUDE.md              convenções do projeto para agentes de IA
AGENTS.md              gerado e re-adicionado pelo `next dev`; não apague à mão
```

Convenções de código estão no **`CLAUDE.md`** — leia antes de abrir um PR.
Resumo: componentes em `src/components`, Server Components por padrão, só
utilitários Tailwind (sem CSS solto), textos em pt-BR, acessibilidade AA,
responsivo de 360px a 1920px.

---

## Branch e commit

**Branch:** `nome/USxx-featureImplementada`

```
rafael/US01-secaoDownload
matheus/US07-formularioContato
```

**Commit:** Conventional Commits, em português.

```
feat: adiciona secao de download na home
fix: corrige contraste do botao primario
chore: atualiza configuracao do eslint
```

---

## Armadilhas conhecidas

**1. API route não quebra o build — ela desaparece em silêncio.**
Este é o pior dos dois casos, porque não dá erro nenhum. Criar
`src/app/api/algo/route.ts` compila normalmente, o build sai com código 0, e a
rota aparece no relatório marcada como `ƒ (Dynamic)`:

```
Route (app)
┌ ○ /
├ ○ /_not-found
└ ƒ /api/probe        <- some no export
```

Mas ela **não é escrita em `out/`**. Em produção vira 404, e você só descobre em
runtime. Não crie API routes. Se aparecer um `ƒ` no relatório de build, alguma
coisa está errada — tudo aqui tem que ser `○ (Static)`.

**2. Server Action quebra o build na hora — e isso é bom.**
Ao contrário do caso acima, `"use server"` falha alto e claro, com exit 1:

```
> Server Actions are not supported with static export.
```

Se você viu esse erro, remova a action e mova a lógica para o cliente.

**3. Não commite `.firebase/`.**
É cache local do CLI (`hosting.*.cache`, hashes do último upload). Já está no
`.gitignore`. Se aparecer no seu `git status`, alguém commitou antes de o ignore
existir — remova com `git rm -r --cached .firebase/`.

**4. A `main` é protegida por ruleset — push direto é bloqueado.**
Trabalhe sempre em branch e abra PR. Um `git push origin main` vai ser recusado
pelo servidor, mesmo com permissão de escrita no repositório.

**5. `npm start` não serve para nada aqui.**
Ele levanta o servidor de produção do Next, que não existe neste modelo de deploy.
Para conferir o build estático localmente, sirva a pasta `out/`:

```bash
npm run build
npx serve out
```
