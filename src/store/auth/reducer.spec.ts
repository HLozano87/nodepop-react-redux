import { auth } from "./reducer";

describe("Auth reducer", () => {
  test("c. cambia estado en login/logout", () => {
    let state = auth(true, { type: "auth/login/fulfilled", payload: "mock-token" });
    expect(state).toBe(true);

    state = auth(state, { type: "auth/logout" });
    expect(state).toBe(false);
  });
});