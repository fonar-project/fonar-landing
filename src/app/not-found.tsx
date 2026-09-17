import Link from "next/link";

export default function NaoEncontrada() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-bold tracking-widest text-secundario">404</p>

      <h1 className="mt-2 text-3xl font-bold text-roxo sm:text-4xl">
        Página não encontrada
      </h1>

      <p className="mt-4 max-w-prose text-secundario">
        O endereço que você abriu não existe ou foi movido.
      </p>

      <Link
        href="/"
        className="mt-8 font-bold text-roxo underline underline-offset-4 hover:no-underline focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-roxo"
      >
        Voltar para a página inicial
      </Link>
    </main>
  );
}
