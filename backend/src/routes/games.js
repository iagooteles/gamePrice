import { Router } from "express";
import { getDb, getGamesCollectionName } from "../lib/firebase.js";

const router = Router();
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function serializeDoc(data) {
  const out = { ...data };
  if (out.syncedAt?.toDate) {
    out.syncedAt = out.syncedAt.toDate().toISOString();
  }
  return out;
}

router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, Number.parseInt(req.query.limit, 10) || DEFAULT_LIMIT)
    );
    const offset = (page - 1) * limit;

    const db = getDb();
    const collection = db.collection(getGamesCollectionName());

    const countSnap = await collection.count().get();
    const total = countSnap.data().count;
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    if (total === 0) {
      return res.json({
        games: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      });
    }

    if (page > totalPages) {
      return res.status(400).json({
        error: `Página ${page} inválida. Total de páginas: ${totalPages}.`,
        pagination: { page, limit, total, totalPages },
      });
    }

    const snap = await collection
      .orderBy("rank", "asc")
      .offset(offset)
      .limit(limit)
      .get();

    const games = snap.docs.map((doc) => ({
      id: doc.id,
      ...serializeDoc(doc.data()),
    }));

    res.json({
      games,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("GET /api/games:", err);
    res.status(500).json({
      error: "Erro ao buscar jogos no Firestore.",
      message: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = getDb();
    const ref = db.collection(getGamesCollectionName()).doc(req.params.id);
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Jogo não encontrado." });
    }

    res.json({
      game: {
        id: doc.id,
        ...serializeDoc(doc.data()),
      },
    });
  } catch (err) {
    console.error("GET /api/games/:id:", err);
    res.status(500).json({
      error: "Erro ao buscar detalhes do jogo no Firestore.",
      message: err.message,
    });
  }
});

export default router;
