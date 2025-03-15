import type { OpenNextConfig } from "@opennextjs/aws/types/open-next.js";

const config = {
  default: {
    override: {
      tagCache: "dynamodb-lite",
      incrementalCache: "s3-lite",
      queue: "sqs-lite",
      wrapper: () =>
        import("./src/middleware/custom-domain").then((mod) => mod.default),
    },
  },
} satisfies OpenNextConfig;

export default config;
