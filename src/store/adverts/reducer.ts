import type { Advert } from "../../pages/adverts/type-advert";
import type { AdvertActions } from "./actions";

export type State = {
  adverts: Advert[] | null;
  tags: string[];
  selectedAdvert: Advert | null;
  loading: boolean;
  error: string | null;
};

const defaultState: State = {
  adverts: null,
  tags: [],
  selectedAdvert: null,
  loading: false,
  error: null,
};

export const adverts = (
  state: State = defaultState,
  action: AdvertActions,
): State => {
  switch (action.type) {
    /**
     * Case Loaded
     */
    case "adverts/loaded/pending":
      return { ...state, loading: true, error: null };
    case "adverts/loaded/fulfilled":
      return { ...state, adverts: action.payload, loading: false };
    case "adverts/loaded/rejected":
      return { ...state, loading: false, error: action.error.message };

    /**
     * Case Created
     */
    case "adverts/created/pending":
      return { ...state, loading: true, error: null };
    case "adverts/created/fulfilled":
      return {
        ...state,
        adverts: [action.payload, ...(state.adverts ?? [])],
        loading: false,
      };
    case "adverts/created/rejected":
      return { ...state, loading: false, error: action.error.message };

    /**
     * Case Tags
     */
    case "adverts/tags/pending":
      return { ...state, loading: true, error: null };
    case "adverts/tags/fulfilled":
      return { ...state, tags: action.payload, error: null };
    case "adverts/tags/rejected":
      return {
        ...state,
        loading: false,
        error: action.error.message,
      };
    /**
     * Case Selected
     */
    case "adverts/selected/pending":
      return { ...state, loading: true, error: null, selectedAdvert: null };
    case "adverts/selected/fulfilled":
      return { ...state, loading: false, selectedAdvert: action.payload };
    case "adverts/selected/rejected":
      return { ...state, loading: false, error: action.error.message };
    /**
     * Case Delete
     */
    case "adverts/deleted/pending":
      return { ...state, loading: true, error: null };
    case "adverts/deleted/fulfilled":
      return {
        ...state,
        adverts: state.adverts
          ? state.adverts.filter((advert) => advert.id !== action.payload)
          : null,
        loading: false,
        error: null,
      };
    case "adverts/deleted/rejected":
      return { ...state, loading: false, error: action.error.message };

    default:
      return state;
  }
};
