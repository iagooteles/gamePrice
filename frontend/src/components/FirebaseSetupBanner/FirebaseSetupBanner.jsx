import { useAuth } from "../../context/AuthProvider.jsx";
import "./FirebaseSetupBanner.css";

export default function FirebaseSetupBanner() {
  const { configured, missingEnv } = useAuth();

  if (configured) return null;

  return (
    <div className="firebase-setup" role="status">
      <p className="firebase-setup__title">Auth Firebase não configurado</p>
      <p className="firebase-setup__text">
        Crie o arquivo <code>frontend/.env</code> (copie de{" "}
        <code>.env.example</code>) e preencha as chaves do app <strong>Web</strong>{" "}
        no projeto <strong>gameprice-bd3ba</strong>. Depois reinicie o Vite.
      </p>
      {missingEnv.length > 0 && (
        <p className="firebase-setup__missing">
          Variáveis vazias: {missingEnv.join(", ")}
        </p>
      )}
      <a
        className="firebase-setup__link"
        href="https://console.firebase.google.com/project/gameprice-bd3ba/settings/general"
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir Console Firebase →
      </a>
    </div>
  );
}
