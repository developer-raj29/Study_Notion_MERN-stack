const AIProvider = require("./AIProvider");

// Build prompt for structured roadmap generation
function buildRoadmapPrompt(data) {
  const coursesPrompt = data.availableCourses && data.availableCourses.length > 0
    ? `We have the following internal courses available on our platform for this topic:
${data.availableCourses.map(c => `- "${c.courseName}" (ID: ${c._id || c.courseId})`).join("\n")}

IMPORTANT:
Whenever relevant:
1. Prefer StudyNotion internal courses.
2. Recommend internal courses before external resources.
3. Use exact courseId (e.g. use the exact 24-character hex MongoDB ID provided above).
4. Only use external resources if no suitable internal course exists.
5. Keep recommendations educational, helpful, and natural.`
    : "";

  return `You are an expert learning coach. Create a personalised learning roadmap.

SKILL TO LEARN: ${data.skillName}
STUDENT BACKGROUND:
- Current skills: ${data.currentSkills || "None"}
- Experience level: ${data.experienceLevel}
- Weekly hours available: ${data.weeklyHours} hours/week
- Goal: ${data.goal}

${coursesPrompt}

Return a JSON object with EXACTLY this structure (no extra keys):
{
  "summary": "string (2-3 sentences overview)",
  "estimatedWeeks": number,
  "phases": [
    {
      "title": "string",
      "description": "string",
      "order": number,
      "milestones": [
        {
          "title": "string",
          "description": "string (what to do/build)",
          "estimatedDays": number,
          "order": number,
          "resources": [
            { 
              "title": "string", 
              "type": "video|article|practice|book|project|course",
              "courseId": "string (use the exact 24-character hex MongoDB course ID if type is 'course', otherwise omit this field)"
            }
          ]
        }
      ]
    }
  ]
}
Rules: 3-4 phases, 2-3 milestones each, realistic time estimates. Keep descriptions and summaries extremely concise (maximum 1-2 sentences per field) to prevent response truncation.
IMPORTANT: You MUST return a valid JSON object. Never include literal raw newline characters inside JSON string values (use "\\n" instead). Never include trailing commas in objects or arrays. Ensure the JSON output is complete and fully closed.`;
}

// Generate roadmap using resilient multi-provider abstraction layer
exports.generateRoadmap = async (data) => {
  const prompt = buildRoadmapPrompt(data);
  const text = await AIProvider.generateText(prompt, true);
  
  const parsed = JSON.parse(text);
  validateRoadmapSchema(parsed);
  return parsed;
};

// Conversational roadmap assistant chat delegator
exports.chat = async (systemContext, messages) => {
  try {
    // Map Gemini history format back to OpenAI role/content format
    const openAiMessages = messages.map((msg) => ({
      role: msg.role === "model" ? "assistant" : "user",
      content: msg.parts[0].text,
    }));

    return await AIProvider.chatCompletions(systemContext, openAiMessages);
  } catch (err) {
    throw new Error(`AI chat failed: ${err.message}`);
  }
};

// Validate AI response structure
function validateRoadmapSchema(data) {
  if (!data.summary || !Array.isArray(data.phases)) {
    throw new Error("Invalid roadmap schema from AI");
  }
  if (data.phases.length < 2 || data.phases.length > 6) {
    throw new Error("Expected 2-6 phases");
  }
}
