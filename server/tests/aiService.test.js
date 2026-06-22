const assert = require("assert");
const AIService = require("../services/AIService");

async function testAIService() {
  console.log("▶ Running AI Service tests...");

  const hasApiKey = 
    process.env.GROQ_API_KEY || 
    process.env.OPENROUTER_API_KEY || 
    process.env.GEMINI_API_KEY;

  if (!hasApiKey) {
    console.log("⚠ No AI provider keys (GROQ_API_KEY, OPENROUTER_API_KEY, GEMINI_API_KEY) are configured. Skipping live AI tests.");
    return;
  }

  // 1. Test generateRoadmap
  console.log("Testing generateRoadmap via AI Provider abstraction...");
  const dummyData = {
    skillName: "Test Node.js",
    currentSkills: "JavaScript",
    experienceLevel: "Beginner",
    weeklyHours: 10,
    goal: "Learn basic backend routing and servers",
    availableCourses: []
  };

  const roadmap = await AIService.generateRoadmap(dummyData);
  assert.ok(roadmap, "Roadmap response should not be empty");
  assert.ok(roadmap.summary, "Roadmap should contain a summary");
  assert.ok(Array.isArray(roadmap.phases), "Roadmap should contain phases array");
  assert.ok(roadmap.estimatedWeeks > 0, "Roadmap should have estimatedWeeks");
  console.log("✓ generateRoadmap successfully generated correct schema.");

  // 2. Test chat
  console.log("Testing AIService chat functionality...");
  const messages = [
    { role: "user", parts: [{ text: "Hello coach!" }] }
  ];
  const response = await AIService.chat("You are a helpful assistant.", messages);
  assert.ok(response, "Chat response should not be empty");
  assert.strictEqual(typeof response, "string", "Chat response should be a string");
  console.log("✓ chat successfully generated response.");

  console.log("✓ AI Service tests completed successfully!");
}

module.exports = { testAIService };
