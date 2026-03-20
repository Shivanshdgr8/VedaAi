import { Redis } from "ioredis";

export const redisConnection = new Redis(process.env.REDIS_URI || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

redisConnection.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisConnection.on("connect", () => {
  console.log("Redis connected successfully.");
});
