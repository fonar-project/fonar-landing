export function Rodape() {
  return (
    <footer className="border-t border-lavanda bg-creme px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="text-sm font-bold text-roxo">
          FONAR — Avaliação vocal clínica
        </p>
        <p className="text-sm text-secundario">
          © {new Date().getFullYear()} FONAR. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
