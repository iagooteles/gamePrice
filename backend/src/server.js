import cors from "cors";
import express from "express";
import { initFirebaseAdmin } from "./lib/firebase.js";
import gamesRouter from "./routes/games.js";

const PORT = Number(process.env.PORT) || 3001;

const corsOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : true;

await initFirebaseAdmin();

const app = express();
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/games", gamesRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.listen(PORT, () => {
  console.log(`API GamePrice em http://localhost:${PORT}`);
  console.log(`Jogos: http://localhost:${PORT}/api/games?page=1&limit=20`);
  console.log(`Preços: http://localhost:${PORT}/api/games/320140/prices`);
});
