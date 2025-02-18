export const D1 = new sst.cloudflare.D1("d1");
export const R2 = new sst.cloudflare.Bucket("r2");
export const KV = new sst.cloudflare.Kv("kv");

export const BUCKET = $interpolate`${R2.name}`;
export const D1_DATABASE_ID = $interpolate`${D1.id}`;
