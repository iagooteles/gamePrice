# API de precos

Mini projeto com backend Node e frontend React.

## Estrutura

```txt
backend/
  src/server.js
  test-api.js

frontend/
  src/App.jsx
  src/api.js
  src/format.js
  src/main.jsx
  src/styles.css
```

## Rodar

Em um terminal:

```bash
npm run dev:backend
```

Em outro terminal:

```bash
npm run dev:frontend
```

Abra:

```txt
http://localhost:5173
```

O backend roda em:

```txt
http://localhost:3001
```

## Rotas

```txt
GET /health
GET /api/search?title=Red Dead Redemption 2
GET /api/history?title=Red Dead Redemption 2
GET /api/history?id=018d937f-3a3b-7210-bd2d-0d1dfb1d84c0
```
