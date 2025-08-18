import { configureStore, type RootState, useAppDispatch, useAppSelector } from "./index";

// Mock de reducers
vi.mock("./auth/reducer", () => ({
  auth: vi.fn((state: boolean = false, _: { type: string }) => state),
}));

vi.mock("./adverts/reducer", () => ({
  adverts: vi.fn(
    (
      state = { adverts: [], tags: [], selectedAdvert: null, loading: false, error: null },
      _: { type: string },
    ) => state,
  ),
}));

// Mock de react-redux para evitar spyOn
const mockDispatch = vi.fn();
const mockState: RootState = {
  auth: true,
  adverts: {
    adverts: [],
    tags: [],
    selectedAdvert: null,
    loading: false,
    error: null,
  },
};

vi.mock("react-redux", async () => {
  const actual: any = await vi.importActual("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (fn: any) => fn(mockState),
  };
});

describe("Redux store", () => {
  test("should configure store correctly", () => {
    const preloadedState: Partial<RootState> = {
      auth: true,
      adverts: mockState.adverts,
    };
    const store = configureStore(preloadedState);
    const state = store.getState();

    expect(state.auth).toBe(true);
    expect(state.adverts).toEqual(mockState.adverts);
    expect(typeof store.dispatch).toBe("function");
  });

  test("rootReducer should combine auth and adverts", () => {
    const store = configureStore({});
    const state = store.getState();

    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("adverts");
  });

  test("should call useAppDispatch and useAppSelector hooks", () => {
    const dispatch = useAppDispatch();
    expect(dispatch).toBe(mockDispatch);

    const selectedAdverts = useAppSelector((state) => state.adverts);
    expect(selectedAdverts).toEqual(mockState.adverts);
  });
});