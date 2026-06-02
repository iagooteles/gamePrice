import cors from "cors";
import express from "express";
import { initFirebaseAdmin } from "./lib/firebase.js";
import gamesRouter from "./routes/games.js";

const PORT = Number(process.env.PORT) || 3001;

function normalizeOrigin(url) {
  return url.trim().replace(/\/$/, "");
}

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  const normalized = normalizeOrigin(origin);
  if (allowedOrigins.includes(normalized)) return true;
  // Frontends no Render (*.onrender.com) — evita CORS quando a URL muda no deploy
  if (normalized.endsWith(".onrender.com")) return true;
  return allowedOrigins.length === 0;
}

await initFirebaseAdmin();

const app = express();
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS bloqueado para origem: ${origin}`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "gameprice-api",
    health: "/health",
    games: "/api/games?page=1&limit=20",
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/games", gamesRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`API GamePrice em http://${HOST}:${PORT}`);
  console.log(
    `CORS: FRONTEND_URL=${allowedOrigins.length ? allowedOrigins.join(", ") : "(qualquer .onrender.com + lista vazia = todos)"}`
  );
  console.log(`Jogos: http://localhost:${PORT}/api/games?page=1&limit=20`);
  console.log(`Preços: http://localhost:${PORT}/api/games/320140/prices`);
});
