import { authLogin, authLogout, AuthLoginPending, AuthLoginFulfilled, AuthLoginRejected } from "./actions";
import type { CredentialUser } from "../../pages/auth/types-auth";
import type { RootState } from "..";
import * as authService from "../../pages/auth/service";

let dispatch: ReturnType<typeof vi.fn>;
let fakeState: RootState;

describe("Auth actions", () => {
  beforeEach(() => {
    dispatch = vi.fn();
    fakeState = {
      auth: false,
      adverts: {
        adverts: [],
        tags: [],
        loading: false,
        error: null,
        selectedAdvert: null,
      },
    };
  });

  test("authLogout devuelve acción correcta", () => {
    expect(authLogout()).toEqual({ type: "auth/logout" });
  });

  test("authLogin dispatch pending y fulfilled al iniciar sesión correctamente", async () => {
    const credentials: CredentialUser = { email: "test@example.com", password: "1234" };
    const mockToken = "mock-token";

    vi.spyOn(authService, "login").mockResolvedValue(mockToken);

    const thunk = authLogin(credentials);
    const result = await thunk(dispatch, () => fakeState, undefined);

    expect(dispatch).toHaveBeenNthCalledWith(1, AuthLoginPending());
    expect(dispatch).toHaveBeenNthCalledWith(2, AuthLoginFulfilled(mockToken));
    expect(result).toBe(mockToken);
  });

  test("authLogin dispatch pending y rejected al fallar login", async () => {
    const credentials: CredentialUser = { email: "fail@example.com", password: "wrong" };
    const error = new Error("Login failed");

    vi.spyOn(authService, "login").mockRejectedValue(error);

    const thunk = authLogin(credentials);

    await expect(thunk(dispatch, () => fakeState, undefined)).rejects.toThrow(error);

    expect(dispatch).toHaveBeenNthCalledWith(1, AuthLoginPending());
    expect(dispatch).toHaveBeenNthCalledWith(2, AuthLoginRejected(error));
  });
});