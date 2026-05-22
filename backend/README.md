# GamePrice — pipeline IGDB → Firestore

Busca os **100 jogos** mais populares na IGDB (PopScore) e grava na coleção `games` do Firebase **`gameprice-bd3ba`**.

## Pré-requisitos

1. **Twitch / IGDB** — `TWITCH_CLIENT_ID` e `TWITCH_CLIENT_SECRET` (mesmo app Twitch do outro projeto, se já tiver).
2. **Firebase Admin** — chave de **conta de serviço** do projeto `gameprice-bd3ba` (não use a config do app web no passo 3):
   - [Console Firebase](https://console.firebase.google.com/project/gameprice-bd3ba/settings/serviceaccounts/adminsdk) → Contas de serviço → **Gerar nova chave privada**
   - Salve o JSON em `secrets/` (ex.: `secrets/gameprice-bd3ba-firebase-adminsdk.json`)
3. **Firestore** ativo no projeto `gameprice-bd3ba`.

## Configuração

```bash
cd backend
cp .env.example .env
# Edite .env: credenciais Twitch + caminho do JSON da conta de serviço
npm install
```

Exemplo `.env`:

```env
TWITCH_CLIENT_ID=seu_client_id
TWITCH_CLIENT_SECRET=seu_client_secret
FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/gameprice-bd3ba-firebase-adminsdk.json
FIRESTORE_COLLECTION=games
```

## Executar a pipeline completa

```bash
npm run igdb:pipeline
```

Isso executa, em sequência:

| Script | Comando npm | Saída |
|--------|-------------|--------|
| 1 | `igdb:01` | `data/top-games.json` (top 100) |
| 2 | `igdb:02` | `data/games-firebase-ready.json` |
| 3 | `igdb:03:sync` | upload + `--prune` no Firestore |

### Passos individuais

```bash
npm run igdb:01
npm run igdb:02
npm run igdb:03          # só upsert (não apaga órfãos)
npm run igdb:03:sync     # upsert + remove docs que não estão no JSON
```

### Variáveis úteis

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `IGDB_TOP_N` | `100` | Quantidade de jogos no passo 1 |
| `IGDB_FILTER_MATURE` | ligado | `0` desliga filtro adulto/erótico |
| `FIRESTORE_COLLECTION` | `games` | Nome da coleção |

## Formato dos documentos

Cada documento usa ID `String(igdbId)` e campos como `title`, `description`, `developer`, `publisher`, `releaseDate`, `coverImageUrl`, `genres`, `rank`, ratings, etc.

## API (Express)

```bash
npm run dev    # reinicia ao salvar
npm start      # produção local
```

| Rota | Descrição |
|------|-----------|
| `GET /health` | Status da API |
| `GET /api/games?page=1&limit=20` | Lista jogos do Firestore (ordenados por `rank`) |

Resposta inclui `games` e `pagination` (`total`, `totalPages`, `hasNext`, `hasPrev`). Limite máximo por página: 50 (padrão: 20).

Variável opcional: `PORT` (padrão `3001`).
