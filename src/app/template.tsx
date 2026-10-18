"use client";

import { useEffect, useState, type ReactNode } from "react";

// Se o site já abriu nesta visita. Mora no módulo, e não no componente: o
// template é montado de novo a cada troca de rota, o módulo não.
let jaAbriu = false;

/**
 * A troca de página: a nova aparece num fade curto (`animate-pagina`, em
 * globals.css). Hoje, a volta da 404 para o início.
 *
 * Só nas trocas, nunca na primeira abertura: o Hero já tem a entrada dele
 * (Revelar), e a página inteira começando invisível atrasaria a leitura do
 * cabeçalho. Na primeira montagem, o HTML exportado e a hidratação saem
 * iguais, sem a animação.
 *
 * Com `prefers-reduced-motion`, nada se mexe.
 */
export default function Template({ children }: { children: ReactNode }) {
  // Lido uma vez, ao montar: a página não muda de ideia no meio.
  const [animar] = useState(() => jaAbriu);

  useEffect(() => {
    jaAbriu = true;
  }, []);

  return (
    <div
      className={
        animar
          ? "flex flex-1 flex-col animate-pagina motion-reduce:animate-none"
          : "flex flex-1 flex-col"
      }
    >
      {children}
    </div>
  );
}
