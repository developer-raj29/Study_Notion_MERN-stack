const { getRoadmapModel, getChatModel, genAI } = require("../config/gemini");

// Initialize model instance for roadmap generations
const model = getRoadmapModel();

// Build prompt for structured roadmap generation
function buildRoadmapPrompt(data) {
  const coursesPrompt = data.availableCourses && data.availableCourses.length > 0
    ? `We have the following internal courses available on our platform for this topic. When appropriate, recommend them in the milestone resources (use type "course" and the exact ID provided):
${data.availableCourses.map(c => `- "${c.courseName}" (ID: ${c._id})`).join("\n")}`
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

// Generate roadmap using resilient multi-model fallback and exponential backoff
exports.generateRoadmap = async (data) => {
  const prompt = buildRoadmapPrompt(data);
  
  // Resilient fallback models sequence
  const primaryModelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const modelList = [
    primaryModelName,
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite"
  ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicate models if any

  const delays = [2000, 5000, 10000]; // Wait delays for backoff retries
  let lastError = null;

  for (const modelName of modelList) {
    console.log(`[generateRoadmap] Attempting generation using model: ${modelName}`);
    
    const modelInstance = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: parseFloat(process.env.GEMINI_TEMP) || 0.7,
        maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 4096,
      },
    });

    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        const result = await modelInstance.generateContent(prompt);
        let text = result.response.text().trim();
        
        // Clean up markdown block format if Gemini mistakenly included it
        if (text.startsWith("```")) {
          text = text.replace(/^```(json)?/, "").replace(/```$/, "").trim();
        }
        
        // Clean trailing commas in JSON arrays/objects to prevent parsing errors
        text = text.replace(/,\s*([\]}])/g, "$1");
        
        const parsed = JSON.parse(text);
        validateRoadmapSchema(parsed);
        
        console.log(`[generateRoadmap] Generation successful with model: ${modelName}`);
        return parsed;
      } catch (err) {
        lastError = err;
        const errMsgLower = err.message?.toLowerCase() || "";
        const isTransientError = 
          errMsgLower.includes("503") || 
          errMsgLower.includes("high demand") || 
          errMsgLower.includes("quota") || 
          errMsgLower.includes("429") || 
          errMsgLower.includes("limit") || 
          errMsgLower.includes("service unavailable");
          
        const hasRetry = attempt < delays.length;

        if (isTransientError && hasRetry) {
          console.warn(`[generateRoadmap] Model ${modelName} returned transient error: ${err.message}. Attempt ${attempt + 1}/${delays.length + 1}. Retrying in ${delays[attempt] / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
        } else {
          // If it is a fatal error or we outran retries, jump to the next fallback model immediately
          console.warn(`[generateRoadmap] Model ${modelName} failed fatal/exhausted retries: ${err.message}. Trying next fallback model...`);
          break;
        }
      }
    }
  }

  throw new Error(`AI generation failed after trying all fallback models: ${lastError ? lastError.message : "Unknown error"}`);
};

// Conversational roadmap assistant chat
exports.chat = async (systemContext, messages) => {
  try {
    const chatModel = getChatModel();
    // In gemini-1.5-flash startChat systemInstruction can be passed inside model configuration
    const chat = chatModel.startChat({
      history: messages.slice(0, -1),
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      }
    });

    const lastMsg = messages[messages.length - 1].parts;
    
    // Prefix the last message parts with the system context instructions
    const result = await chat.sendMessage(`Context instructions: ${systemContext}\nUser Message: ${lastMsg[0].text}`);
    return result.response.text();
  } catch (err) {
    throw new Error(`AI chat failed: ${err.message}`);
  }
};

// Validate Gemini response structure
function validateRoadmapSchema(data) {
  if (!data.summary || !Array.isArray(data.phases)) {
    throw new Error("Invalid roadmap schema from AI");
  }
  if (data.phases.length < 2 || data.phases.length > 6) {
    throw new Error("Expected 2-6 phases");
  }
}
