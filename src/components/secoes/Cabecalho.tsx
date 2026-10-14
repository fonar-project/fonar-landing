import Image from "next/image";

const classeDoLink =
  "rounded-full border border-lavanda bg-white px-4 py-2 text-sm font-semibold text-roxo hover:border-roxo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-roxo";

/**
 * A marca no topo da página (US47): o símbolo — a onda de voz que vira
 * ondas de sonar — e o nome. O nome vai como texto, na fonte do site; o
 * símbolo é imagem de marca, de /marca/.
 */
export function Cabecalho() {
  return (
    <header className="px-6 pt-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <a
          href="#"
          aria-label="FONAR, início da página"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-roxo"
        >
          <Image
            src="/marca/fonar-simbolo.svg"
            alt=""
            width={44}
            height={44}
            priority
          />
          <span className="text-2xl font-extrabold tracking-wider text-roxo">
            FONAR
          </span>
        </a>
        <a href="#download" className={classeDoLink}>
          Baixar
        </a>
      </div>
    </header>
  );
}
