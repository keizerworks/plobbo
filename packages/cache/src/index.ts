import { Cluster } from "ioredis";
import { Resource } from "sst/resource";

const { host, port, username, password } = Resource.valkey;

const cache = new Cluster([{ host, port }], {
  redisOptions: {
    enableAutoPipelining: true,
    tls: { checkServerIdentity: () => undefined },
    username,
    password,
  },
});

export default cache;
