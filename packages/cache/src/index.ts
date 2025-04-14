import Redis, { Cluster } from "ioredis";
import { Resource } from "sst/resource";

const { host, port, username, password } = Resource.valkey;

const cache =
  Resource.App.stage === "production"
    ? new Cluster([{ host, port }], {
        redisOptions: {
          enableAutoPipelining: true,
          tls: { checkServerIdentity: () => undefined },
          username,
          password,
        },
      })
    : new Redis({ host, port, username, password });

export default cache;
