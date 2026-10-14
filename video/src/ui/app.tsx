// Peças da interface do FONAR recriadas em React, com os tokens do app.
// Referência visual: as telas renderizadas a partir do código do app
// (flutter test + goldens) a 1440×900 e 390×844.
import React from "react";
import { cor, esp, raio, tipo, fonte } from "../tema";
import { S } from "../dados/textos";
import { ICONES, NomeIcone } from "./icones.gerado";

export const Icone: React.FC<{ nome: NomeIcone; tamanho?: number; cor?: string; style?: React.CSSProperties }> = ({
  nome,
  tamanho = 24,
  cor: c = cor.roxo,
  style,
}) => (
  <svg
    viewBox="0 0 24 24"
    width={tamanho}
    height={tamanho}
    style={{ color: c, flex: "none", ...style }}
    fill="none"
    dangerouslySetInnerHTML={{ __html: ICONES[nome] }}
  />
);

export const Botao: React.FC<{
  rotulo: string;
  primaria?: boolean;
  icone?: NomeIcone;
  pressionado?: boolean;
  desabilitado?: boolean;
  largura?: number | string;
  altura?: number;
  style?: React.CSSProperties;
}> = ({ rotulo, primaria = false, icone, pressionado, desabilitado, largura, altura = 52, style }) => {
  const fundo = desabilitado
    ? cor.lavandaSuave
    : primaria
      ? pressionado
        ? cor.roxoPressionado
        : cor.roxo
      : pressionado
        ? cor.roxoVeu
        : "transparent";
  const texto = desabilitado ? cor.secundario : primaria ? cor.branco : cor.roxo;
  return (
    <div
      style={{
        height: altura,
        width: largura,
        boxSizing: "border-box",
        padding: `0 ${esp.lg}px`,
        borderRadius: raio.pequeno,
        background: fundo,
        border: primaria || desabilitado ? `1.5px solid ${desabilitado ? cor.lavanda : fundo}` : `1.5px solid ${cor.roxo}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: esp.sm,
        color: texto,
        ...tipo.labelLarge,
        scale: pressionado ? "0.985" : "1",
        ...style,
      }}
    >
      {icone ? <Icone nome={icone} tamanho={20} cor={texto} /> : null}
      {rotulo}
    </div>
  );
};

export const Pilula: React.FC<{ texto: string; style?: React.CSSProperties }> = ({ texto, style }) => (
  <div
    style={{
      border: `1px solid ${cor.lavanda}`,
      borderRadius: raio.pilula,
      padding: "6px 14px",
      fontSize: 13,
      fontWeight: 600,
      color: cor.chumbo,
      letterSpacing: 0.2,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {texto}
  </div>
);

export const IndicadorConexao: React.FC<{ online: boolean; sobreRoxo?: boolean }> = ({ online, sobreRoxo }) => {
  const c = sobreRoxo ? cor.branco : cor.chumbo;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        border: `1px solid ${sobreRoxo ? "rgba(255,255,255,0.5)" : cor.lavanda}`,
        background: sobreRoxo ? "transparent" : online ? "transparent" : cor.lavandaSuave,
        borderRadius: raio.pilula,
        padding: "5px 14px 5px 12px",
        fontSize: 15,
        fontWeight: sobreRoxo ? 700 : 600,
        color: c,
        whiteSpace: "nowrap",
      }}
    >
      {online ? (
        <span style={{ width: 6, height: 6, borderRadius: 3, background: sobreRoxo ? cor.branco : cor.roxo }} />
      ) : (
        <Icone nome="estado-sem-conexao" tamanho={16} cor={c} />
      )}
      {online ? S.conexaoOnline : S.conexaoOffline}
    </div>
  );
};

// ------------------------------------------------------------- desktop --

const NAV = [S.navPacientes, S.navNovaAvaliacao, S.navHistorico, S.navFila, S.navConta];

export const Lateral: React.FC<{ ativo: number; online?: boolean }> = ({ ativo, online = true }) => (
  <div
    style={{
      width: 222,
      height: "100%",
      background: cor.roxo,
      color: cor.branco,
      display: "flex",
      flexDirection: "column",
      flex: "none",
    }}
  >
    <div style={{ padding: "22px 22px 20px", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 0.6 }}>{S.appTitle}</div>
      <div style={{ fontSize: 15, marginTop: 2, color: "rgba(255,255,255,0.82)" }}>{S.loginSubtitulo}</div>
    </div>
    <div style={{ paddingTop: 12 }}>
      {NAV.map((n, i) => (
        <div
          key={n}
          style={{
            height: 48,
            display: "flex",
            alignItems: "center",
            paddingLeft: 22,
            fontSize: 16,
            fontWeight: i === ativo ? 700 : 400,
            background: i === ativo ? "rgba(255,255,255,0.13)" : "transparent",
            borderLeft: i === ativo ? `3px solid ${cor.lavanda}` : "3px solid transparent",
            marginLeft: 0,
          }}
        >
          <span style={{ marginLeft: -3 }}>{n}</span>
        </div>
      ))}
    </div>
    <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.14)", padding: "14px 22px 20px" }}>
      <div style={{ display: "inline-flex" }}>
        <IndicadorConexao online={online} sobreRoxo />
      </div>
      <div style={{ marginTop: 14, fontSize: 14, fontWeight: 700 }}>fono@exemplo.com</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.5 }}>{S.contaPerfilIncompleto}</div>
    </div>
  </div>
);

export const CabecalhoDesktop: React.FC<{ trilha: string[]; pilula?: React.ReactNode }> = ({ trilha, pilula }) => (
  <div
    style={{
      height: 62,
      flex: "none",
      borderBottom: `1px solid ${cor.lavanda}`,
      display: "flex",
      alignItems: "center",
      padding: "0 30px",
      fontSize: 14,
      color: cor.chumbo,
    }}
  >
    {/* US25: o voltar também no desktop (app_cabecalho_de_tarefa.dart, _BotaoVoltar) */}
    <div
      style={{
        width: 48,
        height: 48,
        marginLeft: -12,
        marginRight: esp.xxs,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "none",
      }}
    >
      <Icone nome="voltar" tamanho={24} />
    </div>
    {trilha.map((t, i) => (
      <React.Fragment key={t}>
        {i > 0 ? <span style={{ margin: "0 6px", color: cor.secundario }}>/</span> : null}
        <span
          style={
            i === trilha.length - 1
              ? { fontWeight: 700 }
              : { color: cor.secundario, textDecoration: "underline", textUnderlineOffset: 3 }
          }
        >
          {t}
        </span>
      </React.Fragment>
    ))}
    <div style={{ marginLeft: "auto" }}>{pilula}</div>
  </div>
);

/** Moldura do app no desktop: lateral + cabeçalho + conteúdo. 1440×900. */
export const AppDesktop: React.FC<{
  ativo: number;
  trilha: string[];
  pilula?: React.ReactNode;
  online?: boolean;
  children: React.ReactNode;
}> = ({ ativo, trilha, pilula, online, children }) => (
  <div
    style={{
      width: 1440,
      height: 900,
      display: "flex",
      background: cor.creme,
      fontFamily: fonte,
      color: cor.chumbo,
      overflow: "hidden",
    }}
  >
    <Lateral ativo={ativo} online={online} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <CabecalhoDesktop trilha={trilha} pilula={pilula} />
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>{children}</div>
    </div>
  </div>
);

// -------------------------------------------------------------- celular --

export const CabecalhoMobile: React.FC<{
  titulo: string;
  subtitulo?: string;
  voltar?: boolean;
  online?: boolean;
  direita?: React.ReactNode;
}> = ({ titulo, subtitulo, voltar = true, online = true, direita }) => (
  <div
    style={{
      height: 64,
      flex: "none",
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      gap: 12,
      borderBottom: `1px solid ${cor.lavanda}`,
    }}
  >
    {voltar ? <Icone nome="voltar" tamanho={24} /> : null}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ ...tipo.titleLarge, color: cor.chumbo, whiteSpace: "nowrap" }}>{titulo}</div>
      {subtitulo ? <div style={{ fontSize: 14, color: cor.secundario, marginTop: -2 }}>{subtitulo}</div> : null}
    </div>
    {direita ?? <IndicadorConexao online={online} />}
  </div>
);

/** Tela do app no celular, 390×844 (alvo de design do app). */
export const AppCelular: React.FC<{ children: React.ReactNode; fundo?: string }> = ({ children, fundo = cor.creme }) => (
  <div
    style={{
      width: 390,
      height: 844,
      display: "flex",
      flexDirection: "column",
      background: fundo,
      fontFamily: fonte,
      color: cor.chumbo,
      overflow: "hidden",
      position: "relative",
    }}
  >
    {children}
  </div>
);

// --------------------------------------------------- componentes de tela --

export const Etapas: React.FC<{ atual: number; concluidas?: number; compacta?: boolean }> = ({
  atual,
  concluidas = atual,
  compacta,
}) => {
  const nomes = [S.etapaRuidoCurta, S.tarefaVogalCurta, S.tarefaFalaCurta];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: compacta ? 8 : 10 }}>
      {nomes.map((n, i) => {
        const feita = i < concluidas;
        const ativa = i === atual;
        const situacao = feita ? S.etapaConcluida : ativa ? S.etapaEmAndamento : S.etapaPendente;
        return (
          <React.Fragment key={n}>
            {i > 0 ? (
              <div style={{ width: compacta ? 14 : 48, height: 1.5, background: cor.lavanda, margin: compacta ? 0 : "0 4px" }} />
            ) : null}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  boxSizing: "border-box",
                  background: ativa || feita ? cor.roxo : "transparent",
                  border: ativa || feita ? "none" : `1.5px solid ${cor.lavanda}`,
                  color: ativa || feita ? cor.branco : cor.secundario,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {feita && !ativa ? <Icone nome="confirmacao" tamanho={16} cor={cor.branco} /> : i + 1}
              </div>
              <div>
                <div style={{ fontSize: compacta ? 15 : 14, fontWeight: 700, color: ativa ? cor.chumbo : cor.secundario }}>{n}</div>
                {compacta ? null : <div style={{ fontSize: 12, color: cor.secundario }}>{situacao}</div>}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** MedidorDeNivel (captura/presentation/widgets/medidor_de_nivel.dart). */
export const Medidor: React.FC<{ dbfs: number | null; ambiente?: boolean; largura?: number }> = ({
  dbfs,
  ambiente,
  largura = 520,
}) => {
  const zona =
    dbfs === null || dbfs <= -90
      ? "semSinal"
      : dbfs >= -1
        ? "saturando"
        : dbfs >= -12
          ? "alto"
          : dbfs < -40
            ? "baixo"
            : "adequado";
  const neutro = ambiente && zona !== "semSinal" && zona !== "saturando";
  const rotulo = neutro
    ? S.medidorAmbiente
    : { semSinal: S.medidorSemSinal, baixo: S.medidorBaixo, adequado: S.medidorAdequado, alto: S.medidorAlto, saturando: S.medidorSaturando }[zona];
  const barra = neutro
    ? cor.roxo
    : { semSinal: cor.lavanda, baixo: cor.chumbo, adequado: cor.sucesso, alto: cor.atencao, saturando: cor.erro }[zona];
  const fracao = dbfs === null ? 0 : Math.max(0, Math.min(1, (dbfs + 60) / 60));
  const textoCor = zona === "saturando" ? cor.erro : cor.chumbo;
  const numero = dbfs === null || !isFinite(dbfs) ? "— dBFS" : `${dbfs < -0.5 ? "−" : ""}${Math.round(Math.abs(dbfs))} dBFS`;
  return (
    <div style={{ width: largura }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ ...tipo.labelSmall, color: textoCor }}>{rotulo}</span>
        <span style={{ ...tipo.medidaCompacta, color: textoCor }}>{numero}</span>
      </div>
      <div style={{ marginTop: esp.xs, height: 16, borderRadius: raio.pilula, background: cor.lavandaSuave, overflow: "hidden" }}>
        <div style={{ width: `${fracao * 100}%`, height: "100%", background: barra }} />
      </div>
    </div>
  );
};

export const AvisoExemplo: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ display: "flex", gap: 14, ...style }}>
    <Icone nome="informacao" tamanho={26} />
    <div>
      <div style={{ ...tipo.titleMedium, color: cor.chumbo }}>{S.resultadoExemploTitulo}</div>
      <div style={{ ...tipo.bodyMedium, color: cor.secundario }}>{S.resultadoExemploTexto}</div>
    </div>
  </div>
);

export const ChipSemReferencia: React.FC<{ destaque?: number }> = ({ destaque = 0 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px",
      borderRadius: raio.pequeno,
      background: "rgba(219, 210, 224, 0.5)",
      outline: destaque > 0 ? `2px solid rgba(64, 8, 94, ${0.7 * destaque})` : "none",
      outlineOffset: 2,
      fontSize: 14,
      fontWeight: 600,
      color: cor.chumbo,
      letterSpacing: 0.3,
    }}
  >
    <Icone nome="sem-referencia" tamanho={14} cor={cor.chumbo} />
    {S.statusSemReferencia}
  </div>
);

export const CartaoMedida: React.FC<{
  nome: string;
  descricao: string;
  valor: string;
  unidade?: string;
  destaque?: boolean;
  realce?: number;
  style?: React.CSSProperties;
}> = ({ nome, descricao, valor, unidade, destaque, realce, style }) => (
  <div
    style={{
      background: cor.branco,
      border: `1px solid ${cor.lavanda}`,
      borderRadius: raio.medio,
      padding: destaque ? "24px 24px 24px" : "18px 16px 16px",
      boxSizing: "border-box",
      ...style,
    }}
  >
    <div style={{ ...tipo.titleMedium, color: cor.chumbo }}>{nome}</div>
    <div style={{ fontSize: 14, color: cor.secundario, marginTop: 2 }}>{descricao}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: destaque ? "14px 0 12px" : "10px 0 10px" }}>
      <span style={{ ...(destaque ? tipo.medidaDestaque : tipo.medida), color: cor.chumbo }}>{valor}</span>
      {unidade ? <span style={{ fontSize: 15, color: cor.chumbo }}>{unidade}</span> : null}
    </div>
    <ChipSemReferencia destaque={realce} />
  </div>
);

export const Spinner: React.FC<{ frame: number; tamanho?: number; cor?: string }> = ({ frame, tamanho = 28, cor: c = cor.roxo }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 28 28" style={{ rotate: `${(frame * 12) % 360}deg` }}>
    <circle cx="14" cy="14" r="11.5" stroke={c} strokeWidth="3" fill="none" strokeDasharray="48 100" strokeLinecap="round" />
  </svg>
);
