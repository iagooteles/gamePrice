import { formatDateTime, money } from "../../format.js";
import "./PriceHistory.css";

const MAX_ROWS = 30;

export default function PriceHistory({ history, total }) {
  const rows = (history || []).slice(0, MAX_ROWS);

  if (!rows.length) {
    return (
      <p className="price-history__empty">Nenhum histórico de preços disponível.</p>
    );
  }

  return (
    <div className="price-history">
      <div className="price-history__meta">
        <span className="price-history__pill">
          Mostrando {rows.length} de {total ?? rows.length}
        </span>
      </div>

      <div className="price-history__list">
        {rows.map((item, index) => (
          <article
            className="price-history__row"
            key={`${item.timestamp}-${item.shop?.name}-${index}`}
          >
            <div>
              <strong>{item.shop?.name || "Loja"}</strong>
              <span>{formatDateTime(item.timestamp)}</span>
            </div>
            <div className="price-history__price">{money(item.deal?.price)}</div>
            <div className="price-history__regular">{money(item.deal?.regular)}</div>
            <div className="price-history__cut">{item.deal?.cut ?? 0}% off</div>
          </article>
        ))}
      </div>
    </div>
  );
}
