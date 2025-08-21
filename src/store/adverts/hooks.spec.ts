// adverts/hooks.test.tsx
import { renderHook, act } from "@testing-library/react";
import type { RootState } from "..";
import { type Mock } from "vitest";
import { useAppSelector, useAppDispatch } from "..";
import {
  useAdverts,
  useTags,
  useSelectedAdvert,
  useAdvertById,
  useAdvertsLoading,
  useAdvertsError,
  useAdvertsActions,
} from "./hooks";
import {
  advertsLoaded,
  advertsCreated,
  advertsTagsLoaded,
  advertLoadedById,
  advertDeleted,
} from "./actions";
import type { Advert } from "../../pages/adverts/type-advert";

// mock de actions
vi.mock("./actions", () => ({
  advertsLoaded: vi.fn(() => ({ type: "adverts/loaded" })),
  advertsCreated: vi.fn((formData: FormData) => ({
    type: "adverts/created",
    payload: formData,
  })),
  advertsTagsLoaded: vi.fn(() => ({ type: "adverts/tagsLoaded" })),
  advertLoadedById: vi.fn((id: string) => ({
    type: "adverts/loadedById",
    payload: id,
  })),
  advertDeleted: vi.fn((id: string) => ({
    type: "adverts/deleted",
    payload: id,
  })),
}));

// mock de store
vi.mock("..", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

describe("Adverts hooks", () => {
  const fakeAdvert: Advert = {
    id: "1",
    name: "Test advert",
    sale: true,
    price: 100,
    tags: ["motor"],
    photo: "test.jpg",
    createdAt: new Date().toDateString()
  };

  const mockState: RootState = {
    auth: false,
    adverts: {
      adverts: [fakeAdvert],
      tags: ["motor", "work"],
      selectedAdvert: fakeAdvert,
      loading: true,
      error: "Algo falló",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("useAdverts devuelve adverts del estado", () => {
    (useAppSelector as unknown as Mock).mockImplementation(
      (selector: (s: RootState) => unknown) => selector(mockState),
    );
    const { result } = renderHook(() => useAdverts());
    expect(result.current).toEqual([fakeAdvert]);
  });

  test("useTags devuelve tags del estado", () => {
    (useAppSelector as unknown as Mock).mockImplementation(
      (selector: (s: RootState) => unknown) => selector(mockState),
    );
    const { result } = renderHook(() => useTags());
    expect(result.current).toEqual(["motor", "work"]);
  });

  test("useSelectedAdvert devuelve el anuncio seleccionado", () => {
    (useAppSelector as unknown as Mock).mockImplementation(
      (selector: (s: RootState) => unknown) => selector(mockState),
    );
    const { result } = renderHook(() => useSelectedAdvert());
    expect(result.current).toEqual(fakeAdvert);
  });

  test("useAdvertById devuelve un anuncio por id", () => {
    (useAppSelector as unknown as Mock).mockImplementation(
      (selector: (s: RootState) => unknown) => selector(mockState),
    );
    const { result } = renderHook(() => useAdvertById("1"));
    expect(result.current).toEqual(fakeAdvert);
  });

  test("useAdvertsLoading devuelve el estado de loading", () => {
    (useAppSelector as unknown as Mock).mockImplementation(
      (selector: (s: RootState) => unknown) => selector(mockState),
    );
    const { result } = renderHook(() => useAdvertsLoading());
    expect(result.current).toBe(true);
  });

  test("useAdvertsError devuelve el error", () => {
    (useAppSelector as unknown as Mock).mockImplementation(
      (selector: (s: RootState) => unknown) => selector(mockState),
    );
    const { result } = renderHook(() => useAdvertsError());
    expect(result.current).toBe("Algo falló");
  });
});

describe("Adverts actions hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("loadAdverts despacha advertsLoaded", () => {
    const dispatch = vi.fn();
    (useAppDispatch as unknown as Mock).mockReturnValue(dispatch);

    const { result } = renderHook(() => useAdvertsActions());

    act(() => {
      result.current.loadAdverts();
    });

    expect(dispatch).toHaveBeenCalledWith(advertsLoaded());
  });

  test("createAdvert despacha advertsCreated con formData", () => {
    const dispatch = vi.fn();
    (useAppDispatch as unknown as Mock).mockReturnValue(dispatch);

    const { result } = renderHook(() => useAdvertsActions());
    const formData = new FormData();
    formData.append("name", "Nuevo anuncio");

    act(() => {
      result.current.createAdvert(formData);
    });

    expect(dispatch).toHaveBeenCalledWith(advertsCreated(formData));
  });

  test("loadTags despacha advertsTagsLoaded", () => {
    const dispatch = vi.fn();
    (useAppDispatch as unknown as Mock).mockReturnValue(dispatch);

    const { result } = renderHook(() => useAdvertsActions());

    act(() => {
      result.current.loadTags();
    });

    expect(dispatch).toHaveBeenCalledWith(advertsTagsLoaded());
  });

  test("advertLoadedById despacha advertLoadedById con id", () => {
    const dispatch = vi.fn();
    (useAppDispatch as unknown as Mock).mockReturnValue(dispatch);

    const { result } = renderHook(() => useAdvertsActions());

    act(() => {
      result.current.advertLoadedById("123");
    });

    expect(dispatch).toHaveBeenCalledWith(advertLoadedById("123"));
  });

  test("deleteAdvert despacha advertDeleted con id", () => {
    const dispatch = vi.fn();
    (useAppDispatch as unknown as Mock).mockReturnValue(dispatch);

    const { result } = renderHook(() => useAdvertsActions());

    act(() => {
      result.current.deleteAdvert("999");
    });

    expect(dispatch).toHaveBeenCalledWith(advertDeleted("999"));
  });
});