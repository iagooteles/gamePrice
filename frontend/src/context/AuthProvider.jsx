import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirebaseAuth,
  isFirebaseConfigured,
  missingFirebaseEnv,
} from "../config/firebase.js";
import { getAuthErrorCode, mapAuthError } from "../utils/mapAuthError.js";

const AuthContext = createContext(undefined);

const noopAuth = async () => {
  throw new Error(
    "Firebase não configurado. Preencha frontend/.env e reinicie npm run dev."
  );
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setInitializing(false);
      return;
    }

    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email.trim(),
        password
      );
    } catch (error) {
      throw new Error(mapAuthError(getAuthErrorCode(error)));
    }
  }, []);

  const register = useCallback(async (email, password) => {
    try {
      await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        email.trim(),
        password
      );
    } catch (error) {
      throw new Error(mapAuthError(getAuthErrorCode(error)));
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(getFirebaseAuth());
  }, []);

  const resetPassword = useCallback(async (email) => {
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
    } catch (error) {
      throw new Error(mapAuthError(getAuthErrorCode(error)));
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      configured: isFirebaseConfigured,
      missingEnv: missingFirebaseEnv,
      login: isFirebaseConfigured ? login : noopAuth,
      register: isFirebaseConfigured ? register : noopAuth,
      logout: isFirebaseConfigured ? logout : noopAuth,
      resetPassword: isFirebaseConfigured ? resetPassword : noopAuth,
    }),
    [
      user,
      initializing,
      login,
      register,
      logout,
      resetPassword,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
