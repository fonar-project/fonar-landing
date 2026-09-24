import { Hero } from "@/components/secoes/Hero";
import { Funcionalidades } from "@/components/secoes/Funcionalidades";
import { Comparativo } from "@/components/secoes/Comparativo";
import { Ciencia } from "@/components/secoes/Ciencia";
import { Download } from "@/components/secoes/Download";
import { Captacao } from "@/components/secoes/Captacao";
import { Rodape } from "@/components/secoes/Rodape";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <Funcionalidades />
        <Comparativo />
        <Ciencia />
        <Download />
        <Captacao />
      </main>
      <Rodape />
    </>
  );
}
