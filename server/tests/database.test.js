const assert = require("assert");
const mongoose = require("mongoose");
const redis = require("../config/redis");
const LearningRoadmap = require("../models/LearningRoadmap");
const RoadmapRepo = require("../repositories/RoadmapRepository");

async function testDatabase() {
  console.log("▶ Running Database and Repository tests...");

  // 1. Verify MongoDB connection
  assert.ok(mongoose.connection.readyState === 1, "Mongoose should be connected to MongoDB. Ensure your local DB is running or MONGODB_URL is correct.");
  console.log("✓ MongoDB connection verified.");

  // 2. Verify Redis connection
  try {
    const pong = await redis.ping();
    assert.strictEqual(pong, "PONG", "Redis ping should return PONG");
    console.log("✓ Redis connection verified.");
  } catch (err) {
    console.log("⚠ Redis connection failed/skipped. Proceeding to fallback test...", err.message);
  }

  // 3. Test LearningRoadmap Schema insertion & retrieval (CRUD)
  const dummyUserId = new mongoose.Types.ObjectId();
  const testRoadmapData = {
    userId: dummyUserId,
    skillName: "Unit Testing Node.js",
    userProfile: {
      currentSkills: "Javascript",
      experienceLevel: "Beginner",
      weeklyHours: 5,
      goal: "Write clean unit tests for Express applications",
    },
    summary: "A simple roadmap generated for verification testing purposes.",
    phases: [
      {
        title: "Phase 1: Basics",
        description: "Learn basic assertions",
        order: 1,
        milestones: [
          {
            title: "Assertion basics",
            description: "Understand node assert module",
            estimatedDays: 2,
            order: 1,
            resources: []
          }
        ]
      }
    ],
    estimatedWeeks: 1,
    totalMilestones: 1,
  };

  console.log("Creating test roadmap in DB...");
  const created = await RoadmapRepo.create(testRoadmapData);
  assert.ok(created._id, "Roadmap should be saved with an _id");
  assert.strictEqual(created.skillName, "Unit Testing Node.js", "Saved skillName should match");
  console.log("✓ CRUD - Create test completed successfully.");

  console.log("Reading test roadmap from repository...");
  const retrieved = await RoadmapRepo.findById(created._id, dummyUserId);
  assert.ok(retrieved, "Roadmap should be retrieved by repository findById");
  assert.strictEqual(retrieved.skillName, "Unit Testing Node.js", "Retrieved skillName should match");
  console.log("✓ CRUD - Read test completed successfully.");

  console.log("Completing milestone inside test roadmap...");
  const milestoneId = retrieved.phases[0].milestones[0]._id;
  const updated = await RoadmapRepo.completeMilestone(created._id, dummyUserId, milestoneId);
  assert.ok(updated, "Roadmap should update correctly");
  assert.strictEqual(updated.completedMilestones, 1, "completedMilestones count should be 1");
  assert.strictEqual(updated.progressPercent, 100, "progressPercent should be 100%");
  console.log("✓ CRUD - Update milestone completion test completed successfully.");

  console.log("Cleaning up test roadmap from DB...");
  await LearningRoadmap.deleteOne({ _id: created._id });
  const checkDeleted = await LearningRoadmap.findById(created._id);
  assert.strictEqual(checkDeleted, null, "Roadmap document should be successfully deleted");
  console.log("✓ CRUD - Delete test completed successfully.");

  console.log("✓ Database and Repository tests completed successfully!");
}

module.exports = { testDatabase };
