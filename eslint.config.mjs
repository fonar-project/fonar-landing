import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // O componente Icone é o único ponto do site que renderiza SVG: um SVG
    // solto em outra seção escaparia do nome tipado e da verificação do CI.
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/icones/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name='svg']",
          message:
            'SVG inline só em src/components/icones. Use <Icone nome="..." />.',
        },
        {
          selector:
            "Literal[value=/^(?!\\/marca\\/).*\\.svg$/]",
          message:
            'Ícone por URL vira uma requisição por ícone. Use <Icone nome="..." />. '
            + 'Imagem de marca é a exceção e mora em /marca/.',
        },
      ],
    },
  },
]);

export default eslintConfig;
