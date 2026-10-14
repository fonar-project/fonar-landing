import { Cabecalho } from "@/components/secoes/Cabecalho";
import { Hero } from "@/components/secoes/Hero";
import { Funcionalidades } from "@/components/secoes/Funcionalidades";
import { Comparativo } from "@/components/secoes/Comparativo";
import { Ciencia } from "@/components/secoes/Ciencia";
import { Download } from "@/components/secoes/Download";
import { Rodape } from "@/components/secoes/Rodape";

export default function Home() {
  return (
    <>
      <Cabecalho />
      <main className="flex-1">
        <Hero />
        <Funcionalidades />
        <Comparativo />
        <Ciencia />
        <Download />
      </main>
      <Rodape />
    </>
  );
}
