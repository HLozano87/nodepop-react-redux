import type { Advert } from "../../pages/adverts/type-advert";
import type { AdvertActions } from "./actions";

export type AdvertsState = {
  adverts: Advert[] | null;
  tags: string[];
  selectedAdvert: Advert | null;
  loading: boolean;
  error: string | null;
};

const defaultState: AdvertsState = {
  adverts: null,
  tags: [],
  selectedAdvert: null,
  loading: false,
  error: null,
};

const handleError = (error: unknown, defaultMessage: string) =>
  (error as Error | undefined)?.message ?? defaultMessage;

export const adverts = (
  state: AdvertsState = defaultState,
  action: AdvertActions
): AdvertsState => {
  switch (action.type) {
    // LOADED
    case "adverts/loaded/pending":
      return { ...state, loading: true, error: null };
    case "adverts/loaded/fulfilled":
      return { ...state, adverts: action.payload, loading: false };
    case "adverts/loaded/rejected":
      return { ...state, loading: false, error: handleError(action.error, "Error loading adverts") };

    // CREATED
    case "adverts/created/pending":
      return { ...state, loading: true, error: null };
    case "adverts/created/fulfilled":
      return {
        ...state,
        adverts: [action.payload, ...(state.adverts ?? [])],
        loading: false,
      };
    case "adverts/created/rejected":
      return { ...state, loading: false, error: handleError(action.error, "Error creating advert") };

    // TAGS
    case "adverts/tags/pending":
      return { ...state, loading: true, error: null };
    case "adverts/tags/fulfilled":
      return { ...state, loading: false, tags: action.payload, error: null };
    case "adverts/tags/rejected":
      return { ...state, loading: false, error: handleError(action.error, "Error fetching tags") };

    // SELECTED
    case "adverts/selected/pending":
      return { ...state, loading: true, error: null, selectedAdvert: null };
    case "adverts/selected/fulfilled":
      return { ...state, loading: false, selectedAdvert: action.payload };
    case "adverts/selected/rejected":
      return { ...state, loading: false, error: handleError(action.error, "Error advert does not exist") };

    // DELETED
    case "adverts/deleted/pending":
      return { ...state, loading: true, error: null };
    case "adverts/deleted/fulfilled": {
      if (!state.adverts) return { ...state, adverts: null, loading: false, error: null };
      const updatedAdverts = state.adverts.filter(advert => advert.id !== action.payload);
      return { ...state, adverts: updatedAdverts, loading: false, error: null };
    }
    case "adverts/deleted/rejected":
      return { ...state, loading: false, error: handleError(action.error, "Error deleting advert") };

    default:
      return state;
  }
};