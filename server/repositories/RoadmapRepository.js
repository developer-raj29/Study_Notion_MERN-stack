const mongoose = require("mongoose");
const LearningRoadmap = require("../models/LearningRoadmap");
const Course = require("../models/Course");
const redis = require("../config/redis");

const TTL = parseInt(process.env.AI_CACHE_TTL_SECONDS) || 86400; // # 24 hours

// Cache key builder
const cacheKey = (skill, level) =>
  `roadmap:template:${skill.toLowerCase().replace(/\s+/g, "-")}:${level}`;

// Aggregation Pipeline helper: Calculates course progress percentages for a list of course IDs in a single batch query
async function getCoursesProgressBatch(userId, courseIds) {
  if (!courseIds || courseIds.length === 0) return {};

  try {
    const objectIds = courseIds.map((id) => new mongoose.Types.ObjectId(id));
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Single aggregation pipeline mapping courses, sections, subsections, and student progress
    const progressData = await Course.aggregate([
      // Match relevant courses
      { $match: { _id: { $in: objectIds } } },
      
      // Lookup Sections
      {
        $lookup: {
          from: "sections",
          localField: "courseContent",
          foreignField: "_id",
          as: "sections",
        },
      },
      
      // Lookup Subsections (videos)
      {
        $lookup: {
          from: "subsections",
          localField: "sections.subSection",
          foreignField: "_id",
          as: "subsections",
        },
      },
      
      // Lookup student's progress document
      {
        $lookup: {
          from: "courseprogresses",
          let: { courseId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$courseID", "$$courseId"] },
                    { $eq: ["$userId", userObjectId] },
                  ],
                },
              },
            },
          ],
          as: "userProgress",
        },
      },
      
      // Map totals and completions counts
      {
        $project: {
          courseId: "$_id",
          totalSubsections: { $size: "$subsections" },
          completedCount: {
            $cond: {
              if: { $gt: [{ $size: "$userProgress" }, 0] },
              then: { $size: { $ifNull: [{ $arrayElemAt: ["$userProgress.completedVideos", 0] }, []] } },
              else: 0,
            },
          },
        },
      },
      
      // Calculate progress percentages
      {
        $project: {
          courseId: 1,
          progressPercentage: {
            $cond: {
              if: { $eq: ["$totalSubsections", 0] },
              then: 0,
              else: {
                $round: [
                  { $multiply: [{ $divide: ["$completedCount", "$totalSubsections"] }, 100] },
                  0,
                ],
              },
            },
          },
        },
      },
    ]);

    // Map the values back to course ID string keys
    const progressMap = {};
    progressData.forEach((item) => {
      progressMap[item.courseId.toString()] = item.progressPercentage;
    });

    return progressMap;
  } catch (err) {
    console.error("Aggregation batch query failed:", err.message);
    return {};
  }
}

// Save new roadmap to DB
exports.create = async (roadmapData) => {
  const roadmap = await LearningRoadmap.create(roadmapData);
  const key = cacheKey(roadmapData.skillName, roadmapData.userProfile.experienceLevel);
  
  // Cache the general structure (omit user-specific fields)
  try {
    await redis.setex(
      key,
      TTL,
      JSON.stringify({
        phases: roadmapData.phases,
        summary: roadmapData.summary,
        estimatedWeeks: roadmapData.estimatedWeeks,
      })
    );
  } catch (err) {
    console.warn("Failed to write template to Redis cache:", err.message);
  }
  
  return roadmap;
};

// Check Redis cache for skill+level template
exports.getCachedTemplate = async (skillName, experienceLevel) => {
  try {
    const key = cacheKey(skillName, experienceLevel);
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.warn("Redis read failed:", err.message);
    return null;
  }
};

// Get all student roadmaps (DB only)
exports.findByUser = async (userId) => {
  return LearningRoadmap.find({ userId })
    .select("-chatHistory")
    .sort({ createdAt: -1 });
};

// Get single roadmap with ownership check and dynamic course progress enrichment
exports.findById = async (id, userId) => {
  const roadmap = await LearningRoadmap.findOne({ _id: id, userId })
    .populate({
      path: "suggestedCourses.course",
      select: "courseName courseDescription thumbnail price ratingAndReviews whatYouWillLearn studentsEnrolled status instructor",
      populate: [
        { path: "instructor", select: "firstName lastName image" },
        { path: "ratingAndReviews" }
      ]
    });
  
  if (!roadmap) return null;

  const roadmapObj = roadmap.toObject();

  // Gather all course IDs in the roadmap to fetch their progresses in a single batch
  const courseIds = [];

  if (roadmapObj.suggestedCourses) {
    roadmapObj.suggestedCourses.forEach((item) => {
      if (item && item.course) {
        courseIds.push(item.course._id.toString());
      } else if (item) {
        // Fallback for unmigrated database documents
        const rawId = item._id ? item._id.toString() : item.toString();
        if (mongoose.Types.ObjectId.isValid(rawId)) {
          courseIds.push(rawId);
        }
      }
    });
  }

  if (roadmapObj.phases) {
    roadmapObj.phases.forEach((phase) => {
      if (phase.milestones) {
        phase.milestones.forEach((milestone) => {
          if (milestone.resources) {
            milestone.resources.forEach((resource) => {
              if (resource.type === "course" && resource.courseId) {
                courseIds.push(resource.courseId.toString());
              }
            });
          }
        });
      }
    });
  }

  // Fetch all course progresses in one aggregation query (DRY & high performance)
  const progressMap = await getCoursesProgressBatch(userId, [...new Set(courseIds)]);

  // Assign progress percentages back to top-level suggested courses
  if (roadmapObj.suggestedCourses) {
    roadmapObj.suggestedCourses.forEach((item) => {
      if (item && item.course) {
        item.course.progressPercentage = progressMap[item.course._id.toString()] || 0;
      } else if (item) {
        // Fallback for unmigrated database documents
        const rawId = item._id ? item._id.toString() : item.toString();
        item.progressPercentage = progressMap[rawId] || 0;
      }
    });
  }

  // Assign progress percentages back to course resources in milestones
  if (roadmapObj.phases) {
    roadmapObj.phases.forEach((phase) => {
      if (phase.milestones) {
        phase.milestones.forEach((milestone) => {
          if (milestone.resources) {
            milestone.resources.forEach((resource) => {
              if (resource.type === "course" && resource.courseId) {
                resource.courseProgress = progressMap[resource.courseId.toString()] || 0;
              }
            });
          }
        });
      }
    });
  }

  return roadmapObj;
};

// Asynchronous background self-healing migration logic for older schema roadmaps
async function runSuggestedCoursesMigration() {
  try {
    const roadmaps = await LearningRoadmap.find({
      suggestedCourses: { $exists: true }
    });
    for (const rm of roadmaps) {
      let modified = false;
      const newSuggested = rm.suggestedCourses.map((item) => {
        // If the item doesn't have a 'course' property but is a valid raw ObjectId, wrap it
        if (item && !item.course && mongoose.Types.ObjectId.isValid(item.toString())) {
          modified = true;
          return { course: item, relevanceScore: 100 };
        }
        return item;
      }).filter(Boolean);

      if (modified) {
        rm.suggestedCourses = newSuggested;
        await rm.save();
        console.log(`[Migration] Migrated suggestedCourses for roadmap ${rm._id}`);
      }
    }
  } catch (err) {
    console.error("[Migration] Roadmap suggestedCourses migration failed:", err.message);
  }
}

// Run migration asynchronously
setTimeout(runSuggestedCoursesMigration, 2000);

// Mark milestone complete
exports.completeMilestone = async (roadmapId, userId, milestoneId) => {
  const roadmap = await LearningRoadmap.findOne({ _id: roadmapId, userId });
  if (!roadmap) return null;

  for (const phase of roadmap.phases) {
    const ms = phase.milestones.id(milestoneId);
    if (ms) {
      ms.isCompleted = true;
      ms.completedAt = new Date();
      phase.isCompleted = phase.milestones.every((m) => m.isCompleted);
      break;
    }
  }

  const completed = roadmap.phases
    .flatMap((p) => p.milestones)
    .filter((m) => m.isCompleted).length;
  
  roadmap.completedMilestones = completed;
  roadmap.progressPercent = Math.round((completed / roadmap.totalMilestones) * 100);
  
  if (roadmap.progressPercent === 100) {
    roadmap.status = "completed";
  }

  return roadmap.save();
};

// Append chat message
exports.appendChat = async (roadmapId, userId, messages) => {
  return LearningRoadmap.findOneAndUpdate(
    { _id: roadmapId, userId },
    { $push: { chatHistory: { $each: messages } } },
    { new: true, select: "chatHistory" }
  );
};
