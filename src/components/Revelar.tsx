import type { CSSProperties, ReactNode } from "react";

type PropsRevelar = {
  children: ReactNode;
  /**
   * Atraso da entrada, em segundos. A um só tempo, cada bloco da página
   * recebe um atraso maior que o anterior — é isso que cria a entrada
   * escalonada do design system.
   */
  atrasoSegundos?: number;
  className?: string;
};

/**
 * Envelope da animação `fonarRise` do design system (globals.css).
 *
 * Roda com zero JS: a animação CSS `both` segura o estado inicial (invisível)
 * antes do atraso terminar, então a página não pisca. Quem orquestra o
 * escalonamento é a página, um atraso por bloco, de cima para baixo.
 */
export function Revelar({
  children,
  atrasoSegundos = 0,
  className,
}: PropsRevelar) {
  return (
    <div
      className={`animacao-fonar-rise ${className ?? ""}`}
      style={{ animationDelay: `${atrasoSegundos}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
