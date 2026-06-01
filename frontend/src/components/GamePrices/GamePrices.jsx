import PriceDeals from "../PriceDeals/PriceDeals.jsx";
import PriceHistory from "../PriceHistory/PriceHistory.jsx";
import Loading from "../Loading/Loading.jsx";
import { money } from "../../format.js";
import "./GamePrices.css";

export default function GamePrices({ prices, loading, error, onRetry }) {
  if (loading) {
    return (
      <section className="game-prices">
        <h2 className="game-prices__title">Preços</h2>
        <Loading />
      </section>
    );
  }

  if (error) {
    return (
      <section className="game-prices">
        <h2 className="game-prices__title">Preços</h2>
        <p className="game-prices__error">{error}</p>
        {onRetry && (
          <button type="button" className="game-prices__retry" onClick={onRetry}>
            Tentar novamente
          </button>
        )}
      </section>
    );
  }

  if (!prices) return null;

  const historyLow = prices.historyLow?.all
    ? money(prices.historyLow.all)
    : "-";

  return (
    <section className="game-prices">
      <div className="game-prices__header">
        <div>
          <p className="game-prices__eyebrow">IsThereAnyDeal · Brasil</p>
          <h2 className="game-prices__title">Preços e ofertas</h2>
        </div>
        <p className="game-prices__low">
          Menor histórico: <strong>{historyLow}</strong>
        </p>
      </div>

      {!prices.pricesFound && prices.message && (
        <p className="game-prices__notice">{prices.message}</p>
      )}

      <PriceDeals deals={prices.deals} />

      <div className="game-prices__history-wrap">
        <h3>Histórico de preços</h3>
        <PriceHistory
          history={prices.history}
          total={prices.historyCount}
        />
      </div>
    </section>
  );
}
