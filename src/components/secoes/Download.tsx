import { Botao } from "@/components/Botao";
import { Icone } from "@/components/icones";
import { Revelar } from "@/components/Revelar";
import { DOWNLOADS } from "@/lib/downloads";

type Plataforma = {
  titulo: string;
  /** Em que aparelho roda, sem prometer versão mínima que não foi medida. */
  onde: string;
  acao: string;
  href: string;
  arquivo: string;
  /** Abre na mesma aba (o que se baixa, e o APK) ou numa nova (a versão web). */
  mesmaAba: boolean;
  /** O que fazer na primeira abertura, passo a passo. */
  primeiraVez: string[];
};

const PLATAFORMAS: Plataforma[] = [
  {
    titulo: "Windows",
    onde: "Computador com Windows 10 ou 11",
    acao: "Baixar para Windows",
    href: DOWNLOADS.windows,
    arquivo: "FONAR-Windows.zip",
    mesmaAba: true,
    primeiraVez: [
      "Descompacte o arquivo baixado e abra o programa fonar_app, localizado na pasta FONAR.",
      "Caso seja exibida a mensagem “O Windows protegeu o computador”, clique em “Mais informações” e, em seguida, em “Executar assim mesmo”. A mensagem é exibida porque o programa ainda não possui assinatura digital de código.",
      "Quando solicitado, autorize o uso do microfone pelo FONAR.",
    ],
  },
  {
    titulo: "macOS",
    onde: "Computador Mac",
    acao: "Baixar para macOS",
    href: DOWNLOADS.macos,
    arquivo: "FONAR-macOS.zip",
    mesmaAba: true,
    primeiraVez: [
      "Descompacte o arquivo baixado e arraste o FONAR para a pasta Aplicativos.",
      "Na primeira abertura, o macOS bloqueia o aplicativo. Para liberá-lo, abra Ajustes do Sistema → Privacidade e Segurança e clique em “Abrir Mesmo Assim”.",
      "Quando solicitado, autorize o uso do microfone pelo FONAR.",
    ],
  },
  {
    titulo: "Android",
    onde: "Celular ou tablet Android",
    acao: "Baixar o APK",
    href: DOWNLOADS.android,
    arquivo: "FONAR-Android.apk, pela página do GitHub",
    mesmaAba: true,
    primeiraVez: [
      "O botão abre a página da versão no GitHub. Na seção “Assets”, toque no arquivo FONAR-Android.apk.",
      "Caso a página tenha sido aberta dentro de outro aplicativo (com um X no canto superior), toque em ⋮ e em “Abrir no Chrome”, ou no navegador utilizado, antes de tocar no arquivo.",
      "Ao final do download, o navegador informa que o arquivo pode ser perigoso. Esse aviso é exibido para todo aplicativo instalado fora da Play Store. Confirme o download.",
      "Abra o arquivo pela notificação “Download concluído” ou pelo aplicativo Arquivos, na pasta Downloads.",
      "O Android solicitará permissão para instalar aplicativos desta origem (o navegador ou o gerenciador de arquivos). Conceda a permissão e conclua a instalação.",
      "Na primeira gravação, autorize o uso do microfone pelo FONAR.",
      "Caso o Android informe que o aplicativo não é compatível com o aparelho, baixe o arquivo FONAR-Android-32bits.apk, disponível na mesma página do GitHub.",
    ],
  },
  {
    titulo: "iPhone e iPad",
    onde: "No Safari, sem instalação pela App Store",
    acao: "Abrir a versão web",
    href: DOWNLOADS.web,
    arquivo: "versão web",
    mesmaAba: false,
    primeiraVez: [
      "Abra a versão web no Safari, toque em “Compartilhar” e, em seguida, em “Adicionar à Tela de Início”.",
      "Abra o FONAR sempre pelo ícone criado na Tela de Início. Dessa forma, os dados permanecem armazenados no aparelho e o aplicativo pode ser aberto mesmo sem conexão com a internet.",
      "Antes de cada gravação, o FONAR verifica se o Safari desativou os ajustes automáticos do microfone. Caso não tenham sido desativados, a gravação é bloqueada e o motivo é informado, pois esses ajustes alteram as características do sinal que a análise acústica mede.",
    ],
  },
];

export function Download() {
  return (
    <section id="download" className="bg-lavanda px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Revelar>
          <p className="text-sm font-bold uppercase tracking-widest text-secundario-lavanda">
            Download
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold text-roxo sm:text-4xl">
            Download do FONAR.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-secundario-lavanda">
            O aplicativo oferece as mesmas funções no computador, no celular e
            no tablet. A gravação funciona sem conexão com a internet, e as
            gravações são enviadas para análise quando a conexão é
            restabelecida.
          </p>
        </Revelar>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLATAFORMAS.map((plataforma) => (
            <Revelar key={plataforma.titulo} className="h-full">
              <article className="flex h-full flex-col rounded-3xl bg-white p-7 transition-shadow duration-150 focus-within:shadow-lg focus-within:shadow-roxo/10 hover:shadow-lg hover:shadow-roxo/10 motion-reduce:transition-none">
                <h3 className="text-lg font-bold text-roxo">
                  {plataforma.titulo}
                </h3>
                <p className="mt-1 text-sm text-secundario">{plataforma.onde}</p>

                <Botao
                  href={plataforma.href}
                  mesmaAba={plataforma.mesmaAba}
                  className="mt-6 self-start"
                  aria-label={`${plataforma.acao} (${plataforma.arquivo})`}
                >
                  {plataforma.acao}
                </Botao>

                <details className="group mt-6 border-t border-lavanda pt-4">
                  <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg text-sm font-semibold text-roxo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-roxo">
                    <Icone
                      nome="avancar"
                      tamanho={16}
                      className="transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none"
                    />
                    Instruções para a primeira utilização
                  </summary>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-chumbo">
                    {plataforma.primeiraVez.map((passo) => (
                      <li key={passo}>{passo}</li>
                    ))}
                  </ol>
                </details>
              </article>
            </Revelar>
          ))}
        </div>

        <Revelar>
          <p className="mt-10 flex max-w-3xl items-start gap-3 rounded-2xl bg-white p-5 text-sm leading-relaxed text-secundario">
            <Icone
              nome="informacao"
              tamanho={20}
              titulo="Aviso"
              className="mt-0.5 shrink-0 text-roxo"
            />
            <span>
              As versões para computador ainda não possuem assinatura digital
              de código; por esse motivo, o sistema operacional solicita uma
              confirmação na primeira abertura. Em computadores com Windows ou
              macOS, a versão web também pode ser utilizada pelo navegador.
              Todas as versões e as respectivas notas de lançamento estão
              disponíveis em{" "}
              <a
                href={DOWNLOADS.todasAsVersoes}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-roxo underline underline-offset-4 hover:no-underline focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-roxo"
              >
                versões do FONAR
              </a>
              .
            </span>
          </p>
        </Revelar>
      </div>
    </section>
  );
}
