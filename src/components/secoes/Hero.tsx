import { Icone } from "@/components/icones";
import { Botao } from "@/components/Botao";
import { Revelar } from "@/components/Revelar";

/**
 * Mockup estático do app, apenas decorativo: dá concretude à promessa do
 * headline sem afirmar nada que o produto não faz (regra do CLAUDE.md).
 */
function MockupApp() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-lavanda/50 blur-2xl" />

      <div className="rounded-3xl border border-lavanda bg-white p-5 shadow-xl shadow-roxo/10">
        <div className="flex items-center justify-between border-b border-lavanda pb-3">
          <p className="text-sm font-bold text-roxo">Avaliação vocal</p>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-secundario">
            <Icone nome="estado-online" tamanho={10} className="text-roxo" />
            Sessão ativa
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-creme p-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-roxo text-white">
                <Icone nome="gravar" tamanho={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-roxo">Gravação guiada</p>
                <p className="text-xs text-chumbo">
                  Sustente a vogal /a/ por 5 segundos
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-creme p-3.5">
            <p className="text-sm font-bold text-roxo">Análise acústica</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["f0 médio 142 Hz", "Jitter 0,74%", "Shimmer 3,1%", "HNR 21,8 dB"].map(
                (metrica) => (
                  <span
                    key={metrica}
                    className="rounded-full border border-lavanda bg-white px-2.5 py-1 text-[11px] font-semibold text-chumbo"
                  >
                    {metrica}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-creme p-3.5">
            <p className="text-sm font-bold text-roxo">Escala GRBAS</p>
            <p className="mt-1 text-xs text-chumbo">
              G2 · R1 · B1 · A0 · S0
            </p>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl bg-creme p-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-roxo text-white">
              <Icone nome="documento" tamanho={18} />
            </span>
            <p className="flex-1 text-sm font-bold text-roxo">Laudo.pdf</p>
            <Icone nome="confirmacao" tamanho={18} className="text-roxo" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="overflow-hidden px-6 pb-20 pt-14 sm:pt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>
          <Revelar>
            <p className="inline-flex items-center gap-2 rounded-full border border-lavanda bg-white px-4 py-1.5 text-sm font-semibold text-secundario">
              <Icone nome="estado-online" tamanho={10} className="text-roxo" />
              Em desenvolvimento — lançamento em breve
            </p>
          </Revelar>

          <Revelar atrasoSegundos={0.08}>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-roxo sm:text-5xl lg:text-6xl">
              A avaliação vocal clínica, finalmente no século XXI.
            </h1>
          </Revelar>

          <Revelar atrasoSegundos={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-chumbo">
              Gravação guiada, análise acústica, escalas perceptivas e laudo em
              PDF — todo o processo da avaliação vocal em um único fluxo,
              direto do seu celular ou computador.
            </p>
          </Revelar>

          <Revelar atrasoSegundos={0.24}>
            <div className="mt-9 flex flex-wrap gap-4">
              <Botao href="#captacao">Quero ser avisado</Botao>
              <Botao href="#funcionalidades" variante="secundario">
                Ver funcionalidades
              </Botao>
            </div>
          </Revelar>
        </div>

        <Revelar atrasoSegundos={0.2} className="lg:justify-self-end">
          <MockupApp />
        </Revelar>
      </div>
    </section>
  );
}
