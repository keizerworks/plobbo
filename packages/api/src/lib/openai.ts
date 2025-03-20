import { Resource } from "sst/resource";

export const openAiOptions = {
  apiKey: Resource.LangdbApiKey.value,
  baseURL: Resource.LangdbOpenaiBaseUrl.value,
};
