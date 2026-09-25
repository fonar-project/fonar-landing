import { Icone, type NomeIcone } from "@/components/icones";
import { Revelar } from "@/components/Revelar";

type Funcionalidade = {
  icone: NomeIcone;
  titulo: string;
  descricao: string;
};

const FUNCIONALIDADES: Funcionalidade[] = [
  {
    icone: "gravar",
    titulo: "Gravação guiada",
    descricao:
      "Protocolo passo a passo com orientação na tela. Distância, frase-alvo e checagem de qualidade — nada de gravações inutilizáveis.",
  },
  {
    icone: "tendencia-sobe",
    titulo: "Análise acústica",
    descricao:
      "Métricas de f0, jitter, shimmer e HNR calculadas pelo motor Praat, apresentadas com valores de referência para interpretação clínica.",
  },
  {
    icone: "reproduzir",
    titulo: "Escalas perceptivas",
    descricao:
      "GRBAS e protocolos de autopercepção do paciente, registrados e datados na mesma avaliação que a análise acústica.",
  },
  {
    icone: "documento",
    titulo: "Laudo em PDF",
    descricao:
      "Laudo profissional com métricas, escalas e histórico do paciente, pronto para o prontuário ou para o médico solicitante.",
  },
];

export function Funcionalidades() {
  return (
    <section id="funcionalidades" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Revelar>
          <p className="text-sm font-bold uppercase tracking-widest text-secundario">
            Funcionalidades
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold text-roxo sm:text-4xl">
            Um fluxo único, da gravação ao laudo.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-chumbo">
            O que hoje se espalha por gravador, planilha, Praat e editor de
            texto acontece dentro de uma única avaliação guiada.
          </p>
        </Revelar>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FUNCIONALIDADES.map((funcionalidade, indice) => (
            <Revelar
              key={funcionalidade.titulo}
              atrasoSegundos={0.1 + indice * 0.08}
              className="h-full"
            >
              <article className="flex h-full flex-col rounded-3xl border border-lavanda bg-creme p-6 transition-shadow duration-200 hover:shadow-lg hover:shadow-roxo/10">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-roxo text-white">
                  <Icone nome={funcionalidade.icone} tamanho={24} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-roxo">
                  {funcionalidade.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-secundario">
                  {funcionalidade.descricao}
                </p>
              </article>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
