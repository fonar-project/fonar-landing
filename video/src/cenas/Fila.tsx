import React from "react";
import { useCurrentFrame } from "remotion";
import { Fundo, Legenda, Posicionar, Som, Toque } from "../ui/cena";
import { Celular, CELULAR_ALTURA, CELULAR_LARGURA } from "../ui/aparelhos";
import { AppCelular, Botao, CabecalhoMobile, Icone } from "../ui/app";
import { PACIENTE, S } from "../dados/textos";
import { cor, raio, tipo } from "../tema";
import { entra, prog } from "../movimento";
import type { NomeIcone } from "../ui/icones.gerado";

// 6 · Envio pela fila: a rede cai, a fila segura, a rede volta, o envio sobe.
const CAI = 55;
const VOLTA = 115;
const CHEGA = 160;

const NavInferior: React.FC = () => (
  <div style={{ height: 56, borderTop: `1px solid ${cor.lavanda}`, display: "flex" }}>
    {["Pacientes", "Nova", "Histórico", "Fila", "Conta"].map((n) => (
      <div
        key={n}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          fontWeight: n === "Fila" ? 700 : 500,
          color: n === "Fila" ? cor.roxo : cor.secundario,
          borderTop: n === "Fila" ? `3px solid ${cor.roxo}` : "3px solid transparent",
          marginTop: -1,
        }}
      >
        {n}
      </div>
    ))}
  </div>
);

const TelaFila: React.FC<{ frame: number }> = ({ frame }) => {
  const online = frame < CAI || frame >= VOLTA;
  const enviado = frame >= CHEGA;
  const enviando = frame >= VOLTA && !enviado;
  const [icone, titulo, texto]: [NomeIcone, string, string] = enviado
    ? ["confirmacao", S.filaEnviado, S.filaEnviadoTexto]
    : enviando
      ? ["avancar", S.filaEnviando, S.filaEnviandoTexto]
      : online
        ? ["passo-pendente", S.filaNaFila, S.filaNaFilaTexto]
        : ["estado-sem-conexao", S.filaAguardandoConexao, S.filaAguardandoConexaoTexto];
  return (
    <AppCelular>
      <CabecalhoMobile titulo={S.filaTitulo} voltar={false} online={online} />
      <div style={{ flex: 1, padding: 16 }}>
        <div style={{ ...tipo.titleMedium }}>{enviado ? S.filaResumo0 : S.filaResumo1}</div>
        {!online ? (
          <div style={{ marginTop: 14, padding: 14, borderRadius: raio.medio, background: cor.lavandaSuave, display: "flex", gap: 12, ...entra(frame, CAI) }}>
            <Icone nome="estado-sem-conexao" tamanho={22} cor={cor.chumbo} />
            <div>
              <div style={{ ...tipo.titleMedium }}>{S.filaSemConexaoTitulo}</div>
              <div style={{ ...tipo.bodySmall, color: cor.secundario }}>{S.filaSemConexaoTexto}</div>
            </div>
          </div>
        ) : null}
        <div style={{ marginTop: 14, background: cor.branco, border: `1px solid ${cor.lavanda}`, borderRadius: raio.medio, padding: 16 }}>
          <div style={{ ...tipo.titleMedium }}>{PACIENTE}</div>
          <div style={{ ...tipo.bodySmall, color: cor.secundario }}>{S.filaGravacoes}</div>
          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            <Icone nome={icone} tamanho={22} cor={cor.roxo} />
            <div>
              <div style={{ ...tipo.titleMedium }}>{titulo}</div>
              <div style={{ ...tipo.bodySmall, color: cor.secundario }}>{texto}</div>
            </div>
          </div>
          {enviando ? (
            <div style={{ marginTop: 12, height: 4, borderRadius: 2, background: cor.lavanda }}>
              <div style={{ width: `${prog(frame, VOLTA, CHEGA) * 100}%`, height: "100%", background: cor.roxo, borderRadius: 2 }} />
            </div>
          ) : null}
          {enviado ? (
            <div style={{ marginTop: 14, ...entra(frame, CHEGA + 4) }}>
              <Botao rotulo={S.filaVerResultado} icone="avancar" altura={48} />
            </div>
          ) : null}
        </div>
      </div>
      <NavInferior />
    </AppCelular>
  );
};

const Diagrama: React.FC<{ frame: number }> = ({ frame }) => {
  const online = frame < CAI || frame >= VOLTA;
  const pacote = prog(frame, VOLTA, CHEGA);
  const chegou = frame >= CHEGA;
  const caixa = (ativo: boolean): React.CSSProperties => ({
    width: 250,
    height: 150,
    borderRadius: raio.grande,
    background: cor.branco,
    border: `2px solid ${ativo ? cor.roxo : cor.lavanda}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  });
  return (
    <div style={{ position: "absolute", left: 960, top: 170, width: 820, height: 180, ...entra(frame, 6, 10, 10) }}>
      <div style={{ position: "absolute", left: 0, top: 0, ...caixa(true) }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: cor.chumbo }}>Aparelho</div>
        <div style={{ fontSize: 20, color: cor.secundario }}>grava · envia · exibe</div>
      </div>
      <svg width={820} height={150} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={260} x2={560} y1={75} y2={75} stroke={online ? cor.roxo : cor.lavanda} strokeWidth={3} strokeDasharray={online ? "0" : "8 10"} />
        {!online ? (
          <g transform="translate(390 50)">
            <circle cx={20} cy={25} r={22} fill={cor.creme} stroke={cor.lavanda} strokeWidth={2} />
            <path d="M10 15l20 20M30 15L10 35" stroke={cor.secundario} strokeWidth={3} strokeLinecap="round" />
          </g>
        ) : null}
        {frame >= VOLTA && !chegou ? <circle cx={260 + 300 * pacote} cy={75} r={11} fill={cor.roxo} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 570, top: 0, ...caixa(chegou) }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: cor.chumbo }}>Servidor</div>
        <div style={{ fontSize: 20, color: cor.secundario }}>Praat · parselmouth</div>
      </div>
    </div>
  );
};

export const Fila: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Fundo>
      <Posicionar w={CELULAR_LARGURA} h={CELULAR_ALTURA} cx={520} cy={540} escala={1.04}>
        <Celular>
          <div style={{ position: "absolute", top: 28, left: 0 }}>
            <TelaFila frame={frame} />
          </div>
        </Celular>
      </Posicionar>
      <Toque em={2} x={520} y={900} />
      <Som em={CHEGA} arquivo="enviado" />
      <Diagrama frame={frame} />
      <Legenda
        de={10}
        ate={VOLTA + 10}
        titulo={<>A rede caiu? A fila segura.</>}
        apoio="A gravação fica no aparelho e sobe sozinha quando a conexão voltar."
        style={{ left: 960, width: 820, top: 470 }}
      />
      <Legenda
        de={VOLTA + 10}
        titulo={<>Calculado pelo Praat — sem reimplementação.</>}
        apoio={<>«{S.contaSobrePraat}»</>}
        style={{ left: 960, width: 820, top: 470 }}
        tamanho={54}
      />
    </Fundo>
  );
};
