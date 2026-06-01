import "dotenv/config";
import {
  findGameByTitle,
  getPriceHistory,
  getPrices,
  isItadConfigured,
} from "../src/lib/itad.js";

const title = process.argv[2] || "Red Dead Redemption 2";

async function main() {
  if (!isItadConfigured()) {
    console.error("ITAD_API_KEY não configurada em backend/.env");
    process.exit(1);
  }

  console.log(`Buscando no ITAD: "${title}"…`);
  const game = await findGameByTitle(title);

  if (!game) {
    console.log("Nenhum jogo encontrado.");
    return;
  }

  console.log(`ITAD: ${game.title} (${game.id})`);

  const prices = await getPrices(game.id);
  const data = prices[0] || { deals: [] };
  const history = await getPriceHistory(game.id);

  const low = data.historyLow?.all?.amount;
  console.log(`Menor histórico: ${low != null ? `R$ ${low}` : "-"}`);
  console.log(`Ofertas: ${data.deals?.length ?? 0}`);
  console.log(`Histórico: ${history.length} registros`);

  for (const deal of (data.deals || []).slice(0, 3)) {
    console.log(
      `- ${deal.shop.name}: R$ ${deal.price.amount} (${deal.cut}% off)`
    );
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
