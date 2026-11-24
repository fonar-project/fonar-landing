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
      "A coleta é conduzida em etapas: primeiro, a medição do ruído ambiente; em seguida, a vogal sustentada e a fala encadeada. Cada gravação é verificada quanto ao formato, à presença de sinal e à saturação antes da etapa seguinte.",
  },
  {
    icone: "tendencia-sobe",
    titulo: "Análise acústica",
    descricao:
      "Frequência fundamental (f0), jitter, shimmer, relação harmônico-ruído (HNR), CPPS e AVQI são calculados no servidor pelo motor do Praat. Uma medida somente é classificada quando existe faixa de referência validada para o perfil do paciente.",
  },
  {
    icone: "reproduzir",
    titulo: "CAPE-V",
    descricao:
      "Avaliação perceptivo-auditiva da qualidade vocal em escala visual analógica de 100 mm, registrada durante a escuta da própria gravação e vinculada à mesma sessão da análise acústica.",
  },
  {
    icone: "documento",
    titulo: "Laudo em PDF",
    descricao:
      "Documento com as medidas acústicas, a CAPE-V, o espectrograma e a conclusão do profissional, identificado por número próprio. A emissão é restrita a profissionais com inscrição no conselho conferida pela equipe do FONAR. Cada nova emissão gera outro documento, que indica qual laudo substitui.",
  },
  {
    icone: "confirmacao",
    titulo: "Consentimento antes da voz",
    descricao:
      "A gravação somente é liberada após o registro do consentimento do paciente ou de seu responsável legal. A retirada do consentimento bloqueia novas gravações e novos envios.",
  },
  {
    icone: "estado-sem-conexao",
    titulo: "Funcionamento sem conexão",
    descricao:
      "As gravações realizadas sem acesso à internet permanecem em uma fila no aparelho e são enviadas para análise quando a conexão é restabelecida.",
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
            Etapas que hoje são realizadas com gravador, planilha, Praat e
            editor de texto passam a compor uma única avaliação guiada.
          </p>
        </Revelar>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FUNCIONALIDADES.map((funcionalidade) => (
            <Revelar key={funcionalidade.titulo} className="h-full">
              <article className="flex h-full flex-col rounded-3xl border border-lavanda bg-creme p-6 transition-shadow duration-150 hover:shadow-lg hover:shadow-roxo/10 motion-reduce:transition-none">
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
