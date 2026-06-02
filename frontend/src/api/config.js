/** URL base da API. Em produção: VITE_API_URL=https://seu-backend.onrender.com */
export function apiUrl(path) {
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
