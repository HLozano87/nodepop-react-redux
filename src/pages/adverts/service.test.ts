import {
  getAdvertsList,
  getAdvertById,
  getAdvertTags,
  createdAdvert,
  deleteAdvert,
} from "../adverts/services";
import { apiClient } from "../../api/client";
import { ADVERT_ENDPOINT } from "../../utils/endpoints";
import type { Mock } from "vitest";

vi.mock("../../api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("advert service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAdvertsList should call apiClient.get and return data", async () => {
    const mockData = [{ id: "1", name: "Advert 1" }];
    (apiClient.get as Mock).mockResolvedValueOnce({ data: mockData });

    const result = await getAdvertsList();

    expect(apiClient.get).toHaveBeenCalledWith(ADVERT_ENDPOINT.ADVERT);
    expect(result).toEqual(mockData);
  });

  it("getAdvertById should call apiClient.get with id and return data", async () => {
    const mockData = { id: "123", name: "Advert 123" };
    (apiClient.get as Mock).mockResolvedValueOnce({ data: mockData });

    const result = await getAdvertById("123");

    expect(apiClient.get).toHaveBeenCalledWith(
      ADVERT_ENDPOINT.ADVERT_ID("123"),
    );
    expect(result).toEqual(mockData);
  });

  it("getAdvertTags should call apiClient.get and return tags", async () => {
    const mockTags = ["tag1", "tag2"];
    (apiClient.get as Mock).mockResolvedValueOnce({ data: mockTags });

    const result = await getAdvertTags();

    expect(apiClient.get).toHaveBeenCalledWith(ADVERT_ENDPOINT.TAGS);
    expect(result).toEqual(mockTags);
  });

  it("createdAdvert should call apiClient.post with FormData and return data", async () => {
    const mockData = { id: "createdId", name: "New Advert" };
    const formData = new FormData();
    formData.append("name", "New Advert");
    (apiClient.post as Mock).mockResolvedValueOnce({ data: mockData });

    const result = await createdAdvert(formData);

    expect(apiClient.post).toHaveBeenCalledWith(
      ADVERT_ENDPOINT.ADVERT,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    expect(result).toEqual(mockData);
  });

  it("deleteAdvert should call apiClient.delete with id", async () => {
    (apiClient.delete as Mock).mockResolvedValueOnce(undefined);

    await deleteAdvert("delId");

    expect(apiClient.delete).toHaveBeenCalledWith(
      ADVERT_ENDPOINT.ADVERT_ID("delId"),
    );
  });
});
