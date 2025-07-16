import type { ReactNode } from "react";
import { useAuth } from "./context";
import { Navigate, useLocation } from "react-router-dom";

interface AuthRouteProps {
  children: ReactNode;
  requireAuth: boolean;
  redirectTo?: string;
}

export const AuthRoute = ({ children, requireAuth, redirectTo }: AuthRouteProps) => {
  const { isLogged } = useAuth();
  const location = useLocation();

  const shouldAllow = requireAuth ? isLogged : !isLogged;
  const fallbackRoute = redirectTo ?? (requireAuth ? "/login" : "/adverts");

  return shouldAllow ? (
    children
  ) : (
    <Navigate to={fallbackRoute} replace state={{ from: location.pathname }} />
  );
};