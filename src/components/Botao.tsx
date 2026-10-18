import type { ComponentPropsWithoutRef, ReactNode } from "react";

type PropsBotao = {
  /** "primario" roxo sólido; "secundario" contorno sobre fundo claro. */
  variante?: "primario" | "secundario";
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "href"> & {
    /**
     * Onde o botão leva. `#id` rola até a seção (âncora nativa, zero JS);
     * URL externa abre em nova aba com rel de segurança.
     */
    href: string;
    /**
     * Link externo que abre na mesma aba, e não numa nova. Para o que se
     * baixa: o navegador baixa e a página fica onde está. E para o caminho
     * do APK, que tem de ser o mais parecido possível com abrir o GitHub
     * direto no navegador (ver `downloads.ts`).
     */
    mesmaAba?: boolean;
  };

const classesVariante = {
  primario:
    "bg-roxo text-white hover:bg-roxo-escuro focus-visible:outline-roxo",
  secundario:
    "border-2 border-roxo bg-transparent text-roxo hover:bg-lavanda focus-visible:outline-roxo",
} as const;

/**
 * Único visual de botão do site, sobre links (âncora nativa). Para o export
 * estático não existe <button> de verdade: toda ação navega ou rola.
 */
export function Botao({
  variante = "primario",
  className = "",
  mesmaAba = false,
  children,
  ...outras
}: PropsBotao) {
  const externo =
    !outras.href.startsWith("#") && !outras.href.startsWith("/");
  const novaAba = externo && !mesmaAba;

  return (
    <a
      {...outras}
      href={outras.href}
      target={novaAba ? "_blank" : undefined}
      rel={externo ? "noopener noreferrer" : undefined}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 ${classesVariante[variante]} ${className}`}
    >
      {children}
    </a>
  );
}
