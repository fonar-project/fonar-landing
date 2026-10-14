import React from "react";
import { useCurrentFrame } from "remotion";
import { Fundo, Legenda, Posicionar, Som, Toque } from "../ui/cena";
import { Celular, Notebook, CELULAR_ALTURA, CELULAR_LARGURA } from "../ui/aparelhos";
import { AppCelular, AppDesktop, AvisoExemplo, Botao, Icone } from "../ui/app";
import { EVOLUCAO_AVQI as E, PACIENTE, S, fmt } from "../dados/textos";
import { cor, raio, tipo } from "../tema";
import { easeInOut, mix, prog } from "../movimento";

// 9 · Evolução entre sessões (sem leitura de melhora) e o modo paciente.
const VIRA = 92;

const Grafico: React.FC<{ w: number; h: number; p: number; min?: number; max?: number; rotulos?: boolean }> = ({ w, h, p, min = 2.5, max = 5, rotulos = true }) => {
  const pad = 56;
  const x = (i: number) => pad + 30 + (i / (E.length - 1)) * (w - pad - 60);
  const y = (v: number) => 10 + (1 - (v - min) / (max - min)) * (h - 50);
  const marcas = [];
  for (let v = min; v <= max + 0.001; v += 0.5) marcas.push(v);
  const n = p * (E.length - 1);
  const pts = E.slice(0, Math.floor(n) + 1).map((e, i) => [x(i), y(e.valor)] as const);
  if (n < E.length - 1 && Math.floor(n) + 1 < E.length) {
    const i = Math.floor(n);
    const f = n - i;
    pts.push([mix(x(i), x(i + 1), f), mix(y(E[i].valor), y(E[i + 1].valor), f)]);
  }
  return (
    <svg width={w} height={h}>
      {marcas.map((v) => (
        <g key={v}>
          <line x1={pad} x2={w} y1={y(v)} y2={y(v)} stroke={cor.lavanda} strokeWidth={1} />
          <text x={pad - 10} y={y(v) + 5} textAnchor="end" fontSize={14} fill={cor.secundario}>
            {fmt(v)}
          </text>
        </g>
      ))}
      <line x1={pad} x2={pad} y1={0} y2={h - 40} stroke={cor.lavanda} />
      <polyline points={pts.map(([a, b]) => `${a},${b}`).join(" ")} fill="none" stroke={cor.roxo} strokeWidth={3} />
      {E.map((e, i) =>
        i <= n + 0.001 ? <circle key={e.data} cx={x(i)} cy={y(e.valor)} r={6} fill={cor.roxo} /> : null,
      )}
      {rotulos
        ? E.map((e, i) => (
            <text key={e.curta} x={x(i)} y={h - 12} textAnchor="middle" fontSize={14} fill={cor.secundario}>
              {e.curta}
            </text>
          ))
        : null}
    </svg>
  );
};

const TelaDesktop: React.FC<{ frame: number }> = ({ frame }) => {
  const p = prog(frame, 6, 50);
  return (
    <AppDesktop
      ativo={0}
      trilha={[S.pacientesTitulo, PACIENTE, S.evolucaoTitulo]}
      pilula={<Botao rotulo={S.evolucaoMostrarAoPaciente} icone="virar-para-paciente" altura={48} pressionado={frame >= VIRA - 12 && frame < VIRA - 6} style={{ marginRight: 340 }} />}
    >
      <div style={{ position: "absolute", inset: 0, display: "flex", gap: 32, padding: "26px 32px 0" }}>
        <div style={{ width: 752 }}>
          <AvisoExemplo />
          <div style={{ ...tipo.bodySmall, color: cor.secundario, marginTop: 18 }}>{S.evolucaoSessoes}</div>
          <div style={{ ...tipo.bodySmall, color: cor.secundario, marginTop: 8 }}>{S.avisoApoioDecisao}</div>
          <div style={{ ...tipo.labelMedium, marginTop: 20 }}>{S.evolucaoMedidaNoGrafico}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {["AVQI", "CPPS", "Jitter", "Shimmer", "HNR", "f0"].map((m, i) => (
              <div
                key={m}
                style={{
                  height: 46,
                  padding: "0 16px",
                  borderRadius: 999,
                  border: `1.5px solid ${cor.roxo}`,
                  background: i === 0 ? cor.roxo : "transparent",
                  color: i === 0 ? cor.branco : cor.chumbo,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  ...tipo.labelLarge,
                }}
              >
                {i === 0 ? <Icone nome="confirmacao" tamanho={18} cor={cor.branco} /> : <div style={{ width: 16, height: 16, borderRadius: 8, border: `1.5px solid ${cor.chumbo}` }} />}
                {m}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22, background: cor.branco, border: `1px solid ${cor.lavanda}`, borderRadius: raio.medio, padding: 16 }}>
            <div style={{ ...tipo.titleLarge }}>{S.medidaAvqi}</div>
            <div style={{ ...tipo.bodySmall, color: cor.secundario }}>{S.medidaAvqiDescricao}</div>
            <div style={{ display: "flex", gap: 32, marginTop: 14 }}>
              {[
                [S.evolucaoAnterior, E[2]],
                [S.evolucaoMaisRecente, E[3]],
              ].map(([r, e]) => {
                const v = e as (typeof E)[number];
                return (
                  <div key={r as string}>
                    <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, color: cor.secundario }}>{r as string}</div>
                    <div style={{ ...tipo.medidaCompacta }}>{fmt(v.valor)}</div>
                    <div style={{ fontSize: 14, color: cor.secundario }}>{v.data}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ ...tipo.bodySmall, color: cor.secundario, marginTop: 12 }}>{S.evolucaoSemLimiar}</div>
            <div style={{ marginTop: 10 }}>
              <Grafico w={716} h={260} p={p} min={3} max={5} />
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...tipo.titleLarge }}>{S.evolucaoSessoesTitulo}</div>
          {[...E].reverse().map((e) => (
            <div key={e.data} style={{ display: "flex", alignItems: "center", gap: 16, height: 47, borderBottom: `1px solid ${cor.lavanda}`, ...tipo.bodyMedium }}>
              <span>{e.data}</span>
              <span style={{ fontWeight: 800 }}>{fmt(e.valor)}</span>
              <Icone nome="avancar" tamanho={20} style={{ marginLeft: "auto" }} />
            </div>
          ))}
        </div>
      </div>
    </AppDesktop>
  );
};

const ModoPaciente: React.FC<{ frame: number }> = ({ frame }) => (
  <AppCelular>
    <div style={{ padding: 16 }}>
      <Botao rotulo={S.modoPacienteSair} icone="voltar" altura={48} largura={286} />
      <AvisoExemplo style={{ marginTop: 22 }} />
      <div style={{ ...tipo.headlineSmall, marginTop: 22 }}>{S.modoPacienteTitulo}</div>
      <div style={{ ...tipo.titleLarge, marginTop: 8 }}>
        {S.medidaAvqi} — {S.medidaAvqiDescricao}
      </div>
      <div style={{ ...tipo.bodyLarge, color: cor.secundario, marginTop: 8 }}>{S.modoPacienteExplicacao}</div>
      <div style={{ marginTop: 18 }}>
        <Grafico w={358} h={360} p={prog(frame, 6, 40)} />
      </div>
    </div>
  </AppCelular>
);

export const Evolucao: React.FC = () => {
  const frame = useCurrentFrame();
  const troca = prog(frame, VIRA, VIRA + 16, easeInOut);
  const giro = prog(frame, VIRA + 8, VIRA + 34, easeInOut);
  return (
    <Fundo>
      {troca < 1 ? (
        <Posicionar w={1476} h={1000} cx={1180} cy={520} escala={0.72} style={{ opacity: 1 - troca }}>
          <Notebook>
            <TelaDesktop frame={frame} />
          </Notebook>
          <Toque em={VIRA - 12} x={18 + 222 + 760} y={18 + 34 + 31} />
        </Posicionar>
      ) : null}
      <Som em={VIRA - 12} arquivo="clique" />
      {frame >= VIRA ? (
        <div style={{ perspective: 1800, position: "absolute", inset: 0 }}>
          <Posicionar w={CELULAR_LARGURA} h={CELULAR_ALTURA} cx={1180} cy={540} escala={1.05} style={{ opacity: troca, rotate: `y ${mix(-180, 0, giro)}deg`, backfaceVisibility: "hidden" }}>
            <Celular>
              <div style={{ position: "absolute", top: 28, left: 0 }}>
                <ModoPaciente frame={frame - VIRA - 30} />
              </div>
            </Celular>
          </Posicionar>
        </div>
      ) : null}
      <Legenda
        de={6}
        ate={VIRA + 4}
        titulo={<>Evolução entre sessões.</>}
        apoio={<>Valores lado a lado. Sem limiar validado, o app não diz que a medida “melhorou”.</>}
        style={{ left: 110, width: 540, top: 360 }}
        tamanho={56}
      />
      <Legenda
        de={VIRA + 20}
        titulo={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 18 }}>
            <Icone nome="virar-para-paciente" tamanho={56} />
            Virado para o paciente.
          </span>
        }
        apoio={<>«{S.modoPacienteExplicacao}»</>}
        style={{ left: 110, width: 700, top: 360 }}
        tamanho={56}
      />
    </Fundo>
  );
};
