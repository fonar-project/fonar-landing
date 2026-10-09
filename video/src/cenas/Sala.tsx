import React from "react";
import { useCurrentFrame } from "remotion";
import { Fundo, Legenda, Posicionar, Som, Toque } from "../ui/cena";
import { Notebook } from "../ui/aparelhos";
import { AppDesktop, Botao, Etapas, Icone, Medidor, Pilula } from "../ui/app";
import { PACIENTE, S } from "../dados/textos";
import voz from "../dados/voz.json";
import { cor, raio, tipo } from "../tema";
import { entra, prog } from "../movimento";

// 4 · A sala importa: aferição de ruído (5 s, dBFS), com a leitura vinda do
// trecho de silêncio da gravação (mediana de leituras de 100 ms, como no app).
const MEDIR_EM = 28;
const MEDICAO = 150; // 5 s, como AfericaoDeRuido.duracao
const nivel = (m: number) => `${m < -0.5 ? "−" : ""}${Math.round(Math.abs(m))} dBFS`;

export const PalcoDesktop: React.FC<{ rotulo: string; children: React.ReactNode; etapa: number }> = ({ rotulo, children, etapa }) => (
  <div style={{ position: "absolute", inset: 0, padding: "30px 34px 27px", display: "flex", flexDirection: "column" }}>
    <Etapas atual={etapa} concluidas={etapa} />
    <div
      style={{
        marginTop: 26,
        flex: 1,
        border: `1px solid ${cor.lavanda}`,
        borderRadius: raio.medio,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ fontSize: 12, letterSpacing: 2, fontWeight: 700, color: cor.secundario, textTransform: "uppercase" }}>{rotulo}</div>
      {children}
      <div style={{ position: "absolute", right: 16, bottom: 14, ...tipo.bodySmall, color: cor.secundario }}>{S.capturaAtalhos}</div>
    </div>
  </div>
);

const Instrucao: React.FC<{ texto: string; style?: React.CSSProperties }> = ({ texto, style }) => (
  <div style={{ marginTop: 16, maxWidth: 760, textAlign: "center", fontSize: 44, lineHeight: 1.2, fontWeight: 700, color: cor.chumbo, ...style }}>
    {texto}
  </div>
);

export const Sala: React.FC = () => {
  const frame = useCurrentFrame();
  const leituras = voz.sala.leituras;
  const t = frame - MEDIR_EM;
  const medindo = t >= 0 && t < MEDICAO;
  const pronto = frame >= MEDIR_EM + MEDICAO;
  const leitura = medindo ? leituras[Math.floor(t / 3) % leituras.length] : null;

  return (
    <Fundo>
      <Posicionar w={1476} h={1000} cx={1215} cy={520} escala={0.72}>
        <Notebook>
          <AppDesktop ativo={1} trilha={[S.pacientesTitulo, PACIENTE, S.capturaTitulo]} pilula={<Pilula texto={S.situacaoConsentimentoRegistrado} />}>
            <PalcoDesktop rotulo={S.etapaDe(1, 3, S.etapaRuidoNome)} etapa={0}>
              {!medindo && !pronto ? (
                <>
                  <Instrucao texto={S.instrucaoRuidoPronto} />
                  <div style={{ marginTop: 16, maxWidth: 480, textAlign: "center", ...tipo.bodyMedium, color: cor.secundario }}>{S.afericaoExplicacao}</div>
                  <Botao rotulo={S.afericaoMedir} primaria pressionado={frame >= 24 && frame < 28} style={{ marginTop: 24 }} />
                </>
              ) : null}
              {medindo ? (
                <>
                  <Instrucao texto={S.instrucaoRuidoMedindo} />
                  <div style={{ marginTop: 24 }}>
                    <Medidor dbfs={leitura} ambiente />
                    <div style={{ marginTop: 16, height: 3, background: cor.lavanda, borderRadius: 2 }}>
                      <div style={{ width: `${(t / MEDICAO) * 100}%`, height: "100%", background: cor.roxo }} />
                    </div>
                  </div>
                </>
              ) : null}
              {pronto ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", ...entra(frame, MEDIR_EM + MEDICAO) }}>
                  <Instrucao texto={S.instrucaoRuidoOk} />
                  <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
                    <Icone nome="confirmacao" tamanho={26} />
                    <div>
                      <div style={{ ...tipo.titleMedium }}>{S.afericaoSemRestricao}</div>
                      <div style={{ ...tipo.bodyMedium, color: cor.secundario }}>{S.afericaoSemRestricaoTexto(nivel(voz.sala.mediana_dbfs))}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
                    <Botao rotulo={S.capturaContinuar} primaria largura={220} />
                    <Botao rotulo={S.afericaoMedirDeNovo} largura={220} />
                  </div>
                </div>
              ) : null}
            </PalcoDesktop>
          </AppDesktop>
        </Notebook>
        <Toque em={24} x={18 + 222 + 609} y={18 + 34 + 62 + 520} />
      </Posicionar>
      <Som em={24} arquivo="clique" />

      <Legenda
        de={8}
        ate={196}
        titulo={<>A sala<br />importa.</>}
        apoio="Antes de gravar, 5 segundos de silêncio: o ruído da sala medido em dBFS."
        style={{ left: 110, width: 560, top: 380 }}
      />
      <Legenda
        de={196}
        titulo={<>Microfone mudo não é sala silenciosa.</>}
        style={{ left: 110, width: 560, top: 300 }}
        tamanho={54}
      />
      {frame >= 204 ? (
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 560,
            width: 520,
            padding: 28,
            borderRadius: raio.grande,
            background: cor.branco,
            border: `1.5px solid ${cor.lavanda}`,
            ...entra(frame, 204, 10, 12),
          }}
        >
          <Medidor dbfs={null} largura={464} />
          <div style={{ display: "flex", gap: 12, marginTop: 20, alignItems: "flex-start" }}>
            <Icone nome="alerta" tamanho={24} cor={cor.chumbo} />
            <div style={{ fontSize: 24, fontWeight: 700, color: cor.chumbo, lineHeight: 1.3 }}>{S.afericaoMudo}</div>
          </div>
          <div style={{ marginTop: 10, fontSize: 19, color: cor.secundario, lineHeight: 1.4, opacity: prog(frame, 210, 220) }}>
            «A gravação fica bloqueada até o microfone captar som.»
          </div>
        </div>
      ) : null}
    </Fundo>
  );
};
