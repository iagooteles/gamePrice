import { useCallback, useEffect, useState } from "react";
import { fetchGames, GAMES_PER_PAGE } from "./api/games.js";
import AuthModal from "./components/AuthModal/AuthModal.jsx";
import FirebaseSetupBanner from "./components/FirebaseSetupBanner/FirebaseSetupBanner.jsx";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage.jsx";
import GameGrid from "./components/GameGrid/GameGrid.jsx";
import Header from "./components/Header/Header.jsx";
import Loading from "./components/Loading/Loading.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Pagination from "./components/Pagination/Pagination.jsx";
import "./styles/App.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [games, setGames] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authModal, setAuthModal] = useState(null);

  const loadPage = useCallback(async (targetPage) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGames(targetPage);
      setGames(data.games);
      setPagination(data.pagination);
      setPage(data.pagination.page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message);
      setGames([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(page);
  }, [page, loadPage]);

  const handlePageChange = (nextPage) => {
    if (nextPage === page || nextPage < 1) return;
    if (pagination && nextPage > pagination.totalPages) return;
    setPage(nextPage);
  };

  return (
    <div className="app">
      <Navbar
        onOpenLogin={() => setAuthModal("login")}
        onOpenRegister={() => setAuthModal("register")}
      />

      <AuthModal
        mode={authModal}
        onClose={() => setAuthModal(null)}
        onSwitchMode={setAuthModal}
      />

      <FirebaseSetupBanner />

      <Header
        total={pagination?.total}
        perPage={GAMES_PER_PAGE}
        currentPage={pagination?.page}
        totalPages={pagination?.totalPages}
      />

      <main className="app__main">
        {error && <ErrorMessage message={error} onRetry={() => loadPage(page)} />}

        {loading && !error && <Loading />}

        {!loading && !error && (
          <>
            <GameGrid games={games} />
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
      </main>
    </div>
  );
}
