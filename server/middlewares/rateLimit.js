const rateLimit = require("express-rate-limit");

// AI Rate Limiter: Limits AI queries per student user to prevent quota abuse
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.AI_RATE_LIMIT_PER_HOUR) || 10,
  keyGenerator: (req) => req.user.id,
  validate: false,
  message: {
    success: false,
    message: "Rate limit exceeded. You can only make 10 AI requests per hour.",
  },
});

module.exports = { aiLimiter };
