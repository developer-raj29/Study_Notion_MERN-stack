const mongoose = require("mongoose");
const milestoneSchema = require("./RoadmapMilestone");

const phaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
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
  milestones: [milestoneSchema],
});

module.exports = phaseSchema;
