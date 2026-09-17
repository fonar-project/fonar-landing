import { MIOLO_ICONES, type NomeIcone } from "./conteudo.gerado";

export type { NomeIcone };

type PropsIcone = {
  /** Nome do arquivo em public/icons, sem a extensão. */
  nome: NomeIcone;
  /**
   * Rótulo acessível. Informe sempre que o ícone carregar informação que não
   * está escrita ao lado dele. Sem rótulo, o ícone é tratado como decorativo
   * e some para o leitor de tela.
   */
  titulo?: string;
  /** Lado do quadrado, em px. Classe utilitária de tamanho tem prioridade. */
  tamanho?: number;
  className?: string;
};

/**
 * Único ponto do site que renderiza SVG.
 *
 * A cor vem do `currentColor`: defina `text-*` no elemento ou no ancestral em
 * vez de mexer no ícone. O desenho é embutido no HTML — nada de <img src>,
 * que num export estático com images.unoptimized custaria uma requisição por
 * ícone, sem cache compartilhado nem herança de cor.
 */
export function Icone({
  nome,
  titulo,
  tamanho = 24,
  className,
}: PropsIcone) {
  const rotulado = titulo !== undefined && titulo !== "";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={tamanho}
      height={tamanho}
      className={className}
      role={rotulado ? "img" : undefined}
      aria-label={rotulado ? titulo : undefined}
      aria-hidden={rotulado ? undefined : true}
      focusable="false"
      // Conteúdo gerado a partir de public/icons e validado por
      // scripts/lib-icones.mjs. Não há entrada de usuário neste caminho.
      dangerouslySetInnerHTML={{ __html: MIOLO_ICONES[nome] }}
    />
  );
}
