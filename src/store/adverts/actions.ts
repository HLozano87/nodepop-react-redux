import type { AppThunk } from "..";
import {
  createdAdvert,
  getAdvertsList,
  getAdvertTags,
  getAdvertById,
} from "../../pages/adverts/services";
import type { Advert } from "../../pages/adverts/type-advert";
import { deleteAdvert } from "../../pages/adverts/services";

/**
 * ACTIONS TYPE
 */

type AdvertsLoadedPending = { type: "adverts/loaded/pending" };
type AdvertsLoadedFulfilled = {
  type: "adverts/loaded/fulfilled";
  payload: Advert[];
};
type AdvertsLoadedRejected = {
  type: "adverts/loaded/rejected";
  error: Error;
};

type AdvertsCreatedPending = { type: "adverts/created/pending" };
type AdvertsCreatedFulfilled = {
  type: "adverts/created/fulfilled";
  payload: Advert;
};
type AdvertsCreatedRejected = {
  type: "adverts/created/rejected";
  error: Error;
};

type AdvertsTagsPending = {
  type: "adverts/tags/pending";
};
type AdvertsTagsFulfilled = {
  type: "adverts/tags/fulfilled";
  payload: string[];
};
type AdvertsTagsRejected = {
  type: "adverts/tags/rejected";
  error: Error;
};

type AdvertSelectedPending = {
  type: "adverts/selected/pending";
};
type AdvertSelectedFulfilled = {
  type: "adverts/selected/fulfilled";
  payload: Advert;
};
type AdvertSelectedRejected = {
  type: "adverts/selected/rejected";
  error: Error;
};

type AdvertDeletedPending = { type: "adverts/deleted/pending" };
type AdvertDeletedFulfilled = {
  type: "adverts/deleted/fulfilled";
  payload: string;
};
type AdvertDeletedRejected = {
  type: "adverts/deleted/rejected";
  error: Error;
};

// ACTIONS LOADED

export const advertsLoadedPending = (): AdvertsLoadedPending => ({
  type: "adverts/loaded/pending",
});

export const advertsLoadedFulfilled = (
  adverts: Advert[],
): AdvertsLoadedFulfilled => ({
  type: "adverts/loaded/fulfilled",
  payload: adverts,
});

export const advertsLoadedRejected = (error: Error): AdvertsLoadedRejected => ({
  type: "adverts/loaded/rejected",
  error: error instanceof Error ? error : new Error(String(error)),
});

// ACTIONS CREATED

export const advertsCreatedPending = (): AdvertsCreatedPending => ({
  type: "adverts/created/pending",
});

export const advertsCreatedFulfilled = (
  advert: Advert,
): AdvertsCreatedFulfilled => ({
  type: "adverts/created/fulfilled",
  payload: advert,
});

export const advertsCreatedRejected = (
  error: Error,
): AdvertsCreatedRejected => ({
  type: "adverts/created/rejected",
  error: error instanceof Error ? error : new Error(String(error)),
});

// ACTIONS TAGS

export const advertsTagsPending = (): AdvertsTagsPending => ({
  type: "adverts/tags/pending",
});

export const advertsTagsFulfilled = (tags: string[]): AdvertsTagsFulfilled => ({
  type: "adverts/tags/fulfilled",
  payload: tags,
});

export const advertsTagsRejected = (error: Error): AdvertsTagsRejected => ({
  type: "adverts/tags/rejected",
  error: error instanceof Error ? error : new Error(String(error)),
});

// ACTIONS SELECTED

export const advertSelectedPending = (): AdvertSelectedPending => ({
  type: "adverts/selected/pending",
});
export const advertSelectedFulfilled = (
  advert: Advert,
): AdvertSelectedFulfilled => ({
  type: "adverts/selected/fulfilled",
  payload: advert,
});
export const advertSelectedRejected = (error: Error): AdvertSelectedRejected => ({
  type: "adverts/selected/rejected",
  error: error instanceof Error ? error : new Error(String(error)),
});

// ACTIONS DELETED

export const advertDeletedPending = (): AdvertDeletedPending => ({
  type: "adverts/deleted/pending",
});

export const advertDeletedFulfilled = (
  id: string,
): AdvertDeletedFulfilled => ({
  type: "adverts/deleted/fulfilled",
  payload: id,
});

export const advertDeletedRejected = (
  error: Error,
): AdvertDeletedRejected => ({
  type: "adverts/deleted/rejected",
  error: error instanceof Error ? error : new Error(String(error)),
});

/**
 * THUNKS
 */

export const advertsLoaded = (): AppThunk<Promise<void>> => {
  return async (dispatch, getState) => {
    const { adverts } = getState();
    if (adverts.adverts && adverts.adverts.length > 0) return;

    dispatch(advertsLoadedPending());
    try {
      const adverts = await getAdvertsList();
      dispatch(advertsLoadedFulfilled(adverts));
    } catch (error) {
      dispatch(advertsLoadedRejected(error as Error));
      throw error;
    }
  };
};

export const advertsCreated = (
  formData: FormData,
): AppThunk<Promise<Advert>> => {
  return async (dispatch) => {
    dispatch(advertsCreatedPending());
    try {
      const advert = await createdAdvert(formData);
      dispatch(advertsCreatedFulfilled(advert));
      return advert;
    } catch (error) {
      dispatch(advertsCreatedRejected(error as Error));
      throw error;
    }
  };
};

export const advertsTagsLoaded = (): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    dispatch(advertsTagsPending());
    try {
      const tags = await getAdvertTags();
      dispatch(advertsTagsFulfilled(tags));
    } catch (error) {
      dispatch(advertsTagsRejected(error as Error));
      console.error("Error loading tags", error);
    }
  };
};

export const advertLoadedById = (advertId: string): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    dispatch(advertSelectedPending());
    try {
      const advert = await getAdvertById(advertId);
      dispatch(advertSelectedFulfilled(advert));
    } catch (error) {
      dispatch(advertDeletedRejected(error as Error));
      console.error("Error loading advert detail", error);
    }
  };
};

export const advertDeleted = (id: string): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    dispatch(advertDeletedPending());
    try {
      await deleteAdvert(id);
      dispatch(advertDeletedFulfilled(id));
    } catch (error) {
      dispatch(advertDeletedRejected(error as Error));
      throw error;
    }
  };
};

export type AdvertActions =
  | AdvertsLoadedPending
  | AdvertsLoadedFulfilled
  | AdvertsLoadedRejected
  | AdvertsCreatedPending
  | AdvertsCreatedFulfilled
  | AdvertsCreatedRejected
  | AdvertsTagsPending
  | AdvertsTagsFulfilled
  | AdvertsTagsRejected
  | AdvertSelectedPending
  | AdvertSelectedFulfilled
  | AdvertSelectedRejected
  | AdvertDeletedPending
  | AdvertDeletedFulfilled
  | AdvertDeletedRejected;
