const Course = require("../models/Course");
const AIService = require("../services/AIService");
const RoadmapRepo = require("../repositories/RoadmapRepository");
const CourseRecommendationService = require("../services/courseRecommendationService");
const AnalyticsService = require("../services/analyticsService");

// Reusable helper to parse and format Gemini AI errors into user-friendly notifications
function getCleanAIErrorMessage(errMessage) {
  if (!errMessage) return "Failed to generate learning roadmap. Please try again later.";
  const errMsgLower = errMessage.toLowerCase();
  
  if (errMsgLower.includes("quota") || errMsgLower.includes("429") || errMsgLower.includes("limit")) {
    return "AI rate limit or monthly quota exceeded. Please try again in a moment.";
  }
  if (errMsgLower.includes("503") || errMsgLower.includes("service unavailable") || errMsgLower.includes("high demand") || errMsgLower.includes("overloaded")) {
    return "Gemini AI service is temporarily overloaded due to high demand. Please try again in a few seconds.";
  }
  if (errMsgLower.includes("not found") || errMsgLower.includes("404") || errMsgLower.includes("not supported")) {
    return "The selected AI model is temporarily unavailable. Please contact support.";
  }
  if (errMsgLower.includes("api key") || errMsgLower.includes("key not") || errMsgLower.includes("invalid key")) {
    return "Invalid AI API Key configuration. Please configure GEMINI_API_KEY.";
  }
  
  // Clean up raw GoogleGenerativeAI URLs and duplicate prefixes
  let clean = errMessage
    .replace(/^Error:\s*/i, "")
    .replace(/AI generation failed:\s*/ig, "")
    .replace(/\[GoogleGenerativeAI Error\]:\s*/ig, "")
    .replace(/Error fetching from https:\/\/generativelanguage\.googleapis\.com\/[^:]+:\s*/ig, "");
    
  return `AI generation failed: ${clean.trim()}`;
}

// POST /api/v1/ai/generate-roadmap
// Generates a new learning roadmap based on skill and user persona, matching platform courses
exports.generateRoadmap = async (req, res) => {
  const startTime = Date.now();
  try {
    const { skillName, currentSkills, experienceLevel, weeklyHours, goal } = req.body;
    const userId = req.user.id;

    if (!skillName || !experienceLevel || !weeklyHours || !goal) {
      return res.status(400).json({
        success: false,
        message: "Missing required profile fields for roadmap generation",
      });
    }

    // 1. Search the database for published platform courses matching this skill using CourseRecommendationService
    let availableCourses = [];
    try {
      availableCourses = await CourseRecommendationService.recommendCoursesForSkill(skillName);
    } catch (dbErr) {
      console.warn("Matching courses query failed:", dbErr.message);
    }

    // 2. Check Redis cache for same skill & experienceLevel combo
    let roadmapStructure = await RoadmapRepo.getCachedTemplate(skillName, experienceLevel);
    let fromCache = false;

    if (roadmapStructure) {
      fromCache = true;
      console.log(`[generateRoadmap] Cache HIT for ${skillName}:${experienceLevel}`);
    } else {
      console.log(`[generateRoadmap] Cache MISS for ${skillName}:${experienceLevel} - Calling AI`);
      
      // 3. Call AI Service to generate structure, sending matched platform courses as context
      roadmapStructure = await AIService.generateRoadmap({
        skillName,
        currentSkills,
        experienceLevel,
        weeklyHours,
        goal,
        availableCourses,
      });
    }

    // Validate and sanitize AI-suggested or cached course IDs in milestone resources (Phase 5)
    if (roadmapStructure.phases) {
      for (const phase of roadmapStructure.phases) {
        if (phase.milestones) {
          for (const milestone of phase.milestones) {
            if (milestone.resources) {
              for (const resource of milestone.resources) {
                if (resource.type === "course" && resource.courseId) {
                  try {
                    const courseExists = await Course.findOne({
                      _id: resource.courseId,
                      status: "Published",
                    });
                    if (!courseExists) {
                      console.warn(`[Validation] AI suggested invalid or draft course ID: ${resource.courseId}. Sanitizing to article.`);
                      resource.type = "article";
                      delete resource.courseId;
                    }
                  } catch (err) {
                    console.warn(`[Validation] Error validating course ID ${resource.courseId}: ${err.message}. Sanitizing to article.`);
                    resource.type = "article";
                    delete resource.courseId;
                  }
                }
              }
            }
          }
        }
      }
    }

    // 4. Count total milestones in generated structure
    const totalMilestones = roadmapStructure.phases.reduce(
      (sum, p) => sum + (p.milestones?.length || 0),
      0
    );

    // 5. Save roadmap to Database (mapping matching suggested course IDs + relevance scores)
    const roadmap = await RoadmapRepo.create({
      userId,
      skillName,
      userProfile: { currentSkills, experienceLevel, weeklyHours, goal },
      summary: roadmapStructure.summary,
      phases: roadmapStructure.phases,
      estimatedWeeks: roadmapStructure.estimatedWeeks,
      totalMilestones,
      chatHistory: [],
      suggestedCourses: availableCourses.map((c) => ({
        course: c._id,
        relevanceScore: c.relevanceScore,
      })),
    });

    // Save events to Analytics database (Phase 8)
    try {
      // Record roadmap generation event
      await AnalyticsService.trackEvent({
        event: "roadmap_generated",
        roadmapId: roadmap._id,
        userId,
      });

      // Record recommendation events for each matched course
      for (const c of availableCourses) {
        await AnalyticsService.trackEvent({
          event: "course_recommended",
          roadmapId: roadmap._id,
          userId,
          courseId: c._id,
        });
      }
    } catch (analyticsErr) {
      console.warn("Tracking generated roadmap analytics failed:", analyticsErr.message);
    }

    // Logging analytics console event
    console.log(
      JSON.stringify({
        event: "roadmap_generated",
        userId,
        skillName,
        experienceLevel,
        fromCache,
        totalMilestones,
        suggestedCoursesCount: availableCourses.length,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      })
    );

    res.status(201).json({
      success: true,
      fromCache,
      data: roadmap,
    });
  } catch (err) {
    console.error("[generateRoadmap] Error:", err.message);
    const isQuota = err.message.toLowerCase().includes("quota") || err.message.includes("429");
    res.status(isQuota ? 429 : 500).json({
      success: false,
      errorCode: isQuota ? "GEMINI_QUOTA_EXCEEDED" : "AI_GENERATION_FAILED",
      message: getCleanAIErrorMessage(err.message),
      retryAfter: isQuota ? 36 : 0,
      fallbackAttempted: true,
      errorDetails: err.message,
    });
  }
};

// POST /api/v1/ai/analytics/track
// Allows frontend to track user interactions such as clicking on recommended courses
exports.trackAnalytics = async (req, res) => {
  try {
    const { event, roadmapId, courseId } = req.body;
    const userId = req.user.id;

    if (!event || !["course_clicked"].includes(event)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unsupported event type",
      });
    }

    await AnalyticsService.trackEvent({
      event,
      roadmapId,
      userId,
      courseId,
    });

    res.status(200).json({
      success: true,
      message: "Event tracked successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to track analytics event",
    });
  }
};

// GET /api/v1/ai/roadmaps
// Retrieves all roadmaps created by the current student user
exports.getMyRoadmaps = async (req, res) => {
  try {
    const roadmaps = await RoadmapRepo.findByUser(req.user.id);
    res.status(200).json({
      success: true,
      count: roadmaps.length,
      data: roadmaps,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to retrieve roadmaps",
    });
  }
};

// GET /api/v1/ai/roadmaps/:id
// Retrieves a single detailed roadmap with owner validation and dynamically calculated course completion progress percentage
exports.getRoadmapById = async (req, res) => {
  try {
    const roadmap = await RoadmapRepo.findById(req.params.id, req.user.id);
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Learning roadmap not found",
      });
    }

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to retrieve roadmap details",
    });
  }
};

// PATCH /api/v1/ai/roadmaps/:roadmapId/milestone/:milestoneId/complete
// Marks a milestone inside the roadmap as complete and recalculates overall roadmap progress percentage
exports.completeMilestone = async (req, res) => {
  try {
    const { roadmapId, milestoneId } = req.params;
    const roadmap = await RoadmapRepo.completeMilestone(roadmapId, req.user.id, milestoneId);
    
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap or milestone not found",
      });
    }

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to update milestone progress",
    });
  }
};

// POST /api/v1/ai/roadmaps/:id/chat
// Enables student to query AI regarding roadmap goals, answering queries inside specific roadmap scope
exports.chatWithRoadmap = async (req, res) => {
  try {
    const roadmap = await RoadmapRepo.findById(req.params.id, req.user.id);
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    // Build specialized instruction context
    const systemCtx = [
      `You are an expert learning coach mentor specialized in teaching ${roadmap.skillName}.`,
      `The student is currently at ${roadmap.progressPercent}% completion overall in their roadmap.`,
      `Their learning goal is: "${roadmap.userProfile.goal}".`,
      `Keep your responses concise, action-oriented, encouraging, and clear.`,
    ].join(" ");

    // Map history to Gemini Chat API compatibility (alternating model/user roles)
    // We send the last 10 messages to save token limit
    const history = roadmap.chatHistory.slice(-10).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    history.push({ role: "user", parts: [{ text: message }] });

    const reply = await AIService.chat(systemCtx, history);

    // Persist chat interactions inside database
    await RoadmapRepo.appendChat(req.params.id, req.user.id, [
      { role: "user", content: message },
      { role: "assistant", content: reply },
    ]);

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error("[chatWithRoadmap] Error:", err.message);
    res.status(500).json({
      success: false,
      message: getCleanAIErrorMessage(err.message),
      errorDetails: err.message,
    });
  }
};
