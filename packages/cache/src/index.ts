import Redis from "ioredis";
import { Resource } from "sst/resource";

const { host, port, username, password } = Resource.valkey;

const cache = new Redis(port, host, {
  showFriendlyErrorStack: true,
  reconnectOnError: () => false,
  username,
  password,
});

export default cache;
