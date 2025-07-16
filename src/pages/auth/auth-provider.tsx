import { useState, useMemo, type ReactNode } from "react";
import { AuthContext } from "./context";

interface AuthProviderProps {
  defaultIsLogged: boolean;
  children: ReactNode;
}

export const AuthProvider = ({
  defaultIsLogged,
  children,
}: AuthProviderProps) => {
  const [isLogged, setIsLogged] = useState(defaultIsLogged);

  function handleLogin() {
    setIsLogged(true);
  }

  function handleLogout() {
    setIsLogged(false);
  }

  const authValue = useMemo(
    () => ({
      isLogged,
      onLogin: handleLogin,
      onLogout: handleLogout,
    }),
    [isLogged],
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};
