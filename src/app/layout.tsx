import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";

// Variável, então cobre Bold para títulos e Regular para corpo sem baixar
// dois arquivos. `display: swap` para o texto não sumir enquanto carrega.
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FONAR — Avaliação vocal clínica",
  description:
    "Gravação guiada, análise acústica, escalas perceptivas e laudo em PDF: a avaliação vocal clínica em um único fluxo. Cadastre-se para ser avisado do lançamento.",
  // TODO: favicon provisório com a inicial. Trocar por /marca/ definitivo
  // quando a marca do FONAR existir — ver public/marca/README.md.
  icons: { icon: "/marca/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${urbanist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-creme font-sans text-chumbo">
        {children}
      </body>
    </html>
  );
}
