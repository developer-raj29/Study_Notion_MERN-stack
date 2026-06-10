const mongoose = require("mongoose");
const resourceSchema = require("./RoadmapResource");

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  estimatedDays: {
    type: Number,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  resources: [resourceSchema],
});

module.exports = milestoneSchema;
