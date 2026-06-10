const assert = require("assert");
const { aiLimiter } = require("../middlewares/rateLimit");

function testRateLimit() {
  console.log("▶ Running Rate Limiter tests...");
  
  assert.ok(aiLimiter, "aiLimiter middleware should be exported");
  assert.strictEqual(typeof aiLimiter, "function", "aiLimiter should be an Express middleware function");
  
  console.log("✓ Rate Limiter tests completed successfully!");
}

module.exports = { testRateLimit };
