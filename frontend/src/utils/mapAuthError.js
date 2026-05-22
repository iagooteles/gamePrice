import { FirebaseError } from "firebase/app";

export function getAuthErrorCode(error) {
  return error instanceof FirebaseError ? error.code : "";
}

export function mapAuthError(code) {
  const messages = {
    "auth/invalid-email": "E-mail inválido.",
    "auth/user-disabled": "Esta conta foi desativada.",
    "auth/user-not-found": "Não encontramos uma conta com este e-mail.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/email-already-in-use": "Este e-mail já está em uso.",
    "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
    "auth/network-request-failed": "Falha de rede. Verifique sua conexão.",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
    "auth/operation-not-allowed":
      'Login por e-mail/senha não está ativo. No Console Firebase: Authentication → Sign-in method → ative "E-mail/senha".',
  };

  return (
    messages[code] ??
    (code
      ? `Erro do Firebase (${code}). Verifique o Console do projeto.`
      : "Não foi possível concluir a operação. Tente de novo.")
  );
}
