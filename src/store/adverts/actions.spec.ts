import type { Advert } from "../../pages/adverts/type-advert";
import {
  advertsLoadedPending,
  advertsLoadedFulfilled,
  advertsLoadedRejected,
  advertsCreatedPending,
  advertsCreatedFulfilled,
  advertsCreatedRejected,
  advertsTagsPending,
  advertsTagsFulfilled,
  advertsTagsRejected,
  advertSelectedPending,
  advertSelectedFulfilled,
  advertSelectedRejected,
  advertDeletedPending,
  advertDeletedFulfilled,
  advertDeletedRejected,
  advertsLoaded,
  advertsCreated,
  advertsTagsLoaded,
  advertLoadedById,
  advertDeleted,
} from "./actions";

// Mock de servicios
vi.mock("../../pages/adverts/services", () => ({
  getAdvertsList: vi.fn(),
  createdAdvert: vi.fn(),
  getAdvertTags: vi.fn(),
  getAdvertById: vi.fn(),
  deleteAdvert: vi.fn(),
}));

import {
  getAdvertsList,
  createdAdvert,
  getAdvertTags,
  getAdvertById,
  deleteAdvert,
} from "../../pages/adverts/services";
import type { Mock } from "vitest";

describe("adverts actions creators", () => {
  const sampleAdvert: Advert = {
    id: "1",
    name: "Sample Advert",
    price: 100,
    sale: true,
    tags: ["tag1", "tag2"],
    photo: "photo.jpg",
    createdAt: new Date().toDateString(),
  };

  const sampleError = new Error("Something went wrong");

  test("advertsLoadedPending", () => {
    expect(advertsLoadedPending()).toEqual({ type: "adverts/loaded/pending" });
  });

  test("advertsLoadedFulfilled", () => {
    expect(advertsLoadedFulfilled([sampleAdvert])).toEqual({
      type: "adverts/loaded/fulfilled",
      payload: [sampleAdvert],
    });
  });

  test("advertsLoadedRejected", () => {
    expect(advertsLoadedRejected(sampleError)).toEqual({
      type: "adverts/loaded/rejected",
      error: sampleError,
    });
  });

  test("advertsCreatedPending", () => {
    expect(advertsCreatedPending()).toEqual({
      type: "adverts/created/pending",
    });
  });

  test("advertsCreatedFulfilled", () => {
    expect(advertsCreatedFulfilled(sampleAdvert)).toEqual({
      type: "adverts/created/fulfilled",
      payload: sampleAdvert,
    });
  });

  test("advertsCreatedRejected", () => {
    expect(advertsCreatedRejected(sampleError)).toEqual({
      type: "adverts/created/rejected",
      error: sampleError,
    });
  });

  test("advertsTagsPending", () => {
    expect(advertsTagsPending()).toEqual({ type: "adverts/tags/pending" });
  });

  test("advertsTagsFulfilled", () => {
    const tags = ["tag1", "tag2"];
    expect(advertsTagsFulfilled(tags)).toEqual({
      type: "adverts/tags/fulfilled",
      payload: tags,
    });
  });

  test("advertsTagsRejected", () => {
    expect(advertsTagsRejected(sampleError)).toEqual({
      type: "adverts/tags/rejected",
      error: sampleError,
    });
  });

  test("advertSelectedPending", () => {
    expect(advertSelectedPending()).toEqual({
      type: "adverts/selected/pending",
    });
  });

  test("advertSelectedFulfilled", () => {
    expect(advertSelectedFulfilled(sampleAdvert)).toEqual({
      type: "adverts/selected/fulfilled",
      payload: sampleAdvert,
    });
  });

  test("advertSelectedRejected", () => {
    expect(advertSelectedRejected(sampleError)).toEqual({
      type: "adverts/selected/rejected",
      error: sampleError,
    });
  });

  test("advertDeletedPending", () => {
    expect(advertDeletedPending()).toEqual({ type: "adverts/deleted/pending" });
  });

  test("advertDeletedFulfilled", () => {
    expect(advertDeletedFulfilled("1")).toEqual({
      type: "adverts/deleted/fulfilled",
      payload: "1",
    });
  });

  test("advertDeletedRejected", () => {
    expect(advertDeletedRejected(sampleError)).toEqual({
      type: "adverts/deleted/rejected",
      error: sampleError,
    });
  });
});

describe("adverts thunks", () => {
  const mockDispatch = vi.fn();
  const mockGetState = vi.fn();

  const sampleAdvert: Advert = {
    id: "1",
    name: "Sample Advert",
    price: 100,
    sale: true,
    tags: ["tag1", "tag2"],
    photo: "photo.jpg",
    createdAt: new Date().toDateString(),
  };

  beforeEach(() => {
    mockDispatch.mockClear();
    mockGetState.mockClear();
    vi.clearAllMocks();
  });

  describe("advertsLoaded", () => {
    test("should not dispatch if adverts already exist", async () => {
      mockGetState.mockReturnValue({
        adverts: {
          adverts: [sampleAdvert],
        },
      });

      const thunk = advertsLoaded();
      await thunk(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(getAdvertsList).not.toHaveBeenCalled();
    });

    test("should dispatch when adverts is null", async () => {
      mockGetState.mockReturnValue({
        adverts: {
          adverts: null,
        },
      });
      (getAdvertsList as Mock).mockResolvedValue([sampleAdvert]);

      const thunk = advertsLoaded();
      await thunk(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(advertsLoadedPending());
      expect(mockDispatch).toHaveBeenCalledWith(
        advertsLoadedFulfilled([sampleAdvert]),
      );
      expect(getAdvertsList).toHaveBeenCalled();
    });

    test("should dispatch actions when loading adverts successfully", async () => {
      mockGetState.mockReturnValue({
        adverts: {
          adverts: [],
        },
      });
      (getAdvertsList as Mock).mockResolvedValue([sampleAdvert]);

      const thunk = advertsLoaded();
      await thunk(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(advertsLoadedPending());
      expect(mockDispatch).toHaveBeenCalledWith(
        advertsLoadedFulfilled([sampleAdvert]),
      );
      expect(getAdvertsList).toHaveBeenCalled();
    });

    test("should dispatch error action when loading fails", async () => {
      mockGetState.mockReturnValue({
        adverts: {
          adverts: [],
        },
      });
      const error = new Error("Load failed");
      (getAdvertsList as Mock).mockRejectedValue(error);

      const thunk = advertsLoaded();

      await expect(
        thunk(mockDispatch, mockGetState, undefined),
      ).rejects.toThrow("Load failed");

      expect(mockDispatch).toHaveBeenCalledWith(advertsLoadedPending());
      expect(mockDispatch).toHaveBeenCalledWith(advertsLoadedRejected(error));
    });
  });

  describe("advertsCreated", () => {
    test("should dispatch actions when creating advert successfully", async () => {
      const formData = new FormData();
      (createdAdvert as Mock).mockResolvedValue(sampleAdvert);

      const thunk = advertsCreated(formData);
      const result = await thunk(mockDispatch, mockGetState, undefined);

      expect(result).toBe(sampleAdvert);
      expect(mockDispatch).toHaveBeenCalledWith(advertsCreatedPending());
      expect(mockDispatch).toHaveBeenCalledWith(
        advertsCreatedFulfilled(sampleAdvert),
      );
      expect(createdAdvert).toHaveBeenCalledWith(formData);
    });

    test("should dispatch error action when creation fails", async () => {
      const formData = new FormData();
      const error = new Error("Creation failed");
      (createdAdvert as Mock).mockRejectedValue(error);

      const thunk = advertsCreated(formData);

      await expect(
        thunk(mockDispatch, mockGetState, undefined),
      ).rejects.toThrow("Creation failed");

      expect(mockDispatch).toHaveBeenCalledWith(advertsCreatedPending());
      expect(mockDispatch).toHaveBeenCalledWith(advertsCreatedRejected(error));
    });
  });

  describe("advertsTagsLoaded", () => {
    test("should dispatch actions when loading tags successfully", async () => {
      const tags = ["tag1", "tag2"];
      (getAdvertTags as Mock).mockResolvedValue(tags);

      const thunk = advertsTagsLoaded();
      await thunk(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(advertsTagsPending());
      expect(mockDispatch).toHaveBeenCalledWith(advertsTagsFulfilled(tags));
      expect(getAdvertTags).toHaveBeenCalled();
    });

    test.todo(
      "should dispatch error action when loading tags fails",
      async () => {},
    );
  });

  describe("advertLoadedById", () => {
    test("should use cached advert if available", async () => {
      mockGetState.mockReturnValue({
        adverts: {
          adverts: [sampleAdvert],
        },
      });

      const thunk = advertLoadedById("1");
      await thunk(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(
        advertSelectedFulfilled(sampleAdvert),
      );
      expect(getAdvertById).not.toHaveBeenCalled();
    });

    test("should fetch advert by id when adverts is null", async () => {
      mockGetState.mockReturnValue({
        adverts: {
          adverts: null,
        },
      });
      (getAdvertById as Mock).mockResolvedValue(sampleAdvert);

      const thunk = advertLoadedById("1");
      await thunk(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(advertSelectedPending());
      expect(mockDispatch).toHaveBeenCalledWith(
        advertSelectedFulfilled(sampleAdvert),
      );
      expect(getAdvertById).toHaveBeenCalledWith("1");
    });

    test("should fetch advert by id when not cached", async () => {
      mockGetState.mockReturnValue({
        adverts: {
          adverts: [],
        },
      });
      (getAdvertById as Mock).mockResolvedValue(sampleAdvert);

      const thunk = advertLoadedById("1");
      await thunk(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(advertSelectedPending());
      expect(mockDispatch).toHaveBeenCalledWith(
        advertSelectedFulfilled(sampleAdvert),
      );
      expect(getAdvertById).toHaveBeenCalledWith("1");
    });

    test("should dispatch error action when fetching fails", async () => {
      mockGetState.mockReturnValue({
        adverts: {
          adverts: [],
        },
      });
      const error = new Error("Fetch failed");
      (getAdvertById as Mock).mockRejectedValue(error);

      const thunk = advertLoadedById("1");

      await expect(
        thunk(mockDispatch, mockGetState, undefined),
      ).rejects.toThrow("Fetch failed");

      expect(mockDispatch).toHaveBeenCalledWith(advertSelectedPending());
      expect(mockDispatch).toHaveBeenCalledWith(advertSelectedRejected(error));
    });
  });

  describe("advertDeleted", () => {
    test("should dispatch actions when deleting advert successfully", async () => {
      (deleteAdvert as Mock).mockResolvedValue(undefined);

      const thunk = advertDeleted("1");
      await thunk(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(advertDeletedPending());
      expect(mockDispatch).toHaveBeenCalledWith(advertDeletedFulfilled("1"));
      expect(deleteAdvert).toHaveBeenCalledWith("1");
    });

    test("should dispatch error action when deletion fails", async () => {
      const error = new Error("Deletion failed");
      (deleteAdvert as Mock).mockRejectedValue(error);

      const thunk = advertDeleted("1");

      await expect(
        thunk(mockDispatch, mockGetState, undefined),
      ).rejects.toThrow("Deletion failed");

      expect(mockDispatch).toHaveBeenCalledWith(advertDeletedPending());
      expect(mockDispatch).toHaveBeenCalledWith(advertDeletedRejected(error));
    });
  });
});
