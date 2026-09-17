// TODO: seções previstas, ainda não implementadas — hero, cards de
// funcionalidade, comparativo "Jeito Antigo vs FONAR", validação científica,
// download, captação e rodapé. Enquanto não houver conteúdo real revisado,
// esta home não afirma nada além do que o produto é.

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-4xl font-bold text-roxo sm:text-5xl">FONAR</h1>

      <p className="mt-4 max-w-prose text-lg">
        Plataforma de avaliação vocal clínica para fonoaudiólogos.
      </p>

      <p className="mt-8 max-w-prose text-secundario">
        Site em construção. As páginas com informações sobre a ferramenta,
        download e contato ainda não foram publicadas.
      </p>
    </main>
  );
}
