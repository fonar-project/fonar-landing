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
  android: `${RELEASES}/latest/download/FONAR-Android.apk`,
  web: "https://fonar-project.github.io/fonar-app/",
  todasAsVersoes: RELEASES,
} as const;
