import type { AuthActions } from "./actions";

export type State = {
  auth: boolean;
};

const defaultState: State = {
  auth: false,
};

export const auth = (
  state = defaultState.auth,
  action: AuthActions,
): State["auth"] => {
  switch (action.type) {
    case "auth/login/fulfilled":
      return true;
    case "auth/logout":
      return false;
    default:
      return state;
  }
};
