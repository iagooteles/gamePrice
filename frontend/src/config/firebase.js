import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const ENV_KEYS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

function readConfig() {
  const values = Object.fromEntries(
    ENV_KEYS.map((key) => [key, import.meta.env[key]?.trim() ?? ""])
  );
  const missing = ENV_KEYS.filter((key) => !values[key]);
  if (missing.length > 0) {
    return { ok: false, missing, values };
  }
  return {
    ok: true,
    config: {
      apiKey: values.VITE_FIREBASE_API_KEY,
      authDomain: values.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: values.VITE_FIREBASE_PROJECT_ID,
      storageBucket: values.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: values.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: values.VITE_FIREBASE_APP_ID,
    },
  };
}

const parsed = readConfig();

export const isFirebaseConfigured = parsed.ok;
export const missingFirebaseEnv = parsed.ok ? [] : parsed.missing;

let app = null;
let auth = null;

if (parsed.ok) {
  app = initializeApp(parsed.config);
  auth = getAuth(app);
}

export function getFirebaseAuth() {
  if (!auth) {
    throw new Error(
      "Firebase Auth não configurado. Crie frontend/.env a partir de .env.example com as chaves do app Web (projeto gameprice-bd3ba) e reinicie o Vite."
    );
  }
  return auth;
}

export { app, auth };
