// Ponto único de inicialização do Firebase. Usado só pelo formulário de
// captação, que escreve direto no Firestore pelo SDK web (CLAUDE.md: zero
// API routes — o export estático não tem servidor).
//
// A config é identificador público de app web, não segredo. Com NEXT_PUBLIC_*
// definidos (.env.example documenta todos), ela usa os valores do projeto
// real; sem eles, cai em valores vazios e o app é simplesmente omitido — o
// formulário continua funcionando, só sem persistir, para o site nunca
// quebrar por falta de configuração.
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const configFirebase = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} as const;

export function configuracaoFirebasePresente(): boolean {
  return Boolean(
    configFirebase.apiKey && configFirebase.projectId && configFirebase.appId,
  );
}

/** App singleton; null quando a config ainda não foi provisionada. */
export function obterAppFirebase(): FirebaseApp | null {
  if (!configuracaoFirebasePresente()) return null;
  return getApps().length > 0 ? getApp() : initializeApp(configFirebase);
}

/** Firestore singleton; null quando a config ainda não foi provisionada. */
export function obterFirestore(): Firestore | null {
  const app = obterAppFirebase();
  return app ? getFirestore(app) : null;
}
