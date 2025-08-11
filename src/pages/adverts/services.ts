import { apiClient } from "../../api/client";
import { ADVERT_ENDPOINT } from "../../utils/endpoints";
import type { Advert } from "./type-advert";

export const getAdvertsList = async (): Promise<Advert[]> => {
  const response = await apiClient.get<Advert[]>(`${ADVERT_ENDPOINT.ADVERT}`);
  return response.data;
};

export const getAdvertById = async (advertId: string): Promise<Advert> => {
  const response = await apiClient.get<Advert>(
    `${ADVERT_ENDPOINT.ADVERT_ID(advertId)}`,
  );
  return response.data;
};

export const getAdvertTags = async (): Promise<string[]> => {
  const response = await apiClient.get<string[]>(ADVERT_ENDPOINT.TAGS);
  return response.data;
};

export const createdAdvert = async (payload: FormData): Promise<Advert> => {
  const response = await apiClient.post<Advert>(
    ADVERT_ENDPOINT.ADVERT,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const deleteAdvert = async (id: string): Promise<void> => {
  await apiClient.delete<Advert[]>(ADVERT_ENDPOINT.ADVERT_ID(id));
};
