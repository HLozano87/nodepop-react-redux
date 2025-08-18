import { getIsLogged } from "./selectors";
import type { RootState } from "..";

describe("Auth selector", () => {
  test("getIsLogged devuelve estado auth", () => {
    const state = { auth: true } as RootState;
    expect(getIsLogged(state)).toBe(true);
  });
});
