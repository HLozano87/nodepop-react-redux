import { useAppDispatch, useAppSelector } from "..";

import {
  advertsLoaded,
  advertsCreated,
  advertsTagsLoaded,
  advertLoadedById,
  advertDeleted,
} from "./actions";
import {
  getAdverts,
  getTags,
  getSelectedAdvert,
  getAdvertsLoading,
  getAdvertsError,
  getAdvertById,
} from "./selectors";

// Hooks for access to state
export const useAdverts = () => useAppSelector(getAdverts);
export const useTags = () => useAppSelector(getTags);
export const useSelectedAdvert = () => useAppSelector(getSelectedAdvert);
export const useAdvertById = (id?: string) => useAppSelector(getAdvertById(id));
export const useAdvertsLoading = () => useAppSelector(getAdvertsLoading);
export const useAdvertsError = () => useAppSelector(getAdvertsError);

// Hook for actions
export const useAdvertsActions = () => {
  const dispatch = useAppDispatch();

  return {
    loadAdverts: () => dispatch(advertsLoaded()),
    createAdvert: (formData: FormData) => dispatch(advertsCreated(formData)),
    loadTags: () => dispatch(advertsTagsLoaded()),
    advertLoadedById: (id: string) => dispatch(advertLoadedById(id)),
    deleteAdvert: (id: string) => dispatch(advertDeleted(id)),
  };
};
