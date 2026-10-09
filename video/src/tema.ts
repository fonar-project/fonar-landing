// Tokens copiados de fonar-app/lib/design_system/tokens. Fonte da verdade é o
// app: se um valor mudar lá, muda aqui.

export const cor = {
  // app_colors.dart — tema claro
  creme: "#FFF7EB",
  roxo: "#40085E",
  roxoHover: "#53187A",
  roxoPressionado: "#2E0345",
  roxoVeu: "rgba(64, 8, 94, 0.07)",
  chumbo: "#413C58",
  lavanda: "#DBD2E0",
  lavandaSuave: "rgba(219, 210, 224, 0.35)",
  branco: "#FFFFFF",
  secundario: "#6E6787",
  secundarioLavanda: "#5A5472",
  // Só no medidor de nível (saturação) — regra da paleta.
  sucesso: "#1B6B3A",
  atencao: "#8A5A00",
  erro: "#B3261E",
  // escuro (US30)
  escuroFundo: "#17131F",
  escuroCartao: "#211B2B",
  escuroSuave: "#2B2438",
  escuroBorda: "#40374F",
  escuroTexto: "#F1E9DC",
  escuroSecundario: "#A198B3",
  escuroPrimaria: "#6A2F93",
  escuroAcento: "#D2B0EC",
  escuroLateral: "#260838",
} as const;

// app_radius.dart
export const raio = { pequeno: 4, medio: 12, grande: 20, pilula: 999 } as const;

// app_spacing.dart
export const esp = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

// app_typography.dart — TextTheme do Flutter, em CSS
export const fonte = "Urbanist";
type Estilo = React.CSSProperties;
export const tipo: Record<string, Estilo> = {
  displaySmall: { fontSize: 40, lineHeight: 1.1, fontWeight: 800, letterSpacing: -0.5 },
  headlineMedium: { fontSize: 30, lineHeight: 1.2, fontWeight: 700, letterSpacing: -0.3 },
  headlineSmall: { fontSize: 24, lineHeight: 1.25, fontWeight: 700 },
  titleLarge: { fontSize: 20, lineHeight: 1.3, fontWeight: 700 },
  titleMedium: { fontSize: 17, lineHeight: 1.35, fontWeight: 700 },
  bodyLarge: { fontSize: 17, lineHeight: 1.55, fontWeight: 400 },
  bodyMedium: { fontSize: 15, lineHeight: 1.55, fontWeight: 400 },
  bodySmall: { fontSize: 14, lineHeight: 1.5, fontWeight: 400 },
  labelLarge: { fontSize: 16, lineHeight: 1.2, fontWeight: 700 },
  labelMedium: { fontSize: 14, lineHeight: 1.3, fontWeight: 700 },
  labelSmall: { fontSize: 14, lineHeight: 1.3, fontWeight: 600 },
  medida: { fontSize: 28, lineHeight: 1.1, fontWeight: 800, fontVariantNumeric: "tabular-nums" },
  medidaDestaque: { fontSize: 44, lineHeight: 1.05, fontWeight: 800, fontVariantNumeric: "tabular-nums" },
  medidaCompacta: { fontSize: 20, lineHeight: 1.1, fontWeight: 800, fontVariantNumeric: "tabular-nums" },
  overline: { fontSize: 14, lineHeight: 1.2, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase" },
};

// Breakpoints (lib/design_system/breakpoints.dart): compacta < 600, média < 1024.
export const larguraCompacta = 600;
export const larguraMedia = 1024;

export const FPS = 30;
