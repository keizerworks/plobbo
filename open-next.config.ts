import type { OpenNextConfig } from "@opennextjs/aws/types/open-next.js";

const config = {
  default: {
    override: {
      wrapper: "aws-lambda-streaming",
      tagCache: "dynamodb-lite",
      incrementalCache: "s3-lite",
      queue: "sqs-lite",
    },
  },
  functions: {
    // edge: {
    //   runtime: "edge",
    //   routes: [
    //     "app/(admin)/(auth)/signin/page",
    //     "app/(admin)/(auth)/signup/page",
    //   ],
    //   patterns: ["app/(admin)/(auth)/*"],
    //   override: {},
    // },
  },
  middleware: {
    external: true,
  },
} satisfies OpenNextConfig;

export default config;
