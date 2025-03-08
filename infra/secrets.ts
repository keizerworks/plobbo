export const secrets = {
  langdbOpenAIBaseUrl: new sst.Secret(
    "langdbOpenaiBaseUrl",
    process.env.LANGDB_OPENAI_BASE_URL,
  ),

  langdbProjectId: new sst.Secret(
    "langdbProjectId",
    process.env.LANGDB_PROJECT_ID,
  ),

  langdbApiKey: new sst.Secret("langdbApiKey", process.env.LANGDB_API_KEY),

  CloudfrontWWWUrl: new sst.Secret(
    "CloudfrontWWWUrl",
    process.env.CLOUDFRONT_WWW_URL,
  ),

  CloudfrontDistributionID: new sst.Secret(
    "CloudfrontDistributionID",
    process.env.CLOUDFRONT_DISTRIBUTIONID,
  ),

  PolarPremiumProductId: new sst.Secret("PolarPremiumProductId"),
  PolarAPIToken: new sst.Secret("PolarAPIToken"),
  PolarWebhookSecret: new sst.Secret(
    "PolarWebhookSecret",
    process.env.POLAR_WEBHOOK_SECRET,
  ),

  IsWaitlistMode: new sst.Secret("IsWaitlistMode"),
};
