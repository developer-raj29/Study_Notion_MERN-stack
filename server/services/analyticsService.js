const RecommendationAnalytics = require("../models/RecommendationAnalytics");

/**
 * Persists a recommendation analytics event in MongoDB
 */
exports.trackEvent = async ({ event, roadmapId, userId, courseId }) => {
  try {
    const entry = await RecommendationAnalytics.create({
      event,
      roadmapId,
      userId,
      courseId,
    });
    console.log(`[Analytics] Successfully stored ${event} event in DB for user ${userId}`);
    return entry;
  } catch (err) {
    console.error(`[Analytics] Failed to track ${event} event:`, err.message);
    return null;
  }
};
