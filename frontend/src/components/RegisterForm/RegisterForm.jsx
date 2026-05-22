import { useState } from "react";
import { useAuth } from "../../context/AuthProvider.jsx";
import "../AuthForm/AuthForm.css";

export default function RegisterForm({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password || !confirm) {
      setError("Preencha todos os campos.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <p className="auth-form__subtitle">Cadastre-se com e-mail e senha.</p>

      <div className="auth-form__field">
        <label className="auth-form__label" htmlFor="register-email">
          E-mail
        </label>
        <input
          id="register-email"
          className="auth-form__input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
        />
      </div>

      <div className="auth-form__field">
        <label className="auth-form__label" htmlFor="register-password">
          Senha
        </label>
        <input
          id="register-password"
          className="auth-form__input"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <div className="auth-form__field">
        <label className="auth-form__label" htmlFor="register-confirm">
          Confirmar senha
        </label>
        <input
          id="register-confirm"
          className="auth-form__input"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repita a senha"
        />
      </div>

      {error && (
        <p className="auth-form__error" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="auth-form__submit"
        disabled={loading}
      >
        {loading ? "Cadastrando…" : "Cadastrar"}
      </button>

      <div className="auth-form__footer">
        <button
          type="button"
          className="auth-form__link"
          onClick={onSwitchToLogin}
        >
          Já tem conta? Entrar
        </button>
      </div>
    </form>
  );
}
