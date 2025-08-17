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
} from "./actions";

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
