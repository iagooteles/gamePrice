import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const EXPECTED_PROJECT_ID = "gameprice-bd3ba";

function resolveCredentialPath(keyPath) {
  const trimmed = keyPath.trim();
  return path.isAbsolute(trimmed)
    ? trimmed
    : path.resolve(process.cwd(), trimmed);
}

export async function initFirebaseAdmin() {
  if (getApps().length > 0) return;

  const keyPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (keyPath) {
    const abs = resolveCredentialPath(keyPath);
    const json = JSON.parse(await fs.readFile(abs, "utf8"));
    if (json.project_id && json.project_id !== EXPECTED_PROJECT_ID) {
      console.warn(
        `Aviso: project_id no JSON é "${json.project_id}", esperado "${EXPECTED_PROJECT_ID}".`
      );
    }
    initializeApp({ credential: cert(json) });
    return;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    initializeApp({ credential: cert(JSON.parse(raw)) });
    return;
  }

  throw new Error(
    "Defina FIREBASE_SERVICE_ACCOUNT_PATH ou FIREBASE_SERVICE_ACCOUNT_JSON no .env."
  );
}

export function getDb() {
  return getFirestore();
}

export function getGamesCollectionName() {
  return process.env.FIRESTORE_COLLECTION || "games";
}
