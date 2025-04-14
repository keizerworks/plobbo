import { JourneyTable } from "~/interface/journey";
import apiClient from "~/lib/axios";

export const getJourney = async (id: string) =>
  apiClient
    .get<JourneyTable[]>(`journey`, {
      params: {
        organizationId: id,
      },
    })
    .then((r) => r.data);

export const getJourneyById = async (id: string) =>
  apiClient.get<JourneyTable>("journey/" + id).then((r) => r.data);

export const createJourney = async (data: FormData) => {
  return apiClient.post<JourneyTable>("journey", data).then((r) => r.data);
};
