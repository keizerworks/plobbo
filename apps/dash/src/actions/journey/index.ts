import { CreateJourneyInterface } from "@plobbo/validator/journey/create";

import { JourneyTable } from "~/interface/journey";
import apiClient from "~/lib/axios";

export const getJourney = async (id: string) =>
  apiClient.get("journey/" + id).then((r) => r.data);

export const createJourney = async (data: CreateJourneyInterface) => {
  console.log(data);
  return apiClient.post<JourneyTable>("journey", data).then((r) => r.data);
};
