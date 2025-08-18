import type { AuthActions } from "./actions";

export type AuthState = {
  auth: boolean;
};

const defaultState: AuthState = {
  auth: false,
};

export const auth = (
  state = defaultState.auth,
  action: AuthActions,
): AuthState["auth"] => {
  switch (action.type) {
    case "auth/login/fulfilled":
      return true;
    case "auth/logout":
      return false;
    default:
      return state;
  }
};
