import {
  apiClient,
  removeAuthorizationHeader,
  setAuthorizationHeader,
} from "../../api/client";
import type { Jwt } from "./types-auth";
import type { CredentialUser } from "./types-auth";
import { USER_ENDPOINTS } from "../../utils/endpoints";
import { storage } from "../../utils/storage";

export const login = async (credentials: CredentialUser): Promise<string> => {
  const response = await apiClient.post<Jwt>(USER_ENDPOINTS.LOGIN, credentials);
  const { accessToken } = response.data;
  setAuthorizationHeader(accessToken);
  storage.set("auth", accessToken);
  return accessToken;
};

export const logout = async () => {
  storage.remove("auth");
  removeAuthorizationHeader();
};
