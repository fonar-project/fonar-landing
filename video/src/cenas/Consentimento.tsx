import React from "react";
import { useCurrentFrame } from "remotion";
import { Fundo, Legenda, Posicionar, Som, Toque } from "../ui/cena";
import { Celular, CELULAR_ALTURA, CELULAR_LARGURA } from "../ui/aparelhos";
import { AppCelular, Botao, CabecalhoMobile, Icone } from "../ui/app";
import { PACIENTE, S } from "../dados/textos";
import { cor, raio, tipo } from "../tema";
import { entra, mix, prog } from "../movimento";

// 3 · Paciente → consentimento → a gravação libera.
const Perfil: React.FC = () => (
  <AppCelular>
    <CabecalhoMobile titulo={S.pacienteDetalheTitulo} />
    <div style={{ padding: 16 }}>
      <div style={{ ...tipo.headlineSmall }}>{PACIENTE}</div>
      <div style={{ ...tipo.bodyLarge, marginTop: 6 }}>{S.perfilQueixa}</div>
      <div style={{ ...tipo.bodyMedium, color: cor.secundario, marginTop: 4 }}>Nascimento: não informado</div>
      <div style={{ ...tipo.bodyMedium, color: cor.secundario }}>Sexo: não informado</div>
      <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
        <Icone nome="alerta" tamanho={24} cor={cor.chumbo} />
        <div>
          <div style={{ ...tipo.titleMedium }}>{S.consentimentoNaoRegistrado}</div>
          <div style={{ ...tipo.bodyMedium, color: cor.secundario }}>{S.consentimentoNaoRegistradoTexto}</div>
        </div>
      </div>
      <Botao rotulo={S.perfilRegistrarConsentimento} primaria style={{ marginTop: 18 }} />
      <Botao rotulo={S.perfilNovaGravacao} icone="gravar" desabilitado style={{ marginTop: 24 }} />
      <div style={{ ...tipo.bodySmall, color: cor.secundario, marginTop: 8 }}>{S.perfilGravacaoBloqueada}</div>
    </div>
  </AppCelular>
);

const Radio: React.FC<{ rotulo: string; marcado: boolean }> = ({ rotulo, marcado }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, height: 44 }}>
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        border: `2px solid ${marcado ? cor.roxo : cor.chumbo}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      {marcado ? <div style={{ width: 11, height: 11, borderRadius: 6, background: cor.roxo }} /> : null}
    </div>
    <span style={{ ...tipo.bodyLarge }}>{rotulo}</span>
  </div>
);

const Termo: React.FC<{ frame: number }> = ({ frame }) => {
  const rolagem = mix(0, -330, prog(frame, 20, 52));
  const marcado = frame >= 60;
  const registrando = frame >= 76;
  return (
    <AppCelular>
      <CabecalhoMobile titulo={S.consentimentoTitulo} />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div style={{ padding: 16, translate: `0px ${rolagem}px` }}>
          <div style={{ ...tipo.titleMedium }}>Paciente: {PACIENTE}</div>
          <div style={{ ...tipo.bodyMedium, color: cor.secundario, marginTop: 8 }}>{S.consentimentoMostreAoPaciente}</div>
          <div style={{ marginTop: 16, background: cor.branco, border: `1px solid ${cor.lavanda}`, borderRadius: raio.medio, padding: 16 }}>
            <div style={{ ...tipo.titleMedium }}>{S.consentimentoTermoTitulo}</div>
            {S.consentimentoTermoItens.map((t) => (
              <div key={t} style={{ display: "flex", gap: 10, marginTop: 10, ...tipo.bodyMedium }}>
                <span>•</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ ...tipo.titleMedium, marginTop: 20 }}>{S.consentimentoCampoQuem}</div>
          <Radio rotulo={S.consentimentoQuemPaciente} marcado />
          <Radio rotulo={S.consentimentoQuemResponsavel} marcado={false} />
          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            <div
              style={{
                width: 22,
                height: 22,
                flex: "none",
                borderRadius: 4,
                border: `2px solid ${marcado ? cor.roxo : cor.chumbo}`,
                background: marcado ? cor.roxo : "transparent",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              {marcado ? <Icone nome="confirmacao" tamanho={16} cor={cor.branco} /> : null}
            </div>
            <span style={{ ...tipo.bodyLarge }}>{S.consentimentoConcordancia}</span>
          </div>
          <Botao
            rotulo={registrando ? S.consentimentoRegistrando : S.consentimentoRegistrar}
            primaria
            pressionado={frame >= 74 && frame < 78}
            style={{ marginTop: 22 }}
          />
        </div>
      </div>
    </AppCelular>
  );
};

const Registrado: React.FC<{ frame: number }> = ({ frame }) => (
  <AppCelular>
    <CabecalhoMobile titulo={S.consentimentoTitulo} />
    <div style={{ padding: 16 }}>
      <div style={{ ...tipo.titleMedium, ...entra(frame, 0) }}>Paciente: {PACIENTE}</div>
      <div style={{ display: "flex", gap: 14, marginTop: 22, ...entra(frame, 3) }}>
        <Icone nome="confirmacao" tamanho={26} />
        <div>
          <div style={{ ...tipo.titleMedium }}>{S.consentimentoRegistrado}</div>
          <div style={{ ...tipo.bodyMedium, color: cor.secundario }}>{S.consentimentoRegistradoTexto}</div>
        </div>
      </div>
      <div style={{ marginTop: 24, ...entra(frame, 8) }}>
        <Botao rotulo={S.consentimentoIniciarGravacao} icone="gravar" primaria />
      </div>
    </div>
  </AppCelular>
);

export const Consentimento: React.FC = () => {
  const frame = useCurrentFrame();
  const tela = frame < 62 ? 0 : frame < 150 ? 1 : 2;
  return (
    <Fundo>
      <Posicionar w={CELULAR_LARGURA} h={CELULAR_ALTURA} cx={600} cy={540} escala={1.04}>
        <Celular>
          <div style={{ position: "absolute", top: 28, left: 0 }}>
            {tela === 0 ? <Perfil /> : null}
            {tela === 1 ? <Termo frame={frame - 62} /> : null}
            {tela === 2 ? <Registrado frame={frame - 150} /> : null}
          </div>
          <Toque em={50} x={195} y={28 + 64 + 16 + 258} claro />
          <Toque em={62 + 74} x={195} y={700} claro />
        </Celular>
      </Posicionar>
      <Som em={50} arquivo="clique" />
      <Som em={136} arquivo="clique" />
      <Legenda
        de={12}
        titulo={<>Sem consentimento,<br />a gravação não abre.</>}
        apoio="O bloqueio está no roteador do app — não é um aviso que dá para ignorar."
        style={{ left: 980, width: 780, top: 380 }}
      />
    </Fundo>
  );
};
