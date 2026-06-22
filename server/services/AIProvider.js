const { genAI } = require("../config/gemini");

const cooldowns = {
  groq: 0,
  openrouter: 0,
  gemini: 0,
};

const COOLDOWN_DURATION_MS = 60 * 1000; // 60 seconds

// Environment-driven configurations with safe fallback defaults
const GROQ_URL = process.env.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

const OPENROUTER_URL = process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function getApiKey(provider) {
  switch (provider) {
    case "groq":
      return process.env.GROQ_API_KEY;
    case "openrouter":
      return process.env.OPENROUTER_API_KEY;
    case "gemini":
      return process.env.GEMINI_API_KEY;
    default:
      return null;
  }
}

function isProviderHealthy(provider) {
  const apiKey = getApiKey(provider);
  if (!apiKey) return false;

  const cooldownTime = cooldowns[provider];
  if (cooldownTime && Date.now() < cooldownTime) {
    console.log(`[AIProvider] Provider ${provider} is on cooldown. Skipping.`);
    return false;
  }
  return true;
}

function markUnhealthy(provider) {
  cooldowns[provider] = Date.now() + COOLDOWN_DURATION_MS;
  console.warn(`[AIProvider] Circuit breaker triggered! Provider ${provider} put on cooldown for 60s.`);
}

/**
 * Clean Markdown JSON formatting characters and trailing commas
 */
function cleanJsonResponseText(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(json)?/, "").replace(/```$/, "").trim();
  }
  // Remove trailing commas to prevent parsing errors
  cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");
  return cleaned;
}

/**
 * Delay helper for transient retries
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Execute HTTP API request with transient retries
 */
async function fetchWithRetry(url, options, providerName, maxRetries = 2) {
  let lastError = null;
  const delays = [500, 1000];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429) {
        throw new Error(`STATUS_429: Rate limit or quota exceeded`);
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`STATUS_${response.status}: ${errText}`);
      }

      return await response.json();
    } catch (err) {
      lastError = err;
      const isRateLimit = err.message.includes("STATUS_429");
      const isTransient = err.message.includes("STATUS_503") || err.message.includes("STATUS_502") || err.message.includes("FetchError");

      if (isRateLimit) {
        // Quota errors fail immediately without retry to save latency
        break;
      }

      if (isTransient && attempt < maxRetries) {
        console.warn(`[AIProvider] Transient error on ${providerName} (Attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delays[attempt]}ms...`);
        await delay(delays[attempt]);
      } else {
        break;
      }
    }
  }

  throw lastError;
}

/**
 * 1. Groq completions helper
 */
async function callGroq(prompt, isJsonMode = true) {
  const apiKey = getApiKey("groq");
  const model = GROQ_MODEL;
  const url = GROQ_URL;

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const body = {
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  };

  if (isJsonMode) {
    body.response_format = { type: "json_object" };
  }

  const data = await fetchWithRetry(url, { method: "POST", headers, body: JSON.stringify(body) }, "groq");
  return data.choices[0].message.content;
}

/**
 * 2. OpenRouter completions helper
 */
async function callOpenRouter(prompt, isJsonMode = true) {
  const apiKey = getApiKey("openrouter");
  const model = OPENROUTER_MODEL;
  const url = OPENROUTER_URL;

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
    "X-Title": "StudyNotion",
  };

  const body = {
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  };

  if (isJsonMode) {
    body.response_format = { type: "json_object" };
  }

  const data = await fetchWithRetry(url, { method: "POST", headers, body: JSON.stringify(body) }, "openrouter");
  return data.choices[0].message.content;
}

/**
 * 3. Gemini SDK completions helper
 */
async function callGemini(prompt, isJsonMode = true) {
  const modelName = GEMINI_MODEL;
  const modelInstance = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      ...(isJsonMode ? { responseMimeType: "application/json" } : {}),
    },
  });

  const result = await modelInstance.generateContent(prompt);
  return result.response.text();
}

/**
 * Reusable text generation with priority routing: Groq -> OpenRouter -> Gemini
 */
exports.generateText = async (prompt, isJsonMode = true) => {
  const providers = ["groq", "openrouter", "gemini"];
  let lastError = null;

  for (const provider of providers) {
    if (!isProviderHealthy(provider)) continue;

    console.log(`[AIProvider] Attempting text completion via: ${provider}`);
    try {
      let rawResponse;
      if (provider === "groq") {
        rawResponse = await callGroq(prompt, isJsonMode);
      } else if (provider === "openrouter") {
        rawResponse = await callOpenRouter(prompt, isJsonMode);
      } else if (provider === "gemini") {
        rawResponse = await callGemini(prompt, isJsonMode);
      }

      console.log(`[AIProvider] Successful completion with: ${provider}`);
      return cleanJsonResponseText(rawResponse);
    } catch (err) {
      console.error(`[AIProvider] Completion failed on ${provider}:`, err.message);
      lastError = err;
      markUnhealthy(provider);
    }
  }

  throw new Error(`AI generation failed across all available providers. Last error: ${lastError?.message}`);
};

/**
 * OpenAI chat format completions mapping
 */
async function callOpenAiStyleChat(providerName, url, model, messages, apiKey, headers = {}) {
  const body = {
    model,
    messages,
    temperature: 0.7,
  };

  const allHeaders = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    ...headers,
  };

  const data = await fetchWithRetry(url, { method: "POST", headers: allHeaders, body: JSON.stringify(body) }, providerName);
  return data.choices[0].message.content;
}

/**
 * Reusable conversational chat completions: Groq -> OpenRouter -> Gemini
 * Takes systemContext (String) and openAiMessages (Array of { role, content })
 */
exports.chatCompletions = async (systemContext, openAiMessages) => {
  const providers = ["groq", "openrouter", "gemini"];
  let lastError = null;

  // Insert system context at the beginning of the messages list
  const fullMessages = [
    { role: "system", content: systemContext },
    ...openAiMessages,
  ];

  for (const provider of providers) {
    if (!isProviderHealthy(provider)) continue;

    console.log(`[AIProvider] Attempting chatcompletion via: ${provider}`);
    try {
      if (provider === "groq") {
        const apiKey = getApiKey("groq");
        return await callOpenAiStyleChat("groq", GROQ_URL, GROQ_MODEL, fullMessages, apiKey);
      }

      if (provider === "openrouter") {
        const apiKey = getApiKey("openrouter");
        const extraHeaders = {
          "HTTP-Referer": process.env.FRONTEND_URL || "https://studynotion-mern-project.vercel.app",
          "X-Title": "StudyNotion",
        };
        return await callOpenAiStyleChat("openrouter", OPENROUTER_URL, OPENROUTER_MODEL, fullMessages, apiKey, extraHeaders);
      }

      if (provider === "gemini") {
        // Fallback to Gemini SDK's startChat API
        const modelName = GEMINI_MODEL;
        const modelInstance = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.7,
          },
        });

        // Map messages back to Gemini's roles: 'model' or 'user' (excluding the first system message)
        const geminiHistory = openAiMessages.slice(0, -1).map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

        const chat = modelInstance.startChat({
          history: geminiHistory,
        });

        const lastUserMessage = openAiMessages[openAiMessages.length - 1].content;
        const result = await chat.sendMessage(`Context instructions: ${systemContext}\nUser Message: ${lastUserMessage}`);
        return result.response.text();
      }
    } catch (err) {
      console.error(`[AIProvider] Chat completion failed on ${provider}:`, err.message);
      lastError = err;
      markUnhealthy(provider);
    }
  }

  throw new Error(`AI Chat completions failed across all available providers. Last error: ${lastError?.message}`);
};
