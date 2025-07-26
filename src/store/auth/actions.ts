import type { AppThunk } from "..";
import { login } from "../../pages/auth/service";
import type { CredentialUser } from "../../pages/auth/types-auth";

// Tipos de Acciones
type AuthLoginPending = {
  type: "auth/login/pending";
};
type AuthLoginFulfilled = {
  type: "auth/login/fulfilled";
  payload: string;
};
type AuthLoginRejected = {
  type: "auth/login/rejected";
  payload: Error;
};
type AuthLogout = {
  type: "auth/logout";
};

export const AuthLoginPending = (): AuthLoginPending => ({
  type: "auth/login/pending",
});
export const AuthLoginFulfilled = (token: string): AuthLoginFulfilled => ({
  type: "auth/login/fulfilled",
  payload: token,
});
export const AuthLoginRejected = (error: Error): AuthLoginRejected => ({
  type: "auth/login/rejected",
  payload: error,
});

export const authLogin = (
  credentials: CredentialUser,
): AppThunk<Promise<string>> => {
  return async (dispatch) => {
    dispatch(AuthLoginPending());
    try {
      const token = await login(credentials);
      dispatch(AuthLoginFulfilled(token));
      return token;
    } catch (error) {
      if (error instanceof Error) {
        dispatch(AuthLoginRejected(error));
      }
      throw error;
    }
  };
};

export const authLogout = (): AuthLogout => ({
  type: "auth/logout",
});

export type Actions =
  | AuthLoginPending
  | AuthLoginFulfilled
  | AuthLoginRejected
  | AuthLogout;
