# GamePrice

Projeto com backend em Express + Firebase Admin e frontend em React (Vite) integrado ao Firebase Auth.

## Antes de rodar

Voce precisa ter instalado:

- Node.js 20+
- npm
- Git Bash, PowerShell ou terminal equivalente

Importante: antes de testar login, cadastro ou acesso ao Firestore, fale comigo para pegar os arquivos/valores de `.env` do Firebase. O projeto usa variaveis locais que nao devem ser commitadas.

Arquivos esperados:

- `backend/.env`
- `frontend/.env`
- JSON da conta de servico em `backend/secrets/`

## 1. Instalar dependencias

Na raiz do projeto, instale as dependencias de cada parte:

```bash
cd backend
npm install
```

```bash
cd ../frontend
npm install
```

## 2. Configurar variaveis de ambiente

Peca comigo os valores corretos do Firebase e coloque nos arquivos:

### Backend

Arquivo: `backend/.env`

Ele deve conter, no minimo:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/nome-do-arquivo.json
FIRESTORE_COLLECTION=games
PORT=3001

# IsThereAnyDeal — preços na PDP
ITAD_API_KEY=
```

Se for rodar a pipeline da IGDB, tambem precisa:

```env
TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
IGDB_TOP_N=100
```

### Frontend

Arquivo: `frontend/.env`

Ele deve conter a config do app Web do Firebase:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=gameprice-bd3ba.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gameprice-bd3ba
VITE_FIREBASE_STORAGE_BUCKET=gameprice-bd3ba.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Depois de alterar qualquer `.env`, reinicie o servidor correspondente.

## 3. Rodar o backend

Em um terminal:

```bash
cd backend
npm run dev
```

A API deve subir em:

```text
http://localhost:3001
```

Rotas principais:

- `GET /health`
- `GET /api/games?page=1&limit=20`
- `GET /api/games/:id`
- `GET /api/games/:id/prices` — ofertas + histórico (ITAD, country=BR)

## 4. Rodar o frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

Abra no navegador:

```text
http://localhost:5173
```

O frontend usa proxy do Vite para chamar o backend em `http://localhost:3001`.

## 5. Fluxo esperado

1. Backend busca jogos no Firestore pela rota `/api/games`.
2. Frontend mostra 20 jogos por pagina.
3. Paginacao navega entre as paginas.
4. Login e cadastro usam Firebase Auth.
5. Quando logado, a navbar mostra o usuario e a opcao de logout.
6. Ao clicar em um jogo, o usuario vai para a PDP em `/games/:id`.
7. A PDP so mostra as informacoes detalhadas se o usuario estiver logado.
8. Na PDP logada, a secao **Preços e ofertas** busca dados do ITAD pelo titulo do jogo.

Teste rapido da API de precos:

```bash
cd backend
npm run test:itad
curl http://localhost:3001/api/games/320140/prices
```

## 6. Autenticacao e acesso a PDP

O frontend usa Firebase Auth com e-mail e senha.

Arquivos principais:

- `frontend/src/config/firebase.js`: inicializa o Firebase Web usando as variaveis `VITE_FIREBASE_*`.
- `frontend/src/context/AuthProvider.jsx`: concentra `login`, `register`, `logout`, `resetPassword` e estado do usuario logado.
- `frontend/src/components/Navbar/Navbar.jsx`: mostra `Entrar`, `Cadastrar` ou, quando logado, o e-mail do usuario e o botao `Sair`.
- `frontend/src/components/AuthModal/AuthModal.jsx`: abre o modal correto (`LoginForm` ou `RegisterForm`).
- `frontend/src/components/LoginForm/LoginForm.jsx`: fluxo de login e recuperacao de senha.
- `frontend/src/components/RegisterForm/RegisterForm.jsx`: fluxo de cadastro.

Fluxo implementado:

1. Usuario anonimo ve a home e a lista de jogos normalmente.
2. Usuario anonimo pode clicar em um jogo e ir para `/games/:id`.
3. Se nao estiver logado, a PDP mostra a mensagem `Faca login para visualizar`.
4. O botao `Entrar` abre o modal de login.
5. Apos login, a PDP carrega os detalhes do jogo pela rota `GET /api/games/:id`.
6. Quando logado, a navbar exibe o usuario e a opcao `Sair`.
7. Ao clicar em `GP GamePrice` no topo, o usuario volta para a home/catalogo.

Para esse fluxo funcionar, o arquivo `frontend/.env` precisa estar preenchido com a config do app Web do Firebase. Fale comigo para pegar o `.env` correto antes de validar login, cadastro e PDP protegida.

No Firebase Console, tambem confirme:

- Authentication > Sign-in method > E-mail/senha ativo.
- Projeto correto: `gameprice-bd3ba`.

## 7. Popular/atualizar jogos no Firestore

Se precisar rodar a pipeline completa da IGDB:

```bash
cd backend
npm run igdb:pipeline
```

Passos separados:

```bash
npm run igdb:01
npm run igdb:02
npm run igdb:03
```

Para sincronizar e remover documentos antigos que nao estao no JSON:

```bash
npm run igdb:03:sync
```
