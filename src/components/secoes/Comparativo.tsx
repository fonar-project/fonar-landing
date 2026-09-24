import { Icone } from "@/components/icones";
import { Revelar } from "@/components/Revelar";

const JEITO_ANTIGO = [
  "Gravador de voz do celular, sem protocolo nem orientação",
  "Planilha com fórmulas manuais para jitter e shimmer",
  "Praat no computador, parâmetros anotados à mão",
  "Escalas perceptivas no papel, sem histórico",
  "Laudo digitado peça por peça no editor de texto",
  "Cada etapa guardada em um lugar diferente",
];

const JEITO_FONAR = [
  "Gravação guiada no próprio celular, com protocolo clínico",
  "Métricas acústicas calculadas automaticamente pelo Praat",
  "Escalas perceptivas e autopercepção no mesmo fluxo",
  "Consentimento e registro do paciente incluídos",
  "Laudo em PDF gerado ao final da avaliação",
  "Histórico completo do paciente em um só lugar",
];

export function Comparativo() {
  return (
    <section className="bg-lavanda px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Revelar>
          <p className="text-sm font-bold uppercase tracking-widest text-secundario-lavanda">
            Comparativo
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold text-roxo sm:text-4xl">
            Jeito antigo vs. FONAR.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-secundario-lavanda">
            Uma avaliação vocal completa hoje depende de meia dúzia de
            ferramentas que não conversam entre si.
          </p>
        </Revelar>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Revelar atrasoSegundos={0.1} className="h-full">
            <article className="flex h-full flex-col rounded-3xl bg-white p-7">
              <h3 className="text-lg font-bold text-secundario">
                O jeito antigo
              </h3>
              <ul className="mt-6 flex-1 space-y-4">
                {JEITO_ANTIGO.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Icone
                      nome="negacao"
                      tamanho={18}
                      className="mt-0.5 shrink-0 text-secundario"
                    />
                    <span className="text-sm leading-relaxed text-secundario">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </Revelar>

          <Revelar atrasoSegundos={0.18} className="h-full">
            <article className="relative flex h-full flex-col rounded-3xl border-2 border-roxo bg-white p-7 shadow-xl shadow-roxo/10">
              <p className="absolute -top-3.5 right-6 rounded-full bg-roxo px-4 py-1 text-xs font-bold text-white">
                Proposta FONAR
              </p>
              <h3 className="text-lg font-bold text-roxo">O jeito FONAR</h3>
              <ul className="mt-6 flex-1 space-y-4">
                {JEITO_FONAR.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Icone
                      nome="confirmacao"
                      tamanho={18}
                      className="mt-0.5 shrink-0 text-roxo"
                    />
                    <span className="text-sm leading-relaxed text-chumbo">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
