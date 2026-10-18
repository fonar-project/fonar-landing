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
      "Descompacte o arquivo e abra o fonar_app dentro da pasta FONAR.",
      "Se aparecer “O Windows protegeu o computador”, clique em Mais informações e em Executar assim mesmo.",
      "Permita o uso do microfone quando o FONAR pedir.",
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
      "Descompacte o arquivo e arraste o FONAR para Aplicativos.",
      "Na primeira abertura o macOS bloqueia: abra Ajustes do Sistema → Privacidade e Segurança e clique em Abrir Mesmo Assim.",
      "Permita o uso do microfone quando o FONAR pedir.",
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
      "O botão abre a página da versão no GitHub. Lá, em Assets, toque em FONAR-Android.apk.",
      "Se a página abriu dentro de outro app, com um X no canto, antes de tocar no arquivo toque em ⋮ e em “Abrir no Chrome” (ou no navegador que você usa).",
      "No fim do download, o navegador avisa que o arquivo pode ser perigoso: é o aviso de todo app instalado fora da Play Store. Confirme o download.",
      "Abra o arquivo pela notificação “Download concluído” ou no app Arquivos, na pasta Downloads.",
      "O Android pede para permitir a instalação de apps desta fonte (o navegador ou o gerenciador de arquivos): permita e instale.",
      "Permita o uso do microfone na primeira gravação.",
      "Se o Android disser que o app não é compatível com o celular, baixe o FONAR-Android-32bits.apk, na mesma página do GitHub.",
    ],
  },
  {
    titulo: "iPhone e iPad",
    onde: "No Safari, sem passar pela App Store",
    acao: "Abrir a versão web",
    href: DOWNLOADS.web,
    arquivo: "versão web",
    mesmaAba: false,
    primeiraVez: [
      "Abra a versão web no Safari, toque em Compartilhar e em Adicionar à Tela de Início.",
      "Abra sempre pelo ícone: assim os dados ficam guardados no aparelho e o FONAR abre mesmo sem internet.",
      "Antes de gravar, o FONAR confere se o Safari desligou o ajuste automático do microfone. Se não desligou, ele avisa e não grava — a gravação mudaria o que a análise mede.",
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
            Baixe o FONAR.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-secundario-lavanda">
            O mesmo aplicativo, com as mesmas funções, no computador, no
            celular e no tablet. Gravar funciona sem internet; a análise sobe
            quando a conexão voltar.
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
                    Na primeira abertura
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
              As versões para computador ainda não têm assinatura de código,
              por isso o sistema pede uma confirmação na primeira abertura. No
              Mac e no computador, a versão web também funciona no navegador.
              Todas as versões e as notas de cada uma estão em{" "}
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
