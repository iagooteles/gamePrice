# Deploy no Render — GamePrice

Guia para publicar **backend** (Web Service) e **frontend** (Static Site) em instâncias separadas no [Render](https://render.com).

## Arquitetura no Render

```text
Usuário
   │
   ▼
┌─────────────────────────────┐
│  Static Site (frontend)      │  https://gameprice.onrender.com
│  React build (dist/)         │
└──────────────┬──────────────┘
               │ fetch (VITE_API_URL)
               ▼
┌─────────────────────────────┐
│  Web Service (backend)       │  https://gameprice-wcrq.onrender.com/
│  Express + Firebase + ITAD   │
└──────────────┬──────────────┘
               │
     ┌─────────┴─────────┐
     ▼                   ▼
 Firestore          IsThereAnyDeal API
 (gameprice-bd3ba)   (ITAD_API_KEY)
```

## Pré-requisitos

1. Conta no [Render](https://dashboard.render.com/)
2. Repositório no GitHub (push do projeto `gamePrice`)
3. Credenciais prontas:
   - JSON da **conta de serviço** Firebase (backend)
   - Config do app **Web** Firebase (frontend — `VITE_FIREBASE_*`)
   - `ITAD_API_KEY` (preços na PDP)
   - (Opcional) Twitch para rodar pipeline IGDB no seu PC — não precisa no Render para o app rodar

4. Firestore já populado (rode `npm run igdb:pipeline` localmente antes, se ainda não tiver jogos)

---

## Parte 1 — Preparar o repositório

### 1.1 Commit e push

```bash
git add .
git commit -m "chore: preparar deploy Render"
git push origin main
```

### 1.2 O que **não** pode ir para o Git

- `backend/.env`
- `frontend/.env`
- `backend/secrets/*.json` (conta de serviço)
- Chaves `ITAD_API_KEY`, `TWITCH_*`, etc.

Confirme que `.gitignore` cobre esses arquivos.

---

## Parte 2 — Deploy do **backend** (Web Service)

### 2.1 Criar o serviço

1. Render Dashboard → **New +** → **Web Service**
2. Conecte o repositório `gamePrice`
3. Configuração:

| Campo | Valor |
|--------|--------|
| **Name** | `gameprice-api` (ou outro nome) |
| **Region** | Oregon ou a mais próxima |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` (ou `yarn start`) |
| **Health Check Path** | `/health` |
| **Instance Type** | Free (ou Starter se quiser menos cold start) |

### 2.2 Variáveis de ambiente (Environment)

Em **Environment** → **Add Environment Variable**:

| Key | Valor | Observação |
|-----|--------|------------|
| `NODE_VERSION` | `20` | Recomendado no Render |
| `FIRESTORE_COLLECTION` | `games` | |
| `ITAD_API_KEY` | sua chave ITAD | Do Thales / `.env` local |
| `FRONTEND_URL` | *(preencher depois)* | URL do static site, ex. `https://gameprice.onrender.com` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | JSON em **uma linha** | Ver seção 2.3 |

**Não use** `FIREBASE_SERVICE_ACCOUNT_PATH` no Render (não há arquivo `secrets/` no servidor).

### 2.3 `FIREBASE_SERVICE_ACCOUNT_JSON` no Render

1. Abra o arquivo `backend/secrets/gameprice-bd3ba-firebase-adminsdk-....json` no seu PC
2. Minifique para **uma única linha** (sem quebras):
   - Cole em https://jsonformatter.org/json-minify ou
   - PowerShell: `(Get-Content .\secrets\arquivo.json -Raw) | ConvertFrom-Json | ConvertTo-Json -Compress`
3. Cole o resultado inteiro como valor de `FIREBASE_SERVICE_ACCOUNT_JSON` no Render

### 2.4 Deploy e teste

1. **Create Web Service** e aguarde o deploy
2. Anote a URL: `https://gameprice-wcrq.onrender.com/` (exemplo)
3. Teste no navegador ou terminal:

```text
https://gameprice-wcrq.onrender.com//health
https://gameprice-wcrq.onrender.com//api/games?page=1&limit=5
```
---

## Parte 3 — Deploy do **frontend** (Static Site)

### 3.1 Criar o site estático

1. **New +** → **Static Site**
2. Mesmo repositório `gamePrice`
3. Configuração:

| Campo | Valor |
|--------|--------|
| **Name** | `gameprice` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### 3.2 Variáveis de ambiente (build time)

No Static Site, variáveis `VITE_*` são lidas **na hora do build**. Adicione:

| Key | Valor |
|-----|--------|
| `VITE_API_URL` | `https://gameprice-wcrq.onrender.com/` | URL real do backend (sem `/` no final) |
| `VITE_FIREBASE_API_KEY` | do Firebase Console |
| `VITE_FIREBASE_AUTH_DOMAIN` | `gameprice-bd3ba.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `gameprice-bd3ba` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `gameprice-bd3ba.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | do Console |
| `VITE_FIREBASE_APP_ID` | do Console |

Copie os valores do seu `frontend/.env` local.

### 3.3 Deploy

1. **Create Static Site**
2. Anote a URL: `https://gameprice.onrender.com` (exemplo)

### 3.4 Atualizar CORS no backend

Volte ao **Web Service** do backend → **Environment**:

```env
FRONTEND_URL=https://gameprice.onrender.com
```

Salve → o Render faz **redeploy** automático do backend.

Se tiver preview ou domínio customizado, use vírgula:

```env
FRONTEND_URL=https://gameprice.onrender.com,https://www.seudominio.com
```

---

## Parte 4 — Firebase (obrigatório para login)

1. [Firebase Console](https://console.firebase.google.com/project/gameprice-bd3ba/authentication/settings)
2. **Authentication** → **Settings** → **Authorized domains**
3. Adicione:
   - `gameprice.onrender.com` (substitua pelo nome real do seu static site)
   - `localhost` (já deve existir para dev)

4. **Sign-in method** → **E-mail/senha** ativo

Sem isso, login funciona localmente mas falha em produção.

---

## Parte 5 — Checklist pós-deploy

| Teste | Esperado |
|-------|----------|
| Abrir URL do frontend | Home com jogos |
| Paginação | Troca de página |
| Login / cadastro | Modal e sessão |
| Clicar em jogo (logado) | PDP com detalhes |
| Seção preços na PDP | Ofertas ITAD (se `ITAD_API_KEY` ok) |
| `/health` do backend | `{ "ok": true }` |

---

## Parte 6 — Problemas comuns

### CORS / “Failed to fetch”

- `FRONTEND_URL` no backend deve ser **exatamente** a URL do static site (com `https://`, sem barra final)
- Redeploy do backend após alterar

### API retorna 404 no frontend

- `VITE_API_URL` incorreta ou build antigo
- No Static Site: **Manual Deploy** → **Clear build cache & deploy** após mudar `VITE_*`

### 404 em todas as rotas (servidor “live” nos logs)

- O app precisa escutar em **`0.0.0.0`** e na porta `PORT` (já ajustado em `server.js`).
- No Render → Web Service → **Settings** → **Health Check Path**: `/health` (não `/` vazio).
- Confirme **Root Directory** = `backend` e tipo **Web Service** (não Static Site).
- Após novo deploy, teste:
  - `https://seu-app.onrender.com/health` → `{"ok":true}`
  - Se o corpo for HTML “Not Found” vazio, o tráfego ainda não chega no Node — veja os logs ao acessar a URL.

### Backend 500 ao iniciar

- `FIREBASE_SERVICE_ACCOUNT_JSON` inválido (JSON quebrado, aspas erradas)
- Teste local com a mesma variável no `.env`

### Cold start (plano Free)

- Primeira visita demora; considere plano pago ou [cron job](https://render.com/docs/cronjobs) pingando `/health` a cada 14 min

### Preços não aparecem na PDP

- `ITAD_API_KEY` no backend Render
- Título do jogo no Firestore pode não bater com ITAD (mensagem amigável é esperada em alguns jogos)

---

## Parte 7 — Ordem recomendada (resumo)

```text
1. Push código no GitHub
2. Deploy backend (Web Service) + env vars + FIREBASE_SERVICE_ACCOUNT_JSON
3. Testar /health e /api/games
4. Deploy frontend (Static Site) + VITE_* + VITE_API_URL
5. Copiar URL do frontend → FRONTEND_URL no backend → redeploy
6. Firebase Authorized domains
7. Testar fluxo completo em produção
```

---

## Opcional — domínio customizado

- **Static Site:** Settings → Custom Domains
- **Web Service:** Settings → Custom Domains
- Atualize `FRONTEND_URL` e `VITE_API_URL` (novo deploy do frontend)

---

## Pipeline IGDB (fora do Render)

A pipeline que busca jogos na IGDB e grava no Firestore roda **no seu PC** (precisa de `TWITCH_*` e tempo de execução):

```bash
cd backend
npm run igdb:pipeline
```

O app em produção só **lê** o Firestore; não precisa das credenciais Twitch no Render.
