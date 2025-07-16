import { apiClient } from "../../api/client";
import { USER_ENDPOINTS } from "../../utils/endpoints";
import type { AuthUser, SignUp } from "../auth/types-auth";

export const createdUser = async (credentials: SignUp) => {
  try {
    const response = await apiClient.post<AuthUser>(
      USER_ENDPOINTS.SIGNUP,
      credentials,
    );
    return response.data;
  } catch (error) {
    console.error("Error durante la creacion de usuario: ", error);
  }
};
