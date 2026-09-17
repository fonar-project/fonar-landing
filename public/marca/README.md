# Marca — assets exclusivos da landing

Logotipos, selos e imagens de identidade. **Esta pasta não é espelhada com o
repositório do aplicativo** e não passa pelo verificador de ícones.

Diferente de `public/icons/`, aqui:

- não vale a regra de 24x24 nem a de `currentColor` — logo de terceiro tem
  cor e proporção próprias, definidas por quem é dono da marca;
- o arquivo é carregado por URL (`/marca/...`), não pelo componente `Icone`.
  São poucas imagens grandes, não dezenas de ícones pequenos, então uma
  requisição por arquivo é o certo aqui. O ESLint libera `.svg` só neste
  caminho;
- SVG continua preferível a PNG: o site é export estático com
  `images.unoptimized`, então todo PNG é servido cru, do mesmo tamanho, para
  celular e desktop.

## O que entra aqui

Marca FONAR (colorida e monocromática), og-image de compartilhamento,
favicon, logos de plataforma (Windows, Android ou o badge da Play Store),
ícones de redes sociais e marca de instituição.

## Antes de commitar

- Logo de terceiro segue a diretriz de marca oficial de quem é dono dela —
  não redesenhe, não recolora, não distorça.
- Marca de instituição (PUC-Campinas) só com autorização de uso.
- Remova metadados C2PA/XMP de qualquer arquivo exportado de ferramenta de
  design.
- Nada de logo de cliente ou parceiro que não exista de verdade.

## O que já existe

- `favicon.svg` — **provisório**. Só a inicial desenhada na paleta, para o
  site não ir a produção com o ícone do create-next-app. TODO: trocar pela
  marca definitiva do FONAR quando ela existir, junto com o `icons` do
  `metadata` em `src/app/layout.tsx`.

O resto da pasta está vazio — nenhum outro asset de marca foi produzido.
