import { createdUser } from "../signup/service";
import { apiClient } from "../../api/client";
import { USER_ENDPOINTS } from "../../utils/endpoints";
import type { AuthUser, SignUp } from "../auth/types-auth";
import type { Mock } from "vitest";

// Mockea apiClient.post
vi.mock("../../api/client", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe("createdUser", () => {
  const mockCredentials: SignUp = {
    email: "user@example.com",
    password: "password123",
    username: "testuser",
    name: "user",
  };

  const mockResponse: AuthUser = {
    id: "123",
    email: "user@example.com",
    username: "testuser",
    createdAt: "token123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should call apiClient.post with correct URL and credentials", async () => {
    (apiClient.post as Mock).mockResolvedValueOnce({ data: mockResponse });

    const result = await createdUser(mockCredentials);

    expect(apiClient.post).toHaveBeenCalledWith(
      USER_ENDPOINTS.SIGNUP,
      mockCredentials,
    );

    expect(result).toEqual(mockResponse);
  });

  test("should handle errors and log them", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (apiClient.post as Mock).mockRejectedValueOnce(new Error("API error"));

    const result = await createdUser(mockCredentials);

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error durante la creacion de usuario: ",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});