// Onde se baixa o FONAR. Lugar único: a seção de download, o hero e o
// rodapé leem daqui.
//
// Os arquivos vêm do "latest" do GitHub Releases do repositório do app —
// publicados pelo `release.yml` de lá a cada versão —, então o link não muda
// quando sai versão nova. A versão para iPhone e iPad é a web, no GitHub
// Pages do mesmo repositório.

const RELEASES = "https://github.com/fonar-project/fonar-app/releases";

export const DOWNLOADS = {
  windows: `${RELEASES}/latest/download/FONAR-Windows.zip`,
  macos: `${RELEASES}/latest/download/FONAR-macOS.zip`,
  // O Android vai para a PÁGINA da versão, e não direto para o APK. Baixado
  // por um link, o APK caía numa janela à parte do navegador do celular,
  // onde o aviso de arquivo perigoso — que todo APK recebe — não aparece, e
  // o download ficava parado em 100%. Tocado na página do GitHub, baixa
  // normal. E a página tem os dois APK, o de 64 e o de 32 bits.
  android: `${RELEASES}/latest`,
  web: "https://fonar-project.github.io/fonar-app/",
  todasAsVersoes: RELEASES,
} as const;
