import type { AdvertsState } from "./reducer";
import { adverts } from "./reducer";
import type { Advert } from "../../pages/adverts/type-advert";

describe("adverts reducer", () => {
  const fixedDate = "2025-01-01T00:00:00.000Z";

  const sampleAdvert: Advert = {
    id: "1",
    name: "Sample Advert",
    price: 100,
    sale: true,
    tags: ["tag1", "tag2"],
    photo: "photo.jpg",
    createdAt: fixedDate,
  };

  const initialState: AdvertsState = {
    adverts: null,
    tags: [],
    selectedAdvert: null,
    loading: false,
    error: null,
  };
  const error = new Error("Custom error");
  const loadingState = { ...initialState, loading: true, error: null };

  // Helper para verificar error state
  const expectErrorState = (
    state: AdvertsState,
    defaultMessage: string,
    err?: Error,
  ) => {
    expect(state.loading).toBe(false);
    expect(state.error).toBe(err?.message ?? defaultMessage);
  };

  // LOADED
  test("should handle adverts/loaded/pending", () => {
    expect(adverts(initialState, { type: "adverts/loaded/pending" })).toEqual(
      loadingState,
    );
  });

  test("should handle adverts/loaded/fulfilled", () => {
    const newState = adverts(initialState, {
      type: "adverts/loaded/fulfilled",
      payload: [sampleAdvert],
    });
    expect(newState).toEqual({
      ...initialState,
      adverts: [sampleAdvert],
      loading: false,
      error: null,
    });
  });

  test("should handle adverts/loaded/fulfilled empty payload", () => {
    const newState = adverts(initialState, {
      type: "adverts/loaded/fulfilled",
      payload: [],
    });
    expect(newState.adverts).toEqual([]);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBeNull();
  });

  test("should handle adverts/created/fulfilled when adverts is null", () => {
    const newAdvert: Advert = { ...sampleAdvert, id: "2" };
    const newState = adverts(initialState, {
      type: "adverts/created/fulfilled",
      payload: newAdvert,
    });
    expect(newState.adverts).toEqual([newAdvert]);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBeNull();
  });

  test("should handle adverts/loaded/rejected undefined error", () => {
    const newState = adverts(initialState, {
      type: "adverts/loaded/rejected",
      error: { message: undefined } as unknown as Error,
    });
    expectErrorState(newState, "Error loading adverts");
  });

  test("should handle adverts/loaded/rejected with error message", () => {
    const newState = adverts(initialState, {
      type: "adverts/loaded/rejected",
      error,
    });
    expectErrorState(newState, "Error loading adverts", error);
  });

  // CREATED
  test("should handle adverts/created/pending", () => {
    expect(adverts(initialState, { type: "adverts/created/pending" })).toEqual(
      loadingState,
    );
  });

  test("should handle adverts/created/fulfilled", () => {
    const prevState = { ...initialState, adverts: [sampleAdvert] };
    const newAdvert: Advert = { ...sampleAdvert, id: "2" };
    const newState = adverts(prevState, {
      type: "adverts/created/fulfilled",
      payload: newAdvert,
    });
    expect(newState.adverts).toEqual([newAdvert, sampleAdvert]);
    expect(newState.adverts).not.toBe(prevState.adverts);
  });

  test("should handle adverts/created/rejected undefined error", () => {
    const newState = adverts(initialState, {
      type: "adverts/created/rejected",
      error: { message: undefined } as unknown as Error,
    });
    expectErrorState(newState, "Error creating advert");
  });

  test("should handle adverts/created/rejected with error message", () => {
    const newState = adverts(initialState, {
      type: "adverts/created/rejected",
      error,
    });
    expectErrorState(newState, "Error creating advert", error);
  });

  // TAGS
  test("should handle adverts/tags/pending", () => {
    expect(adverts(initialState, { type: "adverts/tags/pending" }))
      .toEqual(loadingState);
  });

  test("should handle adverts/tags/fulfilled", () => {
    const tags = ["tag1", "tag2"];
    const newState = adverts(initialState, {
      type: "adverts/tags/fulfilled",
      payload: tags,
    });
    expect(newState).toEqual({
      ...initialState,
      tags,
      loading: false,
      error: null,
    });
  });

  test("should handle adverts/tags/fulfilled empty", () => {
    const newState = adverts(initialState, {
      type: "adverts/tags/fulfilled",
      payload: [],
    });
    expect(newState.tags).toEqual([]);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBeNull();
  });

  test("should handle adverts/tags/rejected undefined error", () => {
    const newState = adverts(initialState, {
      type: "adverts/tags/rejected",
      error: { message: undefined } as unknown as Error,
    });
    expectErrorState(newState, "Error fetching tags");
  });

  test("should handle adverts/tags/rejected with error message", () => {
    const newState = adverts(initialState, {
      type: "adverts/tags/rejected",
      error,
    });
    expectErrorState(newState, "Error fetching tags", error);
  });

  // SELECTED
  test("should handle adverts/selected/pending", () => {
    expect(adverts(initialState, { type: "adverts/selected/pending" })).toEqual(
      { ...loadingState, selectedAdvert: null },
    );
  });

  test("should handle adverts/selected/fulfilled", () => {
    const newState = adverts(initialState, {
      type: "adverts/selected/fulfilled",
      payload: sampleAdvert,
    });
    expect(newState).toEqual({
      ...initialState,
      selectedAdvert: sampleAdvert,
      loading: false,
      error: null,
    });
  });

  test("should handle adverts/selected/rejected", () => {
    const newState = adverts(initialState, {
      type: "adverts/selected/rejected",
      error,
    });
    expectErrorState(newState, "Error advert does not exist", error);
  });

  // DELETED
  test("should handle adverts/deleted/pending", () => {
    expect(adverts(initialState, { type: "adverts/deleted/pending" })).toEqual(
      loadingState,
    );
  });

  test("should handle adverts/deleted/fulfilled when advert exists", () => {
    const prevState = { ...initialState, adverts: [sampleAdvert] };
    const newState = adverts(prevState, {
      type: "adverts/deleted/fulfilled",
      payload: "1",
    });
    expect(newState.adverts).toEqual([]);
    expect(newState.adverts).not.toBe(prevState.adverts);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBeNull();
  });

  test("adverts/deleted/fulfilled when advert does not exist", () => {
    const prevState = { ...initialState, adverts: [sampleAdvert] };
    const newState = adverts(prevState, {
      type: "adverts/deleted/fulfilled",
      payload: "999",
    });
    expect(newState.adverts).toEqual([sampleAdvert]);
    expect(newState.adverts).not.toBe(prevState.adverts);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBeNull();
  });

  test("should handle adverts/deleted/rejected undefined error", () => {
    const newState = adverts(initialState, {
      type: "adverts/deleted/rejected",
      error: { message: undefined } as unknown as Error,
    });
    expectErrorState(newState, "Error deleting advert");
  });

  test("should handle adverts/deleted/rejected with error message", () => {
    const newState = adverts(initialState, {
      type: "adverts/deleted/rejected",
      error,
    });
    expectErrorState(newState, "Error deleting advert", error);
  });

  test("should handle adverts/deleted/fulfilled when adverts is null", () => {
    // Usar initialState directamente porque adverts: null
    const newState = adverts(initialState, {
      type: "adverts/deleted/fulfilled",
      payload: "1",
    });

    expect(newState).toEqual({
      ...initialState,
      adverts: null, // Se mantiene null
      loading: false,
      error: null,
    });
  });

  // DEFAULT
  test("should return state when action type is unknown", () => {
    // @ts-expect-error probando acción inválida
    const newState = adverts(initialState, { type: "unknown" });
    expect(newState).toBe(initialState);
  });
});
