import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthProvider.jsx";
import "./Navbar.css";

function userInitial(email) {
  const local = email?.split("@")[0] ?? "?";
  return local.charAt(0).toUpperCase();
}

function Navbar({ onOpenLogin, onOpenRegister, onGoHome }) {
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

  let actions;
  if (initializing) {
    actions = <span className="navbar__status">…</span>;
  } else if (user) {
    actions = (
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
    );
  } else if (configured) {
    actions = (
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
    );
  } else {
    actions = (
      <span className="navbar__status" title="Configure frontend/.env">
        Auth off
      </span>
    );
  }

  return (
    <nav className="navbar" aria-label="Principal">
      <div className="navbar__inner">
        <a
          href="/"
          className="navbar__brand"
          onClick={(e) => {
            e.preventDefault();
            onGoHome?.();
          }}
        >
          <span className="navbar__logo" aria-hidden="true">
            <span className="navbar__logo-letter navbar__logo-letter--g">G</span>
            <span className="navbar__logo-spark" />
            <span className="navbar__logo-letter navbar__logo-letter--p">P</span>
          </span>
          <span className="navbar__name">GamePrice</span>
        </a>

        <div className="navbar__actions">{actions}</div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  onOpenLogin: PropTypes.func.isRequired,
  onOpenRegister: PropTypes.func.isRequired,
  onGoHome: PropTypes.func.isRequired,
};

export default Navbar;
