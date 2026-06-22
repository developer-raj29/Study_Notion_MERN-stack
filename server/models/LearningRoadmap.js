const mongoose = require("mongoose");
const phaseSchema = require("./RoadmapPhase");
const chatMessageSchema = require("./ChatMessage");

const learningRoadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    skillName: {
      type: String,
      required: true,
    },
    userProfile: {
      currentSkills: {
        type: String,
        default: "None",
      },
      experienceLevel: {
        type: String,
        required: true,
      },
      weeklyHours: {
        type: Number,
        required: true,
      },
      goal: {
        type: String,
        required: true,
      },
    },
    summary: {
      type: String,
      required: true,
    },
    phases: [phaseSchema],
    estimatedWeeks: {
      type: Number,
      required: true,
    },
    totalMilestones: {
      type: Number,
      required: true,
      default: 0,
    },
    completedMilestones: {
      type: Number,
      default: 0,
    },
    progressPercent: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },
    chatHistory: [chatMessageSchema],
    suggestedCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        relevanceScore: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("LearningRoadmap", learningRoadmapSchema);
