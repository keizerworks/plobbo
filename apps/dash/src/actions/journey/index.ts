import apiClient from "~/lib/axios";

export const getJourney = async (id: string) =>
  apiClient.get("journey/" + id).then((r) => r.data);
