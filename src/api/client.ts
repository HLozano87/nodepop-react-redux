import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("auth");
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export const setAuthorizationHeader = (accessToken: string) => {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

export const removeAuthorizationHeader = () => {
  delete apiClient.defaults.headers.common["Authorization"];
};
