import { DOWNLOADS } from "@/lib/downloads";

const classeDoLink =
  "font-semibold text-roxo underline underline-offset-4 hover:no-underline focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-roxo";

export function Rodape() {
  return (
    <footer className="border-t border-lavanda bg-creme px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm font-bold text-roxo">
            FONAR — Avaliação vocal clínica
          </p>
          <nav aria-label="Rodapé" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <a href="#download" className={classeDoLink}>
              Download
            </a>
            <a
              href={DOWNLOADS.todasAsVersoes}
              target="_blank"
              rel="noopener noreferrer"
              className={classeDoLink}
            >
              Versões
            </a>
          </nav>
        </div>
        <div className="space-y-2 text-center text-sm leading-relaxed text-secundario sm:text-left">
          <p>
            O FONAR é ferramenta de apoio à decisão clínica e não emite
            diagnóstico. Praat é software independente da Universidade de
            Amsterdam, sem vínculo com o FONAR.
          </p>
          <p>
            Projeto de TCC de Engenharia de Software, PUC-Campinas. ©{" "}
            {new Date().getFullYear()} FONAR.
          </p>
        </div>
      </div>
    </footer>
  );
}
