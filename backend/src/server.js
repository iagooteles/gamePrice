import cors from "cors";
import express from "express";
import { initFirebaseAdmin } from "./lib/firebase.js";
import gamesRouter from "./routes/games.js";

const PORT = Number(process.env.PORT) || 3001;

await initFirebaseAdmin();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/games", gamesRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.listen(PORT, () => {
  console.log(`API GamePrice em http://localhost:${PORT}`);
  console.log(`Jogos: http://localhost:${PORT}/api/games?page=1&limit=20`);
});
