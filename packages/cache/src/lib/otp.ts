import cache from "@plobbo/cache";

export namespace OtpCache {
  export async function set(email: string, otp: string, ttl: number) {
    const key = `otp:${email}`;
    return await cache.set(key, otp, "EX", ttl).catch(console.error);
  }

  export async function get(email: string) {
    const key = `otp:${email}`;
    return await cache.get(key).catch(console.error);
  }

  export async function del(email: string) {
    const key = `otp:${email}`;
    return await cache.del(key);
  }
}
