"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type PropsRevelar = {
  children: ReactNode;
  /**
   * Entra no carregamento da página, e não ao rolar: é o caso do Hero, que
   * está sempre na tela quando a página abre.
   */
  aoCarregar?: boolean;
  /**
   * Só com `aoCarregar`: atraso da entrada, em segundos. Cada bloco recebe um
   * atraso maior que o anterior — é isso que escalona a entrada.
   */
  atrasoSegundos?: number;
  className?: string;
};

/** Entre irmãos que aparecem juntos, quanto cada um espera a mais. */
const PASSO_SEGUNDOS = 0.08;

// Um observador para a página inteira: o que entra na tela no mesmo instante
// chega na mesma chamada, e é aí que dá para escalonar os irmãos.
let observador: IntersectionObserver | null = null;

function aoEntrar(entradas: IntersectionObserverEntry[]) {
  const visiveis = entradas
    .filter((entrada) => entrada.isIntersecting)
    .map((entrada) => entrada.target as HTMLElement)
    // De cima para baixo e, na mesma linha de cartões, da esquerda para a
    // direita.
    .sort((a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      return Math.round(ra.top - rb.top) || ra.left - rb.left;
    });
  visiveis.forEach((elemento, indice) => {
    observador?.unobserve(elemento);
    elemento.style.transitionDelay = `${indice * PASSO_SEGUNDOS}s`;
    elemento.dataset.revelar = "entrando";
  });
}

function observar(elemento: HTMLElement) {
  observador ??= new IntersectionObserver(aoEntrar, {
    // Entra quando já subiu um pouco na tela, e não no primeiro pixel.
    rootMargin: "0px 0px -8% 0px",
  });
  observador.observe(elemento);
}

/**
 * A entrada do design system: sobe um pouco e aparece (globals.css).
 *
 * Ao rolar, por padrão — cada bloco entra quando chega à tela, e os irmãos
 * que chegam juntos entram em sequência. O estado invisível só é aplicado
 * depois que o JavaScript roda, e só no que ainda está abaixo da tela: sem
 * JS tudo aparece, e o que já estava à vista não pisca.
 *
 * Com `aoCarregar`, é a animação CSS de antes: roda com zero JS, e o `both`
 * segura o estado inicial até o atraso terminar.
 *
 * Com `prefers-reduced-motion`, nada se mexe nos dois casos.
 */
export function Revelar({
  children,
  aoCarregar = false,
  atrasoSegundos = 0,
  className,
}: PropsRevelar) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (aoCarregar || !elemento || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Já na tela, ou acima dela (a página reaberta no meio): fica como está.
    if (elemento.getBoundingClientRect().top < window.innerHeight) return;

    elemento.dataset.revelar = "oculto";
    observar(elemento);
    return () => observador?.unobserve(elemento);
  }, [aoCarregar]);

  if (aoCarregar) {
    return (
      <div
        className={`animacao-fonar-rise ${className ?? ""}`}
        style={{ animationDelay: `${atrasoSegundos}s` } as CSSProperties}
      >
        {children}
      </div>
    );
  }
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
