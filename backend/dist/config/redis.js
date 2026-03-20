"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const ioredis_1 = require("ioredis");
exports.redisConnection = new ioredis_1.Redis(process.env.REDIS_URI || "redis://localhost:6379", {
    maxRetriesPerRequest: null,
});
exports.redisConnection.on("error", (err) => {
    console.error("Redis connection error:", err);
});
exports.redisConnection.on("connect", () => {
    console.log("Redis connected successfully.");
});
