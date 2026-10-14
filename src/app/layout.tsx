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

const DESCRICAO =
  "Gravação guiada, análise acústica pelo motor do Praat, CAPE-V e laudo em PDF: a avaliação vocal clínica em um único fluxo. Para Windows, macOS, Android e iPhone.";

export const metadata: Metadata = {
  metadataBase: new URL("https://appfonar.web.app"),
  title: "FONAR — Avaliação vocal clínica",
  description: DESCRICAO,
  // A marca do FONAR (US47). O ícone do iPhone é sangrado: o iOS arredonda
  // os cantos sozinho. Ver public/marca/README.md.
  icons: {
    icon: [
      { url: "/marca/favicon.svg", type: "image/svg+xml" },
      { url: "/marca/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/marca/apple-touch-icon.png",
  },
  openGraph: {
    title: "FONAR — Avaliação vocal clínica",
    description: DESCRICAO,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/marca/og-image.png",
        width: 1200,
        height: 630,
        alt: "FONAR — Avaliação vocal clínica",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // `data-scroll-behavior`: a rolagem suave (globals.css) vale nas âncoras
    // da página, e o Next a desliga nas trocas de rota (Next 16).
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${urbanist.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-creme font-sans text-chumbo">
        {children}
      </body>
    </html>
  );
}
