import { useEffect } from "react";
import Modal from "../Modal/Modal.jsx";
import LoginForm from "../LoginForm/LoginForm.jsx";
import RegisterForm from "../RegisterForm/RegisterForm.jsx";
import { useAuth } from "../../context/AuthProvider.jsx";

export default function AuthModal({ mode, onClose, onSwitchMode }) {
  const { user } = useAuth();
  const open = mode === "login" || mode === "register";

  useEffect(() => {
    if (user && open) {
      onClose();
    }
  }, [user, open, onClose]);

  const title = mode === "register" ? "Criar conta" : "Entrar";
  const titleId = "auth-modal-title";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      labelledBy={titleId}
    >
      {mode === "register" ? (
        <RegisterForm onSwitchToLogin={() => onSwitchMode("login")} />
      ) : (
        <LoginForm onSwitchToRegister={() => onSwitchMode("register")} />
      )}
    </Modal>
  );
}
