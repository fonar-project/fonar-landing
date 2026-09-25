import { Icone } from "@/components/icones";
import { Botao } from "@/components/Botao";
import { Revelar } from "@/components/Revelar";

const PLATAFORMAS = [
  {
    icone: "documento" as const,
    titulo: "Windows",
    estado: "Em desenvolvimento",
    disponivel: false,
  },
  {
    icone: "gravar" as const,
    titulo: "Android",
    estado: "Em breve",
    disponivel: false,
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
            Baixe o FONAR quando lançar.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-secundario-lavanda">
            As versões ainda estão em desenvolvimento. Cadastre-se na seção
            abaixo e você recebe o aviso no dia do lançamento.
          </p>
        </Revelar>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
          {PLATAFORMAS.map((plataforma, indice) => (
            <Revelar
              key={plataforma.titulo}
              atrasoSegundos={0.1 + indice * 0.08}
              className="h-full"
            >
              <article className="flex h-full flex-col rounded-3xl bg-white p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-creme text-roxo">
                    <Icone nome={plataforma.icone} tamanho={24} />
                  </span>
                  <span className="rounded-full border border-lavanda bg-creme px-3 py-1 text-xs font-bold text-secundario">
                    {plataforma.estado}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-roxo">
                  {plataforma.titulo}
                </h3>
                {plataforma.disponivel ? (
                  <Botao href="#download" className="mt-auto self-start pt-0">
                    Baixar
                  </Botao>
                ) : (
                  <p className="mt-4 flex items-center gap-2 text-sm text-secundario">
                    <Icone
                      nome="passo-pendente"
                      tamanho={16}
                      className="text-secundario"
                    />
                    Ainda não disponível
                  </p>
                )}
              </article>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
