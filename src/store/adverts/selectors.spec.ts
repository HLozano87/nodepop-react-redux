import {
  getAdverts,
  getTags,
  getSelectedAdvert,
  getAdvertsLoading,
  getAdvertsError,
  getAdvertById,
} from "./selectors";
import type { RootState } from "..";

describe("Adverts selectors", () => {
  const fakeAdvert = {
    id: "123",
    name: "Test advert",
    price: 100,
    sale: true,
    tags: ["tag1"],
    photo: "test.jpg",
    createdAt: new Date().toString()
  };

  const mockState: RootState = {
    auth: false,
    adverts: {
      adverts: [fakeAdvert],
      tags: ["tag1", "tag2"],
      selectedAdvert: fakeAdvert,
      loading: true,
      error: "Error message",
    },
  };

  test("getAdverts devuelve adverts del estado", () => {
    const result = getAdverts(mockState);
    expect(result).toEqual([fakeAdvert]);
  });

  test("getAdverts devuelve [] si adverts es null", () => {
    const state: RootState = { ...mockState, adverts: { ...mockState.adverts, adverts: null } };
    const result = getAdverts(state);
    expect(result).toEqual([]);
  });

  test("getTags devuelve tags del estado", () => {
    const result = getTags(mockState);
    expect(result).toEqual(["tag1", "tag2"]);
  });

  test("getSelectedAdvert devuelve el selectedAdvert", () => {
    const result = getSelectedAdvert(mockState);
    expect(result).toEqual(fakeAdvert);
  });

  test("getAdvertsLoading devuelve el estado loading", () => {
    const result = getAdvertsLoading(mockState);
    expect(result).toBe(true);
  });

  test("getAdvertsError devuelve el error", () => {
    const result = getAdvertsError(mockState);
    expect(result).toBe("Error message");
  });

  test("getAdvertById devuelve el advert correspondiente si existe", () => {
    const selector = getAdvertById("123");
    const result = selector(mockState);
    expect(result).toEqual(fakeAdvert);
  });

  test("getAdvertById devuelve undefined si no existe el advert", () => {
    const selector = getAdvertById("999");
    const result = selector(mockState);
    expect(result).toBeUndefined();
  });

  test("getAdvertById devuelve undefined si advertId no está definido", () => {
    const selector = getAdvertById();
    const result = selector(mockState);
    expect(result).toBeUndefined();
  });
});