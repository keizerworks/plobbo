export const secrets = {
    r2BaseUrl: new sst.Secret(
        "CLOUDFLARE_R2_BASE_URL",
        $dev ? process.env.CLOUDFLARE_R2_BASE_URL : "https://r2.plobbo.com",
    ),

    langdbOpenAIBaseUrl: new sst.Secret(
        "langdbOpenaiBaseUrl",
        process.env.LANGDB_OPENAI_BASE_URL,
    ),

    langdbProjectId: new sst.Secret(
        "langdbProjectId",
        process.env.LANGDB_PROJECT_ID,
    ),

    langdbApiKey: new sst.Secret("langdbApiKey", process.env.LANGDB_API_KEY),
};
