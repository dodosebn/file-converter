"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_REDIS_ENABLED = exports.conversionQueue = exports.connectionOptions = void 0;
const bullmq_1 = require("bullmq");
const redisUrlString = process.env.REDIS_URL || "redis://localhost:6379";
const redisUrl = new URL(redisUrlString);
// Only enable Redis features if explicitly requested or if it looks like we're in Docker
const IS_REDIS_ENABLED = process.env.ENABLE_REDIS === "true" || !!process.env.REDIS_URL;
exports.IS_REDIS_ENABLED = IS_REDIS_ENABLED;
exports.connectionOptions = {
    host: redisUrl.hostname,
    port: parseInt(redisUrl.port) || 6379,
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
        if (!IS_REDIS_ENABLED)
            return null; // Don't even try if disabled
        if (times > 3)
            return null; // Stop after 3 tries to avoid log spam
        return Math.min(times * 200, 1000);
    }
};
let queue = null;
if (IS_REDIS_ENABLED) {
    try {
        queue = new bullmq_1.Queue("conversion-queue", {
            connection: exports.connectionOptions,
            defaultJobOptions: {
                attempts: 3,
                backoff: { type: "exponential", delay: 1000 },
                removeOnComplete: true,
                removeOnFail: false,
            },
        });
        queue.on('error', (err) => {
            // Only log if we expect it to work
            if (process.env.NODE_ENV === 'production') {
                console.error("Redis connection error (Queue):", err.message);
            }
        });
    }
    catch (e) {
        console.warn("Could not initialize Redis Queue. Background tasks will be disabled.");
    }
}
exports.conversionQueue = queue;
