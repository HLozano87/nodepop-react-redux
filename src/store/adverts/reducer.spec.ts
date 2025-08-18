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

  const error = new Error("Something went wrong");

  const loadingState = { ...initialState, loading: true, error: null };

  // Helper para verificar error state
  const expectErrorState = (state: AdvertsState, message: string) => {
    expect(state.error).toBe(message);
    expect(state.loading).toBe(false);
  };

  // LOADED
  test("should handle adverts/loaded/pending", () => {
    expect(adverts(initialState, { type: "adverts/loaded/pending" }))
      .toEqual(loadingState);
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

  test("should handle adverts/loaded/rejected", () => {
    const newState = adverts(initialState, {
      type: "adverts/loaded/rejected",
      error,
    });
    expectErrorState(newState, error.message);
  });

  // CREATED
  test("should handle adverts/created/pending", () => {
    expect(adverts(initialState, { type: "adverts/created/pending" }))
      .toEqual(loadingState);
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

  test("should handle adverts/created/rejected", () => {
    const newState = adverts(initialState, {
      type: "adverts/created/rejected",
      error,
    });
    expectErrorState(newState, error.message);
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

  test("should handle adverts/tags/rejected", () => {
    const newState = adverts(initialState, {
      type: "adverts/tags/rejected",
      error,
    });
    expectErrorState(newState, error.message);
  });

  // SELECTED
  test("should handle adverts/selected/pending", () => {
    expect(adverts(initialState, { type: "adverts/selected/pending" }))
      .toEqual({ ...loadingState, selectedAdvert: null });
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
    expectErrorState(newState, error.message);
  });

  // DELETED
  test("should handle adverts/deleted/pending", () => {
    expect(adverts(initialState, { type: "adverts/deleted/pending" }))
      .toEqual(loadingState);
  });

  test("should handle adverts/deleted/fulfilled", () => {
    const prevState = { ...initialState, adverts: [sampleAdvert] };
    const newState = adverts(prevState, {
      type: "adverts/deleted/fulfilled",
      payload: "1",
    });
    expect(newState.adverts).toEqual([]);
    expect(newState.adverts).not.toBe(prevState.adverts);
  });

  test("should handle adverts/deleted/rejected", () => {
    const newState = adverts(initialState, {
      type: "adverts/deleted/rejected",
      error,
    });
    expectErrorState(newState, error.message);
  });

  // DEFAULT
  test("should return state when action type is unknown", () => {
    // @ts-expect-error probando acción inválida
    const newState = adverts(initialState, { type: "unknown" });
    expect(newState).toBe(initialState);
  });
});