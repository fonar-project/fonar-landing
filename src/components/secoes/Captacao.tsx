"use client";

// Formulário de captação de interessados. Escreve DIRETO no Firestore pelo
// SDK web (CLAUDE.md: export estático = zero API routes). A proteção contra
// abuso é feita nas security rules do console do Firebase (regra de projeto:
// nada de servidor aqui), e no cliente por um honeypot + tempo mínimo de
// preenchimento — suficientes para o volume de uma landing.

import { useEffect, useRef, useState, type FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  obterFirestore,
} from "@/lib/firebase";
import { Icone } from "@/components/icones";
import { Revelar } from "@/components/Revelar";

const AREAS = [
  "Fonoaudiologia clínica",
  "Fonoaudiologia hospitalar",
  "Estudante de fonoaudiologia",
  "Docência / pesquisa",
  "Outra área",
] as const;

type EstadoEnvio = "parado" | "enviando" | "sucesso" | "erro";

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Captacao() {
  const [estado, setEstado] = useState<EstadoEnvio>("parado");
  const [mensagemErro, setMensagemErro] = useState("");
  const instantesNaMontagem = useRef<number | null>(null);

  // Efeito, não render: Date.now() é impuro e o render tem que ser idempotente.
  useEffect(() => {
    instantesNaMontagem.current = Date.now();
  }, []);

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (estado === "enviando") return;

    const formulario = evento.currentTarget;
    const dados = new FormData(formulario);

    // Honeypot: campo invisível que só robô preenche. Responde "sucesso" sem
    // gravar nada — o robô não aprende, o humano nunca vê.
    if (String(dados.get("empresa") ?? "") !== "") {
      setEstado("sucesso");
      return;
    }
    // Preenchimento em menos de 3 s é robô (null = submit antes mesmo de
    // o efeito de montagem rodar, ou seja, instantâneo).
    if (
      instantesNaMontagem.current === null ||
      Date.now() - instantesNaMontagem.current < 3000
    ) {
      setEstado("sucesso");
      return;
    }

    const nome = String(dados.get("nome") ?? "").trim();
    const email = String(dados.get("email") ?? "").trim();
    const area = String(dados.get("area") ?? "").trim();

    if (nome.length < 2 || !EMAIL_VALIDO.test(email) || area === "") {
      setEstado("erro");
      setMensagemErro("Confira os campos destacados e tente de novo.");
      return;
    }

    setEstado("enviando");
    setMensagemErro("");

    const banco = obterFirestore();
    if (!banco) {
      setEstado("erro");
      setMensagemErro(
        "O formulário ainda não está conectado ao banco de dados. " +
          "Tente novamente mais tarde.",
      );
      return;
    }

    try {
      await addDoc(collection(banco, "interessados"), {
        nome,
        email,
        area,
        origem: "landing-fonar",
        criadoEm: serverTimestamp(),
      });
      setEstado("sucesso");
    } catch {
      setEstado("erro");
      setMensagemErro(
        "Não consegui registrar seu e-mail agora. Tente novamente em instantes.",
      );
    }
  }

  return (
    <section id="captacao" className="bg-creme px-6 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Revelar>
          <p className="text-sm font-bold uppercase tracking-widest text-secundario">
            Lançamento
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-roxo sm:text-4xl">
            Quero ser avisado quando o FONAR lançar.
          </h2>
          <p className="mt-4 max-w-md text-lg text-chumbo">
            Uma mensagem só, no dia do lançamento. Nada de spam — e você sai da
            lista com um clique.
          </p>
        </Revelar>

        <Revelar atrasoSegundos={0.12}>
          {estado === "sucesso" ? (
            <div
              role="status"
              className="rounded-3xl border-2 border-roxo bg-white p-8 text-center"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-roxo text-white">
                <Icone nome="confirmacao" tamanho={28} />
              </span>
              <h3 className="mt-5 text-xl font-bold text-roxo">
                E-mail registrado!
              </h3>
              <p className="mt-2 text-secundario">
                Você vai receber o aviso assim que o FONAR lançar.
              </p>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={aoEnviar}
              className="rounded-3xl border border-lavanda bg-white p-7 sm:p-8"
            >
              {/* Honeypot: invisível para humano e leitor de tela. */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="empresa">Empresa</label>
                <input
                  id="empresa"
                  name="empresa"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="captacao-nome"
                    className="block text-sm font-bold text-roxo"
                  >
                    Nome
                  </label>
                  <input
                    id="captacao-nome"
                    name="nome"
                    type="text"
                    required
                    minLength={2}
                    autoComplete="name"
                    placeholder="Como devemos te chamar"
                    className="mt-2 w-full rounded-2xl border border-lavanda bg-creme px-4 py-3 text-chumbo placeholder:text-secundario focus:outline-2 focus:outline-offset-0 focus:outline-roxo"
                  />
                </div>

                <div>
                  <label
                    htmlFor="captacao-email"
                    className="block text-sm font-bold text-roxo"
                  >
                    E-mail
                  </label>
                  <input
                    id="captacao-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="voce@exemplo.com.br"
                    className="mt-2 w-full rounded-2xl border border-lavanda bg-creme px-4 py-3 text-chumbo placeholder:text-secundario focus:outline-2 focus:outline-offset-0 focus:outline-roxo"
                  />
                </div>

                <div>
                  <label
                    htmlFor="captacao-area"
                    className="block text-sm font-bold text-roxo"
                  >
                    Área de atuação
                  </label>
                  <select
                    id="captacao-area"
                    name="area"
                    required
                    defaultValue=""
                    className="mt-2 w-full rounded-2xl border border-lavanda bg-creme px-4 py-3 text-chumbo focus:outline-2 focus:outline-offset-0 focus:outline-roxo"
                  >
                    <option value="" disabled>
                      Selecione sua área
                    </option>
                    {AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                {estado === "erro" && mensagemErro !== "" && (
                  <p
                    role="alert"
                    className="flex items-start gap-2 rounded-2xl bg-creme p-4 text-sm font-semibold text-roxo"
                  >
                    <Icone
                      nome="alerta"
                      tamanho={18}
                      className="mt-0.5 shrink-0 text-roxo"
                    />
                    {mensagemErro}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={estado === "enviando"}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-roxo px-6 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-roxo-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-roxo disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {estado === "enviando" ? (
                    <>
                      <Icone
                        nome="girar-aparelho"
                        tamanho={18}
                        className="animate-spin"
                      />
                      Registrando…
                    </>
                  ) : (
                    "Quero ser avisado"
                  )}
                </button>

                <p className="text-center text-xs leading-relaxed text-secundario">
                  Usamos seu e-mail apenas para avisar do lançamento do FONAR
                  (LGPD). Sem newsletters, sem compartilhamento.
                </p>
              </div>
            </form>
          )}
        </Revelar>
      </div>
    </section>
  );
}
