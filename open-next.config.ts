import type { OpenNextConfig } from "@opennextjs/aws/types/open-next.js";

const config = {
  default: {
    override: {
      wrapper: () =>
        import("./src/middleware/wrapper").then((mod) => mod.default),
      tagCache: "dynamodb-lite",
      incrementalCache: "s3-lite",
      queue: "sqs-lite",
    },
  },
} satisfies OpenNextConfig;

export default config;
