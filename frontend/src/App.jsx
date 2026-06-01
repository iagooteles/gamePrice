import { useState } from "react";
import { fetchPriceHistory, searchGame } from "./api.js";
import { money } from "./format.js";

function GameSummary({ game, historyLow }) {
  const cover = game.assets?.boxart || game.assets?.banner300 || "";
  const history = historyLow?.all ? money(historyLow.all) : "-";

  return (
    <div className="game-summary">
      {cover ? (
        <img className="cover" src={cover} alt={`Capa de ${game.title}`} />
      ) : (
        <div className="cover" aria-label="Sem capa" />
      )}

      <div className="game-info">
        <div>
          <h2>{game.title}</h2>
          <div className="meta">
            <span className="pill">{game.type}</span>
            <span className="pill">{game.mature ? "18+" : "Livre"}</span>
          </div>
        </div>

        <p className="history">Menor historico: {history}</p>
      </div>
    </div>
  );
}

function DealList({ deals }) {
  if (!deals.length) {
    return <div className="status">Nenhuma oferta encontrada.</div>;
  }

  return (
    <div className="deals">
      {deals.map((deal) => (
        <article className="deal" key={`${deal.shop.id}-${deal.url}`}>
          <div className="shop">{deal.shop.name}</div>
          <div className="price">{money(deal.price)}</div>
          <div className="regular">{money(deal.regular)}</div>
          <div className="discount">{deal.cut}% off</div>
          <a href={deal.url} target="_blank" rel="noreferrer">
            Abrir
          </a>
        </article>
      ))}
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function PriceHistory({ history, total }) {
  const [filters, setFilters] = useState({
    shop: "",
    minPrice: "",
    maxPrice: "",
    minDiscount: "",
    fromDate: "",
    toDate: ""
  });

  function updateFilter(name, value) {
    setFilters((current) => ({
      ...current,
      [name]: value
    }));
  }

  function clearFilters() {
    setFilters({
      shop: "",
      minPrice: "",
      maxPrice: "",
      minDiscount: "",
      fromDate: "",
      toDate: ""
    });
  }

  const filteredHistory = history.filter((item) => {
    const shopName = item.shop?.name?.toLowerCase() || "";
    const price = Number(item.deal?.price?.amount);
    const cut = Number(item.deal?.cut ?? 0);
    const itemDate = item.timestamp ? new Date(item.timestamp) : null;

    if (filters.shop && !shopName.includes(filters.shop.toLowerCase())) {
      return false;
    }

    if (filters.minPrice && (Number.isNaN(price) || price < Number(filters.minPrice))) {
      return false;
    }

    if (filters.maxPrice && (Number.isNaN(price) || price > Number(filters.maxPrice))) {
      return false;
    }

    if (filters.minDiscount && cut < Number(filters.minDiscount)) {
      return false;
    }

    if (filters.fromDate) {
      const fromDate = new Date(`${filters.fromDate}T00:00:00`);
      if (!itemDate || itemDate < fromDate) {
        return false;
      }
    }

    if (filters.toDate) {
      const toDate = new Date(`${filters.toDate}T23:59:59`);
      if (!itemDate || itemDate > toDate) {
        return false;
      }
    }

    return true;
  });

  const visibleHistory = filteredHistory.slice(0, 30);

  return (
    <section className="history-panel">
      <div className="section-title">
        <div>
          <p className="eyebrow">Historico</p>
          <h2>Historico de precos</h2>
        </div>
        <div className="history-counts">
          <span className="pill">
            Mostrando {visibleHistory.length} de {filteredHistory.length}
          </span>
          <span className="pill">Total API: {total}</span>
        </div>
      </div>

      <div className="history-filters">
        <label className="filter-field">
          <span>Loja</span>
          <input
            type="search"
            value={filters.shop}
            placeholder="Ex: Steam"
            onChange={(event) => updateFilter("shop", event.target.value)}
          />
        </label>

        <label className="filter-field">
          <span>Preco min.</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={filters.minPrice}
            placeholder="0"
            onChange={(event) => updateFilter("minPrice", event.target.value)}
          />
        </label>

        <label className="filter-field">
          <span>Preco max.</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={filters.maxPrice}
            placeholder="100"
            onChange={(event) => updateFilter("maxPrice", event.target.value)}
          />
        </label>

        <label className="filter-field">
          <span>Desconto min.</span>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={filters.minDiscount}
            placeholder="50"
            onChange={(event) => updateFilter("minDiscount", event.target.value)}
          />
        </label>

        <label className="filter-field">
          <span>De</span>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(event) => updateFilter("fromDate", event.target.value)}
          />
        </label>

        <label className="filter-field">
          <span>Ate</span>
          <input
            type="date"
            value={filters.toDate}
            onChange={(event) => updateFilter("toDate", event.target.value)}
          />
        </label>

        <button type="button" className="clear-filters" onClick={clearFilters}>
          Limpar
        </button>
      </div>

      {!history.length && <div className="status">Nenhum historico encontrado.</div>}

      {history.length > 0 && !filteredHistory.length && (
        <div className="status">Nenhum registro encontrado com esses filtros.</div>
      )}

      <div className="history-list">
        {visibleHistory.map((item, index) => (
          <article
            className="history-row"
            key={`${item.timestamp}-${item.shop?.id || item.shop?.name}-${index}`}
          >
            <div>
              <strong>{item.shop?.name || "Loja"}</strong>
              <span>{formatDate(item.timestamp)}</span>
            </div>
            <div className="price">{money(item.deal?.price)}</div>
            <div className="regular">{money(item.deal?.regular)}</div>
            <div className="discount">{item.deal?.cut ?? 0}% off</div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [title, setTitle] = useState("Red Dead Redemption 2");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const nextTitle = title.trim();

    if (!nextTitle) {
      setError("Digite o nome de um jogo.");
      setStatus("");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");
    setStatus("Buscando ofertas atuais...");

    try {
      const data = await searchGame(nextTitle);
      setStatus("Buscando historico de precos...");
      const historyData = await fetchPriceHistory(data.game.id);
      setResult({
        ...data,
        priceHistory: historyData.history,
        historyCount: historyData.count
      });
      setStatus("");
    } catch (err) {
      setError(err.message);
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <section className="search-panel">
        <div>
          <p className="eyebrow">IsThereAnyDeal</p>
          <h1>API de precos</h1>
        </div>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="search"
            value={title}
            placeholder="Nome do jogo"
            autoComplete="off"
            onChange={(event) => setTitle(event.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Buscando" : "Buscar"}
          </button>
        </form>
      </section>

      {status && <section className="status">{status}</section>}
      {error && <section className="status error">{error}</section>}

      {result && (
        <section className="result">
          <GameSummary game={result.game} historyLow={result.historyLow} />
          <DealList deals={result.deals} />
          <PriceHistory
            history={result.priceHistory || []}
            total={result.historyCount || 0}
          />
        </section>
      )}
    </main>
  );
}
