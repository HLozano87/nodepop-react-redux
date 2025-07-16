import type { Advert } from "../pages/adverts/type-advert";


// Tipos de Acciones
type AuthLogin = {
  type: "auth/login";
};
type AuthLogout = {
  type: "auth/logout";
};

type AdvertsLoaded = {
  type: "adverts/loaded";
  payload: Advert[];
};

type AdvertsCreated = {
  type: "adverts/created";
  payload: Advert;
};

export const authLogin = (): AuthLogin => ({
  type: "auth/login",
});

export const authLogout = (): AuthLogout => ({
  type: "auth/logout",
});

export const advertsLoaded = (adverts: Advert[]): AdvertsLoaded => ({
  type: "adverts/loaded",
  payload: adverts,
});

export const advertsCreated = (advert: Advert): AdvertsCreated => ({
  type: "adverts/created",
  payload: advert,
});

export type Actions = AuthLogin | AuthLogout | AdvertsLoaded | AdvertsCreated;
