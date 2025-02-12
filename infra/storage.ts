export const D1 = new sst.cloudflare.D1("d1");
export const KV = new sst.cloudflare.Kv("kv");

export const D1_DATABASE_ID = $interpolate`${D1.id}`;
