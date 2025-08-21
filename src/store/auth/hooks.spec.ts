import { renderHook, act } from "@testing-library/react";
import { useAuth, useLoginAction, useLogoutAction } from "./hooks";
import type { RootState } from "..";
import { type Mock } from "vitest";
import { useAppSelector, useAppDispatch } from "../index";
import { authLogin, authLogout } from "./actions";

// mock de actions
vi.mock("./actions", () => ({
  authLogin: vi.fn((cred) => ({ type: "auth/login", payload: cred })),
  authLogout: vi.fn(() => ({ type: "auth/logout" })),
}));

// mock de store
vi.mock("../index", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

describe("Auth hooks", () => {
  const mockStateTrue: RootState = {
    auth: true,
    adverts: {
      adverts: null,
      tags: [],
      selectedAdvert: null,
      loading: false,
      error: null,
    },
  };

  const mockStateFalse: RootState = {
    auth: false,
    adverts: {
      adverts: null,
      tags: [],
      selectedAdvert: null,
      loading: false,
      error: null,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("useAuth devuelve true si auth=true", () => {
    (useAppSelector as unknown as Mock).mockImplementation(
      (selector: (s: RootState) => unknown) => selector(mockStateTrue),
    );
    const { result } = renderHook(() => useAuth());
    expect(result.current).toBe(true);
  });

  test("useAuth devuelve false si auth=false", () => {
    (useAppSelector as unknown as Mock).mockImplementation(
      (selector: (s: RootState) => unknown) => selector(mockStateFalse),
    );
    const { result } = renderHook(() => useAuth());
    expect(result.current).toBe(false);
  });

  test("useLoginAction despacha authLogin con credenciales", async () => {
    const dispatch = vi.fn();
    (useAppDispatch as unknown as Mock).mockReturnValue(dispatch);

    const { result } = renderHook(() => useLoginAction());
    const credentials = { email: "test@test.com", password: "1234" };

    await act(async () => {
      await result.current(credentials);
    });

    expect(dispatch).toHaveBeenCalledWith(authLogin(credentials));
  });

  test("useLogoutAction despacha authLogout", () => {
    const dispatch = vi.fn();
    (useAppDispatch as unknown as Mock).mockReturnValue(dispatch);

    const { result } = renderHook(() => useLogoutAction());

    act(() => {
      result.current();
    });

    expect(dispatch).toHaveBeenCalledWith(authLogout());
  });
});
