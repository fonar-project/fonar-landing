import { Icone } from "@/components/icones";
import { Revelar } from "@/components/Revelar";

const PILARES = [
  {
    titulo: "Motor do Praat",
    descricao:
      "As medidas acústicas são calculadas pelo Praat, software de análise de voz usado em pesquisa há mais de três décadas. O Praat é desenvolvido de forma independente na Universidade de Amsterdam e não tem vínculo com o FONAR.",
  },
  {
    titulo: "Sem reimplementação",
    descricao:
      "Nada de fórmula refeita: cada medida sai da rotina original do Praat, executada pela ponte parselmouth, e o AVQI pelo script oficial publicado pelos autores.",
  },
  {
    titulo: "Classificação só com referência",
    descricao:
      "Uma medida só aparece como dentro ou fora da faixa quando há faixa de referência validada para o perfil do paciente. Sem ela, o valor aparece sem rótulo — classificar sem referência válida seria pior do que não classificar.",
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
            Análise acústica com respaldo, não com fórmula caseira.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-chumbo">
            A confiança num laudo vem da origem dos números. O FONAR não
            reinventa acústica — ele entrega a acústica já validada.
          </p>
        </Revelar>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PILARES.map((pilar, indice) => (
            <Revelar
              key={pilar.titulo}
              atrasoSegundos={0.1 + indice * 0.08}
              className="h-full"
            >
              <article className="h-full rounded-3xl border border-lavanda bg-creme p-7">
                <h3 className="text-lg font-bold text-roxo">{pilar.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-secundario">
                  {pilar.descricao}
                </p>
              </article>
            </Revelar>
          ))}
        </div>

        <Revelar atrasoSegundos={0.3}>
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
