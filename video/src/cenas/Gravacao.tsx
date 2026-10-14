import React from "react";
import { useCurrentFrame } from "remotion";
import { Fundo, Legenda, Posicionar, Som, Toque, VozDaCena } from "../ui/cena";
import { Celular, CELULAR_ALTURA, CELULAR_LARGURA } from "../ui/aparelhos";
import { AppCelular, Botao, CabecalhoMobile, Etapas, Icone, Medidor, Spinner } from "../ui/app";
import { PACIENTE, S } from "../dados/textos";
import voz from "../dados/voz.json";
import { cor, tipo, FPS } from "../tema";
import { DEIXAS_DE_VOZ, quadros } from "../linhaDoTempo";
import { entra } from "../movimento";

// 5 · Gravação guiada no celular: /a/, conferência do WAV, fala, revisão.
const [V_INI, V_ARQ, V_DUR] = DEIXAS_DE_VOZ.Gravacao[0];
const FALA = DEIXAS_DE_VOZ.Gravacao[1];
const V_FIM = V_INI + quadros(V_DUR);
const F_INI = FALA ? FALA[0] : V_FIM + 75;
const F_FIM = FALA ? F_INI + quadros(FALA[2]) : F_INI + 60;
const segundos = (s: number) => `${s.toFixed(1).replace(".", ",")} s`;

const nivelNoArquivo = (s: number) => voz.nivel_por_quadro[Math.min(voz.nivel_por_quadro.length - 1, Math.max(0, Math.round(s * FPS)))];

const Cabeca: React.FC<{ rotulo: string; instrucao: string; provisoria?: boolean; f: number }> = ({ rotulo, instrucao, provisoria, f }) => (
  <div style={{ textAlign: "center", ...entra(f, 0) }}>
    <div style={{ fontSize: 12, letterSpacing: 2, fontWeight: 700, color: cor.secundario, textTransform: "uppercase" }}>{rotulo}</div>
    <div style={{ marginTop: 16, fontSize: 30, lineHeight: 1.2, fontWeight: 700, color: cor.chumbo }}>{instrucao}</div>
    {provisoria ? <div style={{ marginTop: 12, ...tipo.bodySmall, color: cor.secundario }}>{S.instrucaoProvisoria}</div> : null}
  </div>
);

const Cronometro: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 24 }}>
    <Icone nome="gravar" tamanho={18} />
    <span style={{ ...tipo.labelSmall, letterSpacing: 2, fontWeight: 700, color: cor.roxo }}>{S.gravandoRotulo.toUpperCase()}</span>
    <span style={{ ...tipo.titleLarge, marginLeft: 6, fontVariantNumeric: "tabular-nums" }}>
      00:{String(Math.floor(s)).padStart(2, "0")}
    </span>
  </div>
);

const Acoes: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ borderTop: `1px solid ${cor.lavanda}`, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
);

const Tela: React.FC<{ frame: number }> = ({ frame }) => {
  const vogal = S.etapaDe(2, 3, S.tarefaVogalTitulo);
  const fala = S.etapaDe(3, 3, S.tarefaFalaTitulo);
  let etapa = 1;
  let concluidas = 1;
  let corpo: React.ReactNode;
  let acoes: React.ReactNode;

  if (frame < V_INI) {
    corpo = <Cabeca rotulo={vogal} instrucao={S.instrucaoVogalPronto} provisoria f={frame + 10} />;
    acoes = <Botao rotulo={S.capturaIniciarGravacao} icone="gravar" primaria pressionado={frame >= V_INI - 6} />;
  } else if (frame < V_FIM) {
    const s = (frame - V_INI) / FPS;
    corpo = (
      <>
        <Cabeca rotulo={vogal} instrucao={S.instrucaoVogalGravando} f={frame - V_INI} />
        <Cronometro s={s} />
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
          <Medidor dbfs={nivelNoArquivo(V_ARQ + s)} largura={320} />
        </div>
      </>
    );
    acoes = <Botao rotulo={S.tarefaParar} icone="pausar" primaria />;
  } else if (frame < V_FIM + 25) {
    corpo = (
      <>
        <Cabeca rotulo={vogal} instrucao={S.instrucaoConferindo} f={frame - V_FIM} />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <Spinner frame={frame} />
        </div>
      </>
    );
  } else if (frame < F_INI - 6) {
    corpo = (
      <>
        <Cabeca rotulo={vogal} instrucao={S.instrucaoAmostraBoa} f={frame - V_FIM - 25} />
        <div style={{ display: "flex", gap: 12, marginTop: 22, ...entra(frame, V_FIM + 28) }}>
          <Icone nome="confirmacao" tamanho={24} />
          <div>
            <div style={{ ...tipo.titleMedium }}>{S.tarefaGravada(segundos(V_DUR))}</div>
            <div style={{ ...tipo.bodyMedium, color: cor.secundario }}>{S.tarefaGravadaTexto}</div>
          </div>
        </div>
      </>
    );
    acoes = (
      <>
        <Botao rotulo={S.capturaProximaEtapa} primaria pressionado={frame >= F_INI - 12} />
        <Botao rotulo={S.capturaRegravar} />
      </>
    );
  } else if (frame < F_FIM) {
    etapa = 2;
    concluidas = 2;
    const s = Math.max(0, (frame - F_INI) / FPS);
    corpo =
      frame < F_INI ? (
        <Cabeca rotulo={fala} instrucao={S.instrucaoFalaPronto} provisoria f={frame - F_INI + 6} />
      ) : (
        <>
          <Cabeca rotulo={fala} instrucao={S.instrucaoFalaGravando} f={frame - F_INI} />
          <Cronometro s={s} />
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
            <Medidor dbfs={FALA ? nivelNoArquivo(FALA[1] + s) : -30} largura={320} />
          </div>
        </>
      );
    acoes = <Botao rotulo={frame < F_INI ? S.capturaIniciarGravacao : S.tarefaParar} icone={frame < F_INI ? "gravar" : "pausar"} primaria />;
  } else if (frame < F_FIM + 18) {
    etapa = 2;
    concluidas = 2;
    corpo = (
      <>
        <Cabeca rotulo={fala} instrucao={S.instrucaoConferindo} f={frame - F_FIM} />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <Spinner frame={frame} />
        </div>
      </>
    );
  } else {
    etapa = 3;
    concluidas = 3;
    const f = frame - F_FIM - 18;
    corpo = (
      <>
        <Cabeca rotulo={S.revisaoTitulo} instrucao={S.revisaoInstrucao} f={f} />
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10, ...entra(f, 4) }}>
          {[
            [S.tarefaVogalTitulo, segundos(V_DUR)],
            [S.tarefaFalaTitulo, segundos(FALA ? FALA[2] : 3)],
          ].map(([n, d]) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, background: cor.branco, border: `1px solid ${cor.lavanda}`, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, border: `1.5px solid ${cor.roxo}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icone nome="reproduzir" tamanho={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...tipo.titleMedium }}>{n}</div>
                <div style={{ ...tipo.bodySmall, color: cor.secundario }}>{S.tarefaGravada(d)}</div>
              </div>
              <Icone nome="confirmacao" tamanho={20} />
            </div>
          ))}
        </div>
      </>
    );
    acoes = (
      <>
        <div style={{ ...tipo.bodySmall, color: cor.secundario, textAlign: "center" }}>
          {S.revisaoResumo(2, 2)} {S.capturaEnviarApoio}
        </div>
        <Botao rotulo={S.capturaEnviar} primaria />
      </>
    );
  }

  return (
    <AppCelular>
      <CabecalhoMobile titulo={S.capturaTitulo} subtitulo={PACIENTE} />
      <div style={{ padding: "14px 16px 0" }}>
        <Etapas atual={etapa} concluidas={concluidas} compacta />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px" }}>{corpo}</div>
      {acoes ? <Acoes>{acoes}</Acoes> : <div style={{ height: 85 }} />}
    </AppCelular>
  );
};

export const Gravacao: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Fundo>
      <VozDaCena cena="Gravacao" />
      <Posicionar w={CELULAR_LARGURA} h={CELULAR_ALTURA} cx={600} cy={540} escala={1.04}>
        <Celular>
          <div style={{ position: "absolute", top: 28, left: 0 }}>
            <Tela frame={frame} />
          </div>
          <Toque em={V_INI - 6} x={195} y={28 + 844 - 42} claro />
          <Toque em={F_INI - 12} x={195} y={28 + 844 - 100} claro />
        </Celular>
      </Posicionar>
      <Som em={V_INI - 6} arquivo="clique" volume={0.7} />
      <Som em={F_INI - 12} arquivo="clique" volume={0.7} />
      <Legenda
        de={6}
        ate={V_FIM + 20}
        titulo={<>Instrução grande, para o paciente ler de longe.</>}
        apoio="Gravação guiada, uma etapa por vez: vogal sustentada /a/, depois fala encadeada."
        style={{ left: 980, width: 800, top: 360 }}
      />
      <Legenda
        de={V_FIM + 20}
        ate={F_FIM + 18}
        titulo={<>Cada WAV é conferido depois de gravado.</>}
        apoio={<>«{S.tarefaGravadaTexto}»</>}
        style={{ left: 980, width: 800, top: 380 }}
      />
      <Legenda
        de={F_FIM + 18}
        titulo={<>Revisão antes de enviar.</>}
        apoio="Ouvir cada amostra e regravar o que não serviu — ainda com o paciente na sala."
        style={{ left: 980, width: 800, top: 400 }}
      />
    </Fundo>
  );
};
