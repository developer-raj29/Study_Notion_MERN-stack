const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY is missing in environment variables!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configured model for structured JSON output (Roadmaps)
const getRoadmapModel = () => {
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: parseFloat(process.env.GEMINI_TEMP) || 0.7,
      maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 4096,
    },
  });
};

// Configured model for normal text chat
const getChatModel = () => {
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });
};

module.exports = {
  genAI,
  getRoadmapModel,
  getChatModel,
};
