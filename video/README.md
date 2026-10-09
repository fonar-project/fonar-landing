# FONAR — vídeo para a banca (Remotion)

Vídeo de cerca de 90 s, em 16:9 (1920×1080, 30 fps), que apresenta o FONAR à
banca do TCC. É um projeto separado do site: tem `package.json`, `tsconfig` e
lint próprios, e o build da landing ignora esta pasta.

```bash
cd video
npm i
npm run dev                                         # Remotion Studio
npx remotion render FonarBanca out/fonar-banca-16x9.mp4
```

Cada cena também é uma composição própria (pasta **Cenas** no Studio), e dá
para pré-visualizar e renderizar uma cena sozinha.

## Fonte da verdade: o app

As telas são recriadas em React a partir do código do `fonar-app`:

- **Textos:** `src/dados/textos.ts` é uma cópia literal de
  `lib/l10n/app_strings.dart`, com o mesmo nome de constante. Se o app mudar
  um texto, copie de novo. Não reescreva.
- **Tokens:** `src/tema.ts` traz cores, raios, espaçamentos, tipografia e
  breakpoints de `lib/design_system/tokens`.
- **Ícones:** `src/ui/icones.gerado.ts` foi gerado de `assets/icons/*.svg`.
- **Fonte:** a Urbanist em `public/fonts` (licença OFL) é a mesma do app.
- **Dados:** são os de exemplo do app (`pacientes_de_exemplo.dart` e
  `repositorio_analises_placeholder.dart`). Nenhum valor foi inventado, e o
  vídeo mostra a faixa «Dados de exemplo», como o próprio app.

## Áudio

| Arquivo | O que é |
|---|---|
| `public/audio/voz.wav` | **Voz SINTÉTICA provisória**: cerca de 3 s de sala, /a/ sustentado e um trecho de "fala" sintética. |
| `public/audio/trilha.mp3` | Trilha instrumental gerada por `scripts/gerar_audio.py`. |
| `public/audio/clique.wav`, `enviado.wav` | Efeitos discretos de interface. |

### Trocar pela gravação real

1. Grave, com o consentimento de quem fala, um WAV com cerca de 3 s de
   silêncio da sala, depois um /a/ sustentado de 3 a 5 s, uma pausa e uma
   frase. O ideal é PCM 16 bits, 44,1 kHz, mono.
2. Salve como `public/audio/voz.wav`, substituindo o arquivo atual.
3. Rode `python3 scripts/analisar_voz.py` (só depende de numpy). O script acha
   a vogal e a fala pela energia, mede o ruído da sala como o app faz (mediana
   de leituras de 100 ms) e gera o espectrograma, o cepstro e os ciclos que o
   vídeo desenha.
4. Tire "voz sintética provisória" do rodapé, em `src/FonarBanca.tsx`.

A linha do tempo da voz (`src/linhaDoTempo.ts`, `DEIXAS_DE_VOZ`) usa os
trechos achados pela análise, e o ducking da trilha segue a mesma lista.

## Regras clínicas que o vídeo segue

- CAPE-V, nunca GRBAS.
- Nenhuma medida classificada: «Sem faixa de referência» aparece em todas.
- As medidas são calculadas no servidor (Praat/parselmouth). As cenas de
  ciência são visualização didática da gravação e dizem isso na tela.
- A gravação só abre depois do consentimento.
- O vídeo não diz "melhorou" nem "piorou", e não faz promessa diagnóstica.
- As marcas da CAPE-V são ilustrativas e não mostram número. A conclusão do
  laudo aparece desfocada: as duas são do profissional.
- Verde, âmbar e vermelho aparecem só no medidor de nível.

## Pendências

- Gravação real de voz (ver acima).
- Corte de 30 s em 9:16, depois da aprovação do 16:9.
