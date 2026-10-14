import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Urbanist, a mesma família do app (assets/fonts, licença OFL — ver public/fonts/OFL.txt).
const pesos = [
  ["Regular", "400"],
  ["SemiBold", "600"],
  ["Bold", "700"],
  ["ExtraBold", "800"],
] as const;

export const fontesCarregadas = Promise.all(
  pesos.map(([arquivo, peso]) =>
    loadFont({
      family: "Urbanist",
      url: staticFile(`fonts/Urbanist-${arquivo}.ttf`),
      weight: peso,
    }),
  ),
);
