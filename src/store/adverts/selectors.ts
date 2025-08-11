import type { RootState } from "..";

export const getAdverts = (state: RootState) => state.adverts.adverts ?? [];
export const getTags = (state: RootState) => state.adverts.tags;
export const getSelectedAdvert = (state: RootState) => state.adverts.selectedAdvert;
export const getAdvertsLoading = (state: RootState) => state.adverts.loading;
export const getAdvertsError = (state: RootState) => state.adverts.error;

export const getAdvertById = (advertId?: string) => {
  return (state: RootState) =>
    state.adverts.adverts?.find((advert) => advert.id === advertId);
};