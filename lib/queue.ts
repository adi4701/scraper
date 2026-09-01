import { Redis } from "@upstash/redis";

export type RawPost = {
  id: string;
  author: string;
  title: string;
  selftext: string;
  source_url?: string;
  source?: string;
};

export function createRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  return url && token ? new Redis({ url, token }) : null;
}

export async function enqueuePosts(posts: RawPost[]) {
  const redis = createRedisClient();
  if (!redis || posts.length === 0) {
    return 0;
  }

  await Promise.all(posts.map((post) => redis.lpush("raw_posts", JSON.stringify(post))));
  return posts.length;
}

export async function dequeuePost() {
  const redis = createRedisClient();
  if (!redis) {
    return null;
  }

  const value = await redis.rpop<string>("raw_posts");
  if (!value) {
    return null;
  }

  return typeof value === "string" ? (JSON.parse(value) as RawPost) : value;
}
