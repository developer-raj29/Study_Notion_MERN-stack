const mongoose = require("mongoose");

const RecommendationAnalyticsSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      enum: ["roadmap_generated", "course_recommended", "course_clicked", "course_purchased"],
      required: true,
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningRoadmap",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecommendationAnalytics", RecommendationAnalyticsSchema);
