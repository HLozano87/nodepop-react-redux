import type { Advert } from "../pages/adverts/type-advert";
import type { Actions } from "./actions";

export type State = {
  auth: boolean;
  adverts: Advert[];
};

const defaultState: State = {
  auth: false,
  adverts: [],
};

// export function reducer(state = defaultState, action: Actions): State {
//   switch (action.type) {
//     case "auth/login":
//       return { ...state, auth: true };
//     case "auth/logout":
//       return { ...state, auth: false };
//     case "adverts/loaded":
//       return { ...state, adverts: action.payload };
//     case "adverts/created":
//       return { ...state, adverts: [...state.adverts, action.payload] };
//     default:
//       return state;
//   }
// }

export const auth = (state = defaultState.auth, action: Actions): boolean => {
  return action.type === "auth/login"
    ? true
    : action.type === "auth/logout"
      ? false
      : state;
};

export const adverts = (
  state = defaultState.adverts,
  action: Actions,
): Advert[] => {
  return action.type === "adverts/loaded"
    ? action.payload
    : action.type === "adverts/created"
      ? [...state, action.payload]
      : state;
};

// export const reducer = (state = defaultState, action: Actions): State => {
//   return {
//     auth: auth(state.auth, action),
//     adverts: adverts(state.adverts, action),
//   };
// };

// export const reducer = combineReducers({
//   auth,
//   adverts,
// });
