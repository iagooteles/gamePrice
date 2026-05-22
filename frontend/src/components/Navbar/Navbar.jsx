import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthProvider.jsx";
import "./Navbar.css";

function userInitial(email) {
  const local = email?.split("@")[0] ?? "?";
  return local.charAt(0).toUpperCase();
}

export default function Navbar({ onOpenLogin, onOpenRegister }) {
  const { user, initializing, configured, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      setMenuOpen(false);
    } catch {
      /* signOut raramente falha no cliente */
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <nav className="navbar" aria-label="Principal">
      <div className="navbar__inner">
        <a href="/" className="navbar__brand" onClick={(e) => e.preventDefault()}>
          <span className="navbar__logo" aria-hidden="true">
            GP
          </span>
          <span className="navbar__name">GamePrice</span>
        </a>

        <div className="navbar__actions">
          {initializing ? (
            <span className="navbar__status">…</span>
          ) : user ? (
            <div className="navbar__user-menu" ref={menuRef}>
              <button
                type="button"
                className="navbar__user-trigger"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                aria-label={`Conta de ${user.email}`}
              >
                <span className="navbar__avatar" aria-hidden="true">
                  {userInitial(user.email)}
                </span>
                <span className="navbar__user-email">{user.email}</span>
              </button>

              {menuOpen && (
                <div className="navbar__dropdown" role="menu">
                  <p className="navbar__dropdown-email">{user.email}</p>
                </div>
              )}

              <button
                type="button"
                className="navbar__btn navbar__btn--logout"
                onClick={handleLogout}
                disabled={loggingOut}
                aria-label="Sair da conta"
              >
                {loggingOut ? "Saindo…" : "Sair"}
              </button>
            </div>
          ) : configured ? (
            <>
              <button
                type="button"
                className="navbar__btn navbar__btn--ghost"
                onClick={onOpenLogin}
              >
                Entrar
              </button>
              <button
                type="button"
                className="navbar__btn navbar__btn--primary"
                onClick={onOpenRegister}
              >
                Cadastrar
              </button>
            </>
          ) : (
            <span className="navbar__status" title="Configure frontend/.env">
              Auth off
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
