import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store";

interface AuthRouteProps {
  children: ReactNode;
  requireAuth: boolean;
  redirectTo?: string;
}

export const AuthRoute = ({
  children,
  requireAuth,
  redirectTo,
}: AuthRouteProps) => {
  const isLogged = useAppSelector((state) => state.auth);
  const location = useLocation();

  const shouldAllow = requireAuth ? isLogged : !isLogged;
  const fallbackRoute = redirectTo ?? (requireAuth ? "/login" : "/adverts");

  return shouldAllow ? (
    children
  ) : (
    <Navigate to={fallbackRoute} replace state={{ from: location.pathname }} />
  );
};
