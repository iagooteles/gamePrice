import { useCallback, useEffect, useState } from "react";
import { fetchGameById, fetchGames, GAMES_PER_PAGE } from "./api/games.js";
import { fetchGamePrices } from "./api/prices.js";
import AuthModal from "./components/AuthModal/AuthModal.jsx";
import FirebaseSetupBanner from "./components/FirebaseSetupBanner/FirebaseSetupBanner.jsx";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage.jsx";
import GameDetail from "./components/GameDetail/GameDetail.jsx";
import GameGrid from "./components/GameGrid/GameGrid.jsx";
import Header from "./components/Header/Header.jsx";
import Loading from "./components/Loading/Loading.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Pagination from "./components/Pagination/Pagination.jsx";
import { useAuth } from "./context/AuthProvider.jsx";
import "./styles/App.css";

function getRouteFromLocation() {
  const match = /^\/games\/([^/]+)\/?$/.exec(globalThis.location.pathname);
  if (match) {
    return {
      name: "detail",
      gameId: decodeURIComponent(match[1]),
    };
  }

  return { name: "home" };
}

export default function App() {
  const { user, initializing: authInitializing } = useAuth();
  const [route, setRoute] = useState(getRouteFromLocation);
  const [page, setPage] = useState(1);
  const [games, setGames] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailGame, setDetailGame] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [pricesData, setPricesData] = useState(null);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [pricesError, setPricesError] = useState(null);
  const [authModal, setAuthModal] = useState(null);

  const closeAuthModal = useCallback(() => setAuthModal(null), []);

  useEffect(() => {
    document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const loadPage = useCallback(async (targetPage) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGames(targetPage);
      setGames(data.games);
      setPagination(data.pagination);
      setPage(data.pagination.page);
      globalThis.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message);
      setGames([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => setRoute(getRouteFromLocation());
    globalThis.addEventListener("popstate", handlePopState);
    return () => globalThis.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (route.name !== "home") return;
    loadPage(page);
  }, [page, loadPage, route.name]);

  const loadGamePrices = useCallback(async (gameId) => {
    setPricesLoading(true);
    setPricesError(null);
    setPricesData(null);
    try {
      const data = await fetchGamePrices(gameId);
      setPricesData(data);
    } catch (err) {
      setPricesError(err.message);
    } finally {
      setPricesLoading(false);
    }
  }, []);

  const loadGameDetail = useCallback(async (gameId) => {
    setDetailLoading(true);
    setDetailError(null);
    setDetailGame(null);
    setPricesData(null);
    setPricesError(null);
    setPricesLoading(false);
    try {
      const game = await fetchGameById(gameId);
      setDetailGame(game);
      globalThis.scrollTo({ top: 0, behavior: "smooth" });
      loadGamePrices(gameId);
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  }, [loadGamePrices]);

  useEffect(() => {
    if (route.name !== "detail") return;
    if (authInitializing || !user) {
      setDetailGame(null);
      setDetailError(null);
      setDetailLoading(false);
      return;
    }
    loadGameDetail(route.gameId);
  }, [authInitializing, loadGameDetail, route, user]);

  const handlePageChange = (nextPage) => {
    if (nextPage === page || nextPage < 1) return;
    if (pagination && nextPage > pagination.totalPages) return;
    setPage(nextPage);
  };

  const handleGameClick = (game) => {
    const id = game.id ?? game.igdbId;
    if (!id) return;

    const nextPath = `/games/${encodeURIComponent(id)}`;
    globalThis.history.pushState(null, "", nextPath);
    setRoute({ name: "detail", gameId: String(id) });
  };

  const handleBackToCatalog = () => {
    globalThis.history.pushState(null, "", "/");
    setRoute({ name: "home" });
  };

  const isHome = route.name === "home";

  return (
    <div className="app">
      <Navbar
        onOpenLogin={() => setAuthModal("login")}
        onOpenRegister={() => setAuthModal("register")}
        onGoHome={handleBackToCatalog}
      />

      <AuthModal
        mode={authModal}
        onClose={closeAuthModal}
        onSwitchMode={setAuthModal}
      />

      <FirebaseSetupBanner />

      {isHome && (
        <Header
          total={pagination?.total}
          perPage={GAMES_PER_PAGE}
          currentPage={pagination?.page}
          totalPages={pagination?.totalPages}
        />
      )}

      <main className="app__main">
        {isHome && (
          <>
            {error && (
              <ErrorMessage message={error} onRetry={() => loadPage(page)} />
            )}

            {loading && !error && <Loading />}

            {!loading && !error && (
              <>
                <GameGrid games={games} onGameClick={handleGameClick} />
                {pagination && pagination.totalPages > 1 && (
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    hasPrev={pagination.hasPrev}
                    hasNext={pagination.hasNext}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}

        {!isHome && (
          <>
            {authInitializing && <Loading />}

            {!authInitializing && !user && (
              <section className="login-required">
                <h1>Faça login para visualizar</h1>
                <p>
                  As informações detalhadas do jogo estão disponíveis apenas
                  para usuários logados.
                </p>
                <div className="login-required__actions">
                  <button
                    type="button"
                    className="login-required__primary"
                    onClick={() => setAuthModal("login")}
                  >
                    Entrar
                  </button>
                  <button
                    type="button"
                    className="login-required__secondary"
                    onClick={handleBackToCatalog}
                  >
                    Voltar para o catálogo
                  </button>
                </div>
              </section>
            )}

            {!authInitializing && user && detailError && (
              <ErrorMessage
                message={detailError}
                onRetry={() => loadGameDetail(route.gameId)}
              />
            )}

            {!authInitializing && user && detailLoading && !detailError && (
              <Loading />
            )}

            {!authInitializing && user && !detailLoading && !detailError && detailGame && (
              <GameDetail
                game={detailGame}
                onBack={handleBackToCatalog}
                prices={pricesData}
                pricesLoading={pricesLoading}
                pricesError={pricesError}
                onRetryPrices={() => loadGamePrices(route.gameId)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
