import "./Loading.css";

export default function Loading() {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading__spinner" aria-hidden="true" />
      <p>Carregando jogos…</p>
    </div>
  );
}
