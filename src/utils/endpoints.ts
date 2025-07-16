export const USER_ENDPOINTS = {
  SIGNUP: "/api/auth/signup",
  LOGIN: "/api/auth/login",
  AUTH: "/api/auth/me",
};

export const ADVERT_ENDPOINT = {
  TAGS: "/api/v1/adverts/tags",
  ADVERT: "/api/v1/adverts",
  ADVERT_ID: (id: string) => `/api/v1/adverts/${id}`,
};
