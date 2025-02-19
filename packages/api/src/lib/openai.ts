import { Resource } from "sst/resource";

export const openAiOptions = {
  apiKey: Resource.langdbApiKey.value,
  baseURL: Resource.langdbOpenaiBaseUrl.value,
  headers: { "x-project-id": Resource.langdbProjectId.value },
};
