import { useState } from "react";
import { useAuth } from "../../context/AuthProvider.jsx";
import "../AuthForm/AuthForm.css";

export default function LoginForm({ onSwitchToRegister }) {
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (!email.trim() || !password) {
      setIsError(true);
      setMessage("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setMessage(null);
    if (!email.trim()) {
      setIsError(true);
      setMessage("Digite seu e-mail para recuperar a senha.");
      return;
    }
    try {
      await resetPassword(email);
      setIsError(false);
      setMessage("E-mail de recuperação enviado. Verifique sua caixa de entrada.");
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <p className="auth-form__subtitle">Use seu e-mail e senha para acessar.</p>

      <div className="auth-form__field">
        <label className="auth-form__label" htmlFor="login-email">
          E-mail
        </label>
        <input
          id="login-email"
          className="auth-form__input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
        />
      </div>

      <div className="auth-form__field">
        <label className="auth-form__label" htmlFor="login-password">
          Senha
        </label>
        <input
          id="login-password"
          className="auth-form__input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      {message && (
        <p
          className={isError ? "auth-form__error" : "auth-form__success"}
          role="alert"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        className="auth-form__submit"
        disabled={loading}
      >
        {loading ? "Entrando…" : "Entrar"}
      </button>

      <div className="auth-form__footer">
        <button
          type="button"
          className="auth-form__link"
          onClick={onSwitchToRegister}
        >
          Não tem conta? Cadastre-se
        </button>
        <button
          type="button"
          className="auth-form__link auth-form__link--muted"
          onClick={handleResetPassword}
        >
          Esqueci minha senha
        </button>
      </div>
    </form>
  );
}
