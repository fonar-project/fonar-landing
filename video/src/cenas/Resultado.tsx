import React from "react";
import { useCurrentFrame } from "remotion";
import { Fundo, Legenda } from "../ui/cena";
import { AppDesktop, AvisoExemplo, Botao, CabecalhoMobile, CartaoMedida, Icone, Pilula } from "../ui/app";
import { PACIENTE, RESULTADO as R, S } from "../dados/textos";
import { cor, fonte, raio, tipo } from "../tema";
import { easeInOut, mix, prog } from "../movimento";

// 7 · Resultado: AVQI e CPPS em destaque, nenhuma medida classificada. E a
// mesma tela se reorganiza da largura compacta para a expandida.
const MUDA_DE = 60;
const MUDA_ATE = 96;

const Cabecalho: React.FC = () => (
  <>
    <AvisoExemplo />
    <div style={{ ...tipo.bodySmall, color: cor.secundario, marginTop: 18 }}>{S.resultadoGravadoEm}</div>
    <div style={{ ...tipo.bodySmall, color: cor.secundario, marginTop: 4 }}>{S.avisoApoioDecisao}</div>
    <div style={{ ...tipo.titleLarge, marginTop: 22 }}>{S.resultadoMedidasTitulo}</div>
    <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
      <Icone nome="sem-referencia" tamanho={24} />
      <div>
        <div style={{ ...tipo.titleMedium }}>{S.statusSemReferencia}</div>
        <div style={{ ...tipo.bodyMedium, color: cor.secundario }}>{S.resultadoPerfilIncompleto}</div>
      </div>
    </div>
  </>
);

const MEDIDAS = (realce: number) => ({
  avqi: <CartaoMedida nome={S.medidaAvqi} descricao={S.medidaAvqiDescricao} valor={R.avqi} destaque realce={realce} />,
  cpps: <CartaoMedida nome={S.medidaCpps} descricao={S.medidaCppsDescricao} valor={R.cpps} unidade="dB" destaque realce={realce} />,
  jitter: <CartaoMedida nome={S.medidaJitter} descricao={S.medidaJitterDescricao} valor={R.jitter} unidade="%" realce={realce} />,
  shimmer: <CartaoMedida nome={S.medidaShimmer} descricao={S.medidaShimmerDescricao} valor={R.shimmer} unidade="%" realce={realce} />,
  hnr: <CartaoMedida nome={S.medidaHnr} descricao={S.medidaHnrDescricao} valor={R.hnr} unidade="dB" realce={realce} />,
  f0: <CartaoMedida nome={S.medidaF0} descricao={S.medidaF0Descricao} valor={R.f0} unidade="Hz" realce={realce} />,
});

const Compacta: React.FC<{ realce: number }> = ({ realce }) => {
  const m = MEDIDAS(realce);
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: cor.creme, fontFamily: fonte, color: cor.chumbo }}>
      <CabecalhoMobile titulo={S.analiseResultadoTitulo} subtitulo={PACIENTE} />
      <div style={{ flex: 1, overflow: "hidden", padding: 16 }}>
        <Cabecalho />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          {m.avqi}
          {m.cpps}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${cor.lavanda}`, padding: 16 }}>
        <Botao rotulo={S.capeVRegistrar} icone="avancar" primaria />
      </div>
    </div>
  );
};

const Expandida: React.FC<{ realce: number }> = ({ realce }) => {
  const m = MEDIDAS(realce);
  return (
    <AppDesktop ativo={0} trilha={[S.pacientesTitulo, PACIENTE, S.analiseResultadoTitulo]} pilula={<Pilula texto={S.situacaoApoioADecisao} />}>
      <div style={{ position: "absolute", inset: "0 0 84px 0", overflow: "hidden" }}>
        <div style={{ width: 1040, margin: "0 auto", paddingTop: 26 }}>
          <Cabecalho />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
            {m.avqi}
            {m.cpps}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16 }}>
            {m.jitter}
            {m.shimmer}
            {m.hnr}
            {m.f0}
          </div>
          <div style={{ marginTop: 16, background: cor.branco, border: `1px solid ${cor.lavanda}`, borderRadius: raio.medio, padding: 16, display: "flex", gap: 40 }}>
            <div style={{ flex: 1 }}>
              <div style={{ ...tipo.titleLarge }}>{S.resultadoQualidadeTitulo}</div>
            </div>
            <div style={{ flex: 1.4 }}>
              <div style={{ ...tipo.titleLarge }}>{S.resultadoEspectrogramaTitulo}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 84,
          borderTop: `1px solid ${cor.lavanda}`,
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          gap: 12,
          background: cor.creme,
        }}
      >
        <div style={{ ...tipo.bodySmall, color: cor.secundario, width: 440 }}>{S.resultadoRodape}</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <Botao rotulo={S.resultadoVerEvolucao} icone="avancar" altura={48} />
          <Botao rotulo={S.resultadoPrepararLaudo} icone="avancar" altura={48} />
          <Botao rotulo={S.capeVRegistrar} icone="avancar" primaria altura={52} />
        </div>
      </div>
    </AppDesktop>
  );
};

export const Resultado: React.FC = () => {
  const frame = useCurrentFrame();
  const p = prog(frame, MUDA_DE, MUDA_ATE, easeInOut);
  const largura = mix(390, 1440, p);
  const altura = mix(844, 900, p);
  const escala = mix(1.0, 0.76, p);
  const expandida = largura >= 1024;
  const realce = prog(frame, 140, 150) * (1 - prog(frame, 196, 215));
  const cx = 1170;
  const cy = 520;

  return (
    <Fundo>
      <div
        style={{
          position: "absolute",
          left: cx - largura / 2,
          top: cy - altura / 2,
          width: largura,
          height: altura,
          scale: String(escala),
          borderRadius: mix(36, 10, p),
          overflow: "hidden",
          boxShadow: "0 40px 90px -40px rgba(23, 19, 31, 0.5), 0 0 0 10px #1E1A26",
        }}
      >
        {expandida ? (
          <div style={{ width: 1440, height: 900, scale: String(largura / 1440), transformOrigin: "0 0", opacity: prog(frame, MUDA_ATE - 18, MUDA_ATE - 6) }}>
            <Expandida realce={realce} />
          </div>
        ) : (
          <Compacta realce={realce} />
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: cx - 160,
          width: 320,
          top: cy + (altura * escala) / 2 + 28,
          textAlign: "center",
          fontSize: 22,
          fontWeight: 700,
          color: cor.secundario,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Math.round(largura)} px · {largura < 600 ? "compacta" : largura < 1024 ? "média" : "expandida"}
      </div>
      <Legenda
        de={8}
        ate={124}
        titulo={<>A mesma tela, do celular ao notebook.</>}
        apoio="O layout se adapta pela largura da tela, não pelo sistema: Android e Windows têm as mesmas funções."
        style={{ left: 90, width: 470, top: 330 }}
        tamanho={56}
      />
      <Legenda
        de={124}
        titulo={<>Nenhuma medida classificada sem referência.</>}
        apoio="Classificação só com faixa de referência validada, com fonte. Até lá, o app mostra o valor — e diz por que não classifica."
        style={{ left: 90, width: 470, top: 300 }}
        tamanho={56}
      />
    </Fundo>
  );
};
