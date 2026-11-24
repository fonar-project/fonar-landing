import { Icone } from "@/components/icones";
import { Revelar } from "@/components/Revelar";

const PILARES = [
  {
    titulo: "Motor do Praat",
    descricao:
      "As medidas acústicas são calculadas pelo Praat, software de análise de voz utilizado em pesquisa há mais de três décadas. O Praat é desenvolvido de forma independente na Universidade de Amsterdam e não tem vínculo com o FONAR.",
  },
  {
    titulo: "Rotinas originais",
    descricao:
      "Nenhuma fórmula é reescrita: cada medida é obtida pela rotina original do Praat, executada por meio da biblioteca parselmouth, e o AVQI é calculado pelo script oficial publicado por seus autores.",
  },
  {
    titulo: "Classificação condicionada à referência",
    descricao:
      "Uma medida é apresentada como dentro ou fora da faixa somente quando existe faixa de referência validada para o perfil do paciente. Na ausência dessa faixa, o valor é exibido sem classificação, pois classificar sem referência válida poderia induzir a interpretações equivocadas.",
  },
];

export function Ciencia() {
  return (
    <section id="ciencia" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Revelar>
          <p className="text-sm font-bold uppercase tracking-widest text-secundario">
            Base científica
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold text-roxo sm:text-4xl">
            Análise acústica fundamentada em software de referência.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-chumbo">
            A confiabilidade de um laudo depende da origem dos valores
            apresentados. O FONAR não desenvolve algoritmos próprios de
            análise acústica: utiliza o motor de um software consolidado na
            pesquisa em voz.
          </p>
        </Revelar>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PILARES.map((pilar) => (
            <Revelar key={pilar.titulo} className="h-full">
              <article className="h-full rounded-3xl border border-lavanda bg-creme p-7">
                <h3 className="text-lg font-bold text-roxo">{pilar.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-secundario">
                  {pilar.descricao}
                </p>
              </article>
            </Revelar>
          ))}
        </div>

        <Revelar>
          <p className="mt-10 flex max-w-3xl items-start gap-3 rounded-2xl bg-creme p-5 text-sm leading-relaxed text-secundario">
            <Icone
              nome="informacao"
              tamanho={20}
              titulo="Aviso"
              className="mt-0.5 shrink-0 text-roxo"
            />
            O FONAR é um instrumento de apoio à prática clínica: não substitui
            a avaliação fonoaudiológica nem o julgamento do profissional
            responsável.
          </p>
        </Revelar>
      </div>
    </section>
  );
}
