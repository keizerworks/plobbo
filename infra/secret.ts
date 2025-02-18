export const secret = {
    langdbOpenAIBaseUrl: new sst.Secret(
        "langdb-openai-base-url",
        process.env.LANGDB_OPENAI_BASE_URL,
    ),

    langdbProjectId: new sst.Secret(
        "langdb-project-id",
        process.env.LANGDB_PROJECT_ID,
    ),

    langdbApiKey: new sst.Secret("langdb-api-key", process.env.LANGDB_API_KEY),
};
