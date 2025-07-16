import { login, logout } from "./service";
import { apiClient, removeAuthorizationHeader, setAuthorizationHeader } from "../../api/client";
import { storage } from "../../utils/storage";
import { USER_ENDPOINTS } from "../../utils/endpoints";
import type { CredentialUser, Jwt } from "./types-auth";

vi.mock("../../api/client", () => ({
  apiClient: {
    post: vi.fn(),
  },
  setAuthorizationHeader: vi.fn(),
  removeAuthorizationHeader: vi.fn(),
}));

vi.mock("../../utils/storage", () => ({
  storage: {
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe("Auth Service", () => {
  const mockCredentials: CredentialUser = {
    email: "user@example.com",
    password: "password123",
  };

  const mockToken: Jwt = {
    accessToken: "fake.jwt.token",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("login() should call apiClient.post, set header, store token and return it", async () => {
    (apiClient.post as any).mockResolvedValueOnce({ data: mockToken });

    const token = await login(mockCredentials);

    expect(apiClient.post).toHaveBeenCalledWith(USER_ENDPOINTS.LOGIN, mockCredentials);
    expect(setAuthorizationHeader).toHaveBeenCalledWith(mockToken.accessToken);
    expect(storage.set).toHaveBeenCalledWith("auth", mockToken.accessToken);
    expect(token).toBe(mockToken.accessToken);
  });

  it("logout() should remove token and clear header", async () => {
    await logout();

    expect(storage.remove).toHaveBeenCalledWith("auth");
    expect(removeAuthorizationHeader).toHaveBeenCalled();
  });
});