import React from "react";
import { useCurrentFrame } from "remotion";
import { Fundo, Legenda, Posicionar, Som, Toque } from "../ui/cena";
import { Notebook } from "../ui/aparelhos";
import { AppDesktop, Botao, Icone, Pilula, Spinner } from "../ui/app";
import { PACIENTE, RESULTADO as R, S } from "../dados/textos";
import { cor, fonte, raio, tipo } from "../tema";
import { easeInOut, entra, mix, prog } from "../movimento";

// 10 · Laudo: a conferência antes de gerar e o PDF pronto para o prontuário.
// Conclusão e CAPE-V aparecem desfocadas: são do profissional, não do vídeo.
const GERA = 62;
const PRONTO = 90;

const Borrado: React.FC<{ linhas: number[]; altura?: number }> = ({ linhas, altura = 9 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: altura * 0.8 }}>
    {linhas.map((l, i) => (
      <div key={i} style={{ width: `${l}%`, height: altura, borderRadius: altura, background: "#D9D3DE", filter: "blur(1.5px)" }} />
    ))}
  </div>
);

export const PaginaA4: React.FC<{ largura: number }> = ({ largura }) => {
  const k = largura / 595;
  const medidas: [string, string][] = [
    [S.medidaAvqi, R.avqi],
    [S.medidaCpps, `${R.cpps} dB`],
    [S.medidaJitter, `${R.jitter} %`],
    [S.medidaShimmer, `${R.shimmer} %`],
    [S.medidaHnr, `${R.hnr} dB`],
    [S.medidaF0, `${R.f0} Hz`],
  ];
  return (
    <div style={{ width: 595, height: 842, scale: String(k), transformOrigin: "0 0", background: cor.branco, fontFamily: fonte, color: "#222", padding: 44, boxSizing: "border-box", position: "relative" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: cor.roxo }}>{S.laudoDocTitulo}</div>
      <div style={{ marginTop: 10, padding: "6px 10px", border: "1.5px solid #222", fontSize: 11, fontWeight: 800, letterSpacing: 0.5 }}>{S.laudoDocExemplo}</div>
      <div style={{ marginTop: 16, fontSize: 13, fontWeight: 800 }}>{S.laudoDocIdentificacao}</div>
      <div style={{ fontSize: 11, lineHeight: 1.7, marginTop: 4 }}>
        Paciente: {PACIENTE}
        <br />
        Data de nascimento: Não informado · Sexo: Não informado
        <br />
        Data da gravação: 23 jul 2026
      </div>
      <div style={{ marginTop: 14, fontSize: 13, fontWeight: 800 }}>{S.laudoDocMedidas}</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginTop: 6 }}>
        <thead>
          <tr>
            {S.laudoDocColunas.map((c) => (
              <th key={c} style={{ textAlign: "left", borderBottom: "1px solid #222", padding: "4px 0" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {medidas.map(([m, v]) => (
            <tr key={m}>
              <td style={{ padding: "4px 0", borderBottom: "1px solid #ddd" }}>{m}</td>
              <td style={{ padding: "4px 0", borderBottom: "1px solid #ddd", fontWeight: 700 }}>{v}</td>
              <td style={{ padding: "4px 0", borderBottom: "1px solid #ddd" }}>{S.laudoDocSemFaixa}</td>
              <td style={{ padding: "4px 0", borderBottom: "1px solid #ddd" }}>{S.laudoDocSemFaixa}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 16, fontSize: 13, fontWeight: 800 }}>{S.laudoDocCapeV}</div>
      <div style={{ marginTop: 8 }}>
        <Borrado linhas={[90, 84, 88, 70]} altura={7} />
      </div>
      <div style={{ marginTop: 16, fontSize: 13, fontWeight: 800 }}>{S.laudoDocConclusao}</div>
      <div style={{ marginTop: 8 }}>
        <Borrado linhas={[96, 92, 98, 60]} altura={7} />
      </div>
      <div style={{ position: "absolute", left: 44, right: 44, bottom: 30, fontSize: 9, lineHeight: 1.5, color: "#555", borderTop: "1px solid #ccc", paddingTop: 8 }}>
        {S.laudoDocRodape}
        <span style={{ float: "right" }}>Página 1 de 1</span>
      </div>
    </div>
  );
};

const Tela: React.FC<{ frame: number }> = ({ frame }) => {
  const gerando = frame >= GERA && frame < PRONTO;
  const pronto = frame >= PRONTO;
  return (
    <AppDesktop ativo={0} trilha={[S.pacientesTitulo, PACIENTE, S.laudoTitulo]} pilula={<Pilula texto={S.situacaoLaudo} />}>
      <div style={{ position: "absolute", inset: 0, display: "flex" }}>
        <div style={{ flex: 1, background: cor.lavanda, display: "flex", justifyContent: "center", paddingTop: 30 }}>
          <div style={{ boxShadow: "0 10px 30px -10px rgba(0,0,0,0.25)", width: 560, height: 793, overflow: "hidden" }}>
            <PaginaA4 largura={560} />
          </div>
        </div>
        <div style={{ width: 460, padding: "28px 32px", boxSizing: "border-box" }}>
          <div style={{ ...tipo.bodySmall, color: cor.secundario }}>{S.avisoApoioDecisao}</div>
          <div style={{ ...tipo.titleLarge, marginTop: 18 }}>{S.laudoConferenciaTitulo}</div>
          {S.laudoItens.map((it, i) => (
            <div key={it} style={{ display: "flex", gap: 12, marginTop: 12, ...entra(frame, 4 + i * 4) }}>
              <Icone nome="confirmacao" tamanho={20} style={{ marginTop: 2 }} />
              <div>
                <div style={{ ...tipo.titleMedium }}>{it}</div>
                <div style={{ fontSize: 14, color: cor.secundario }}>{S.laudoConferenciaOk}</div>
              </div>
            </div>
          ))}
          <div style={{ ...tipo.labelMedium, marginTop: 22 }}>{S.laudoCampoConclusao}</div>
          <div style={{ marginTop: 8, border: `1.5px solid ${cor.chumbo}`, borderRadius: raio.pequeno, padding: 14, background: cor.branco }}>
            <Borrado linhas={[95, 90, 97, 55]} />
          </div>
          <div style={{ ...tipo.bodySmall, color: cor.secundario, marginTop: 6 }}>{S.laudoConclusaoApoio}</div>
          <div style={{ marginTop: 18 }}>
            {pronto ? (
              <div style={entra(frame, PRONTO)}>
                <div style={{ display: "flex", gap: 10, ...tipo.titleMedium }}>
                  <Icone nome="confirmacao" tamanho={20} />
                  {S.laudoGeradoEm}
                </div>
                <Botao rotulo={S.laudoCompartilhar} primaria style={{ marginTop: 12 }} />
              </div>
            ) : (
              <Botao
                rotulo={gerando ? S.laudoGerando : S.laudoGerar}
                primaria
                pressionado={frame >= GERA - 4 && frame < GERA}
              />
            )}
            {gerando ? (
              <div style={{ position: "absolute", marginTop: -38, marginLeft: 120 }}>
                <Spinner frame={frame} tamanho={22} cor={cor.branco} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AppDesktop>
  );
};

export const Laudo: React.FC = () => {
  const frame = useCurrentFrame();
  const sai = prog(frame, PRONTO + 12, PRONTO + 40, easeInOut);
  return (
    <Fundo>
      <Posicionar w={1476} h={1000} cx={1180} cy={520} escala={0.72} style={{ opacity: 1 - 0.65 * sai }}>
        <Notebook>
          <Tela frame={frame} />
        </Notebook>
        <Toque em={GERA - 4} x={18 + 1440 - 230} y={18 + 34 + 62 + 795} />
      </Posicionar>
      <Som em={GERA - 4} arquivo="clique" />
      {frame >= PRONTO + 12 ? (
        <div
          style={{
            position: "absolute",
            left: mix(700, 1180, sai),
            top: mix(230, 140, sai),
            boxShadow: "0 40px 80px -30px rgba(23, 19, 31, 0.5)",
            opacity: prog(frame, PRONTO + 12, PRONTO + 20),
          }}
        >
          <div style={{ width: mix(400, 540, sai), height: mix(566, 764, sai), overflow: "hidden" }}>
            <PaginaA4 largura={mix(400, 540, sai)} />
          </div>
          <div style={{ marginTop: 18, display: "inline-flex", gap: 10, alignItems: "center", padding: "10px 18px", borderRadius: 999, background: cor.branco, border: `1.5px solid ${cor.lavanda}`, fontSize: 22, fontWeight: 700, color: cor.chumbo, opacity: prog(frame, PRONTO + 36, PRONTO + 46) }}>
            {S.laudoNomeDoArquivo}
          </div>
        </div>
      ) : null}
      <Legenda
        de={6}
        titulo={<>O laudo é do profissional.</>}
        apoio={<>«{S.laudoConclusaoApoio}»</>}
        style={{ left: 110, width: 520, top: 360 }}
        tamanho={56}
      />
    </Fundo>
  );
};
