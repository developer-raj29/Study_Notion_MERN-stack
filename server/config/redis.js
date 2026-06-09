const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Test connection on startup
redis.ping()
  .then((res) => {
    console.log("✅ Redis connected:", res);
  })
  .catch((err) => {
    console.warn("⚠️ Redis unavailable — running without cache:", err.message);
  });

module.exports = redis;
