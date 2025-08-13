import { storage } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("get returns null if key does not exist", () => {
    expect(storage.get("auth")).toBeNull();
  });

  test("get returns stored value", () => {
    localStorage.setItem("auth", "token123");
    expect(storage.get("auth")).toBe("token123");
  });

  test("set stores the value", () => {
    storage.set("auth", "token456");
    expect(localStorage.getItem("auth")).toBe("token456");
  });

  test("remove deletes the key", () => {
    localStorage.setItem("auth", "token789");
    storage.remove("auth");
    expect(localStorage.getItem("auth")).toBeNull();
  });

  test("clear removes all keys", () => {
    localStorage.setItem("auth", "token");
    localStorage.setItem("other", "value");
    storage.clear();
    expect(localStorage.getItem("auth")).toBeNull();
    expect(localStorage.getItem("other")).toBeNull();
  });
});
