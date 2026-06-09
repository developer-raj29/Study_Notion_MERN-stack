# 🚀 AI Learning Roadmap Feature — Complete Production Implementation Handbook

**StudyNotion MERN Stack Platform**  
_Senior Architect Edition • Hinglish + English • Free & Cost-Effective Stack_

---

## Table of Contents

1. [Feature Overview & Business Logic](#section-01--feature-overview--business-logic)
2. [Technical Architecture](#section-02--technical-architecture)
3. [Complete Project Setup](#section-03--complete-project-setup-from-scratch)
4. [Complete Backend Implementation](#section-04--complete-backend-implementation)
5. [Database Schema & Redis Caching Strategy](#section-05--database-schema--redis-caching-strategy)
6. [Complete Frontend Implementation](#section-06--complete-frontend-implementation)
7. [Security, Scalability & Deployment](#section-07--security-scalability--deployment)
8. [AI-Assisted Development Workflow](#section-08--ai-assisted-development-workflow)
9. [Monitoring, Observability & Production Checklist](#section-09--monitoring-observability--production-checklist)
10. [7-Day Implementation Timeframe (1.5 Hours/Day)](#section-10--7-day-implementation-timeframe)

---

## SECTION 01 • Feature Overview & Business Logic

### 1.1 What Is This Feature?

The AI Learning Roadmap feature adds an intelligent, personalised learning assistant inside the StudyNotion student dashboard. When a student selects a skill they want to master, the AI creates a structured, phase-by-phase roadmap customised to their background, goals, and available time — and then tracks their progress as they learn.

> **🗣 Hinglish Explanation:** Socho ek student hai jo React.js sikhna chahta hai. Lekin kaise start kare, kya order mein sikhna chahiye, kitne time lagenge — yeh sab confusing hai. Yahi problem solve karta hai yeh feature. Student apna background batata hai (Basic HTML/CSS pata hai) aur AI ek step-by-step plan bana deta hai. Phir student jaise-jaise steps complete karta hai, progress track hota rehta hai.

### Business Value

- Increases platform stickiness — students return daily to track progress
- Differentiates StudyNotion from Udemy/Coursera (no competitor has this)
- Creates personalised learning paths without instructor involvement
- AI chat support reduces student abandonment when they get stuck
- Roadmap data gives platform insights into most-demanded skills

---

### 1.2 User Journey (The 4-Screen Flow)

Every student interaction with this feature follows a 4-screen journey:

| Screen              | Component               | What Happens                   | User Action              |
| ------------------- | ----------------------- | ------------------------------ | ------------------------ |
| 1 — Skill Search    | `SkillSearchScreen.jsx` | Student types or picks a skill | Select a skill → Next    |
| 2 — Profile Form    | `UserProfileForm.jsx`   | Student fills background info  | Fill form → Generate     |
| 3 — Roadmap View    | `RoadmapViewer.jsx`     | AI roadmap is displayed        | Read phases & milestones |
| 4 — Progress + Chat | Inside RoadmapViewer    | Mark done, ask AI questions    | Tick milestones, chat    |

---

### 1.3 Free & Cost-Effective Technology Stack

The previous guide used Anthropic Claude (paid). This handbook upgrades to a fully free-tier stack for early-stage development, with a clear migration path when you scale.

| Layer         | Free Choice                    | Why Free                      | When to Upgrade             |
| ------------- | ------------------------------ | ----------------------------- | --------------------------- |
| AI Model      | Google Gemini 1.5 Flash (free) | 1M tokens/day free, JSON mode | Scale → Gemini Pro / GPT-4o |
| AI Fallback   | OpenRouter Free Models         | Llama-3, Mistral free tier    | Scale → OpenRouter paid     |
| Database      | MongoDB Atlas M0 (free)        | 512MB, always-free cluster    | Scale → M10 paid cluster    |
| Cache         | Upstash Redis (free)           | 10K cmd/day, serverless       | Scale → Upstash Pro         |
| Backend Host  | Render.com Free Tier           | 750 hrs/month, auto-deploy    | Scale → Render paid/Railway |
| Frontend Host | Vercel (free)                  | Unlimited static deploys      | Scale → Vercel Pro          |

> **ℹ️ Why Gemini Flash over OpenAI?** Google Gemini 1.5 Flash is FREE up to 1,500 requests/day and 1M tokens/day via Google AI Studio. It supports JSON mode natively — perfect for structured roadmap generation. OpenAI GPT-3.5 has been removed from free tier. GPT-4o-mini costs money. Gemini Flash is significantly faster than most alternatives for structured output tasks.

---

## SECTION 02 • Technical Architecture

### 2.1 High-Level Architecture Diagram

_Read this as: who talks to whom, and in what direction._

```
┌─────────────────────────────────────────────────────────────┐
│                    STUDENT BROWSER                          │
│  React App (Vercel)                                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Redux Store → AIRoadmapPage → 4 Screen Components    │  │
│  └─────────────────────┬─────────────────────────────────┘  │
└────────────────────────┼────────────────────────────────────┘
                         │ HTTPS (Axios)
┌────────────────────────▼────────────────────────────────────┐
│                 EXPRESS BACKEND (Render.com)                 │
│  ┌─────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Auth   │  │  AIRoadmap   │  │   Redis Cache Layer   │  │
│  │Middleware│  │  Controller  │  │   (Upstash Redis)     │  │
│  └─────────┘  └──────┬───────┘  └───────────────────────┘  │
└───────────────────────┼────────────────────────────────────┘
          ┌─────────────┼─────────────────┐
          │             │                  │
   ┌──────▼──────┐ ┌───▼──────┐  ┌───────▼──────┐
   │  Google      │ │ MongoDB  │  │  Upstash     │
   │  Gemini API  │ │  Atlas   │  │  Redis Cache │
   │  (Free Tier) │ │ (Free)   │  │  (Free Tier) │
   └─────────────┘ └──────────┘  └──────────────┘
```

---

### 2.2 Clean Architecture Layers

We follow Clean Architecture — each layer has one job and talks only to the layer below it. This is a senior developer best practice.

> **🗣 Hinglish Explanation:** Clean Architecture ek concept hai jisme code ko layers mein divide karte hain. Frontend layer sirf UI handle karta hai. Service layer API calls karta hai. Controller layer business logic handle karta hai. Model layer database se baat karta hai. Ek layer doosri layer ke internal details nahi jaanta — yeh 'separation of concerns' kehlata hai.

| Layer        | Location                                   | Responsibility                    | Talks To         |
| ------------ | ------------------------------------------ | --------------------------------- | ---------------- |
| Presentation | `src/Components/Core/AIRoadmap/`           | UI rendering, user events         | Redux Store only |
| State        | `src/slices/aiRoadmapSlice.js`             | Client-side state management      | Service layer    |
| Service      | `src/services/operations/aiRoadmapAPI.js`  | HTTP calls, error handling        | Backend API      |
| Route        | `server/routes/AIRoadmap.js`               | URL definitions, middleware chain | Controller       |
| Controller   | `server/controllers/AIRoadmap.js`          | Business logic, orchestration     | Service + Repo   |
| Service      | `server/services/AIService.js`             | AI API calls, prompt building     | Gemini API       |
| Repository   | `server/repositories/RoadmapRepository.js` | DB queries, Redis cache           | MongoDB + Redis  |
| Model        | `server/models/LearningRoadmap.js`         | Schema definition only            | MongoDB          |

---

### 2.3 Request-Response Lifecycle

This is the exact journey of one API call from the moment a student clicks **'Generate My Roadmap'**:

1. Student clicks button in `UserProfileForm.jsx`
2. `generateRoadmap()` called in `aiRoadmapAPI.js`
3. Axios POST → `/api/v1/ai/generate-roadmap`
4. `auth` middleware → verifies JWT token
5. `isStudent` middleware → checks `accountType === 'Student'`
6. AIRoadmap controller → receives validated request
7. RoadmapRepository → checks Redis cache for same skill+level combo
   - Cache **HIT**? → return cached roadmap structure (partial template)
   - Cache **MISS**? → call `AIService.generateRoadmap()`
8. AIService → builds prompt → calls Gemini Flash API
9. Gemini returns JSON → AIService validates & parses
10. Controller → personalises template → saves to MongoDB
11. RoadmapRepository → caches result in Redis (TTL: 24h)
12. Controller → returns roadmap to frontend
13. Redux store updated → RoadmapViewer renders

**Total time: ~3-6 seconds** (AI call is slowest step)

---

## SECTION 03 • Complete Project Setup From Scratch

### 3.1 Full Folder Structure

```
Study_Notion_MERN-stack/
├── src/                                    ← Frontend (React)
│   ├── Pages/
│   │   └── AIRoadmapPage.jsx               ← NEW: Main page (step router)
│   ├── Components/
│   │   └── Core/
│   │       └── AIRoadmap/                  ← NEW: Feature folder
│   │           ├── index.js                ← Barrel export
│   │           ├── SkillSearchScreen.jsx   ← Screen 1
│   │           ├── UserProfileForm.jsx     ← Screen 2
│   │           ├── RoadmapViewer.jsx       ← Screen 3+4
│   │           ├── MilestoneCard.jsx       ← Reusable card
│   │           ├── ProgressBar.jsx         ← Progress widget
│   │           └── ChatPanel.jsx           ← AI chat component
│   ├── slices/
│   │   └── aiRoadmapSlice.js               ← NEW: Redux slice
│   └── services/
│       └── operations/
│           └── aiRoadmapAPI.js             ← NEW: API operations
│
└── server/                                 ← Backend (Express)
    ├── models/
    │   └── LearningRoadmap.js              ← NEW: MongoDB schema
    ├── controllers/
    │   └── AIRoadmap.js                    ← NEW: Business logic
    ├── services/                           ← NEW: Service layer folder
    │   └── AIService.js                    ← NEW: Gemini API calls
    ├── repositories/                       ← NEW: Data access layer
    │   └── RoadmapRepository.js            ← NEW: DB + Redis queries
    ├── config/
    │   └── redis.js                        ← NEW: Upstash connection
    ├── middleware/
    │   └── rateLimit.js                    ← NEW: Rate limiting
    └── routes/
        └── AIRoadmap.js                    ← NEW: Route definitions
```

---

### 3.2 Backend Package Installation

Run these commands inside the `server/` folder:

```bash
cd server

# Google Gemini SDK (Free AI)
npm install @google/generative-ai

# Upstash Redis client (Free caching)
npm install @upstash/redis

# Rate limiting (security)
npm install express-rate-limit

# Input validation
npm install joi

# Better error handling
npm install http-errors
```

---

### 3.3 Environment Variables

Create these in `server/.env` — **never commit this file to Git**:

```env
# ─── Existing vars (keep these) ────────────────
MONGODB_URL=mongodb+srv://...
JWT_SECRET=your_jwt_secret
PORT=8000

# ─── NEW: Google Gemini (Free) ──────────────────
# Get from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSy...

# ─── NEW: Upstash Redis (Free) ──────────────────
# Get from: https://console.upstash.com
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# ─── NEW: Feature Config ────────────────────────
AI_CACHE_TTL_SECONDS=86400    # 24 hours
AI_RATE_LIMIT_PER_HOUR=10     # per student
NODE_ENV=development
```

> **✅ Getting Free API Keys**
>
> - **Gemini:** Go to [aistudio.google.com](https://aistudio.google.com) → Sign in → Get API Key → Create API Key in new project.
> - **Upstash:** Go to [console.upstash.com](https://console.upstash.com) → Create Database → Choose 'Global' region → Copy REST URL and Token.
> - **MongoDB Atlas:** [atlas.mongodb.com](https://atlas.mongodb.com) → Create Free Cluster → Connect → Copy connection string.
>
> All three are completely free with no credit card required for basic usage.

---

## SECTION 04 • Complete Backend Implementation

### 4.1 Redis Configuration — `server/config/redis.js`

_Purpose: Establish a connection to Upstash Redis. Used by the repository layer for caching._

> **🗣 Hinglish Explanation:** Redis ek 'super fast memory storage' hai. Database slow hota hai (disk se read karta hai), Redis fast hota hai (RAM se read karta hai). Hum commonly requested roadmap templates Redis mein save karte hain taaki baar-baar Gemini API ko call na karna pade. Upstash serverless Redis hai — yeh free mein available hai aur setup bahut aasan hai.

```js
// server/config/redis.js
const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Test connection on startup
redis
  .ping()
  .then((res) => {
    console.log("✅ Redis connected:", res);
  })
  .catch((err) => {
    console.warn("⚠️ Redis unavailable — running without cache:", err.message);
  });

module.exports = redis;
```

---

### 4.2 AI Service — `server/services/AIService.js`

_Purpose: All Gemini API communication. This is the ONLY file that talks to the AI. Isolating AI calls makes it easy to swap providers later._

```js
// server/services/AIService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use Flash for speed and cost (free tier)
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json", // JSON mode!
    temperature: 0.7,
    maxOutputTokens: 4096,
  },
});

// ─── Build the structured prompt ──────────────────────────
function buildRoadmapPrompt(data) {
  return `You are an expert learning coach. Create a personalised learning roadmap.

SKILL TO LEARN: ${data.skillName}
STUDENT BACKGROUND:
- Current skills: ${data.currentSkills || "None"}
- Experience level: ${data.experienceLevel}
- Weekly hours available: ${data.weeklyHours} hours/week
- Goal: ${data.goal}

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
          "resources": [{ "title": "string", "type": "video|article|practice|book|project" }]
        }
      ]
    }
  ]
}
Rules: 3-5 phases, 3-5 milestones each, realistic time estimates.`;
}

// ─── Main export: generate roadmap ────────────────────────
exports.generateRoadmap = async (data) => {
  const prompt = buildRoadmapPrompt(data);

  // Retry once on failure (Gemini can occasionally timeout)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);
      validateRoadmapSchema(parsed); // throws if invalid
      return parsed;
    } catch (err) {
      if (attempt === 2)
        throw new Error(`AI generation failed: ${err.message}`);
      await new Promise((r) => setTimeout(r, 2000)); // wait 2s before retry
    }
  }
};

// ─── AI Chat ──────────────────────────────────────────────
exports.chat = async (systemContext, messages) => {
  const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = chatModel.startChat({ history: messages.slice(0, -1) });
  const lastMsg = messages[messages.length - 1].parts;
  const result = await chat.sendMessage(lastMsg);
  return result.response.text();
};

// ─── Schema validator ────────────────────────────────────
function validateRoadmapSchema(data) {
  if (!data.summary || !Array.isArray(data.phases))
    throw new Error("Invalid roadmap schema from AI");
  if (data.phases.length < 2 || data.phases.length > 6)
    throw new Error("Expected 2-6 phases");
}
```

---

### 4.3 Repository — `server/repositories/RoadmapRepository.js`

_Purpose: All database and cache operations. Controllers should NEVER write Mongoose queries directly — that is the repository's job._

> **🗣 Hinglish Explanation:** Repository pattern ek design pattern hai. Controller yeh nahi jaanta ki data MongoDB mein hai ya Redis mein — woh sirf repository ko bolata hai 'mujhe yeh data chahiye'. Repository decide karta hai: pehle Redis check karo, agar nahi mila toh MongoDB se lo, aur Redis mein save karo future ke liye. Yeh 'caching strategy' kehlati hai.

```js
// server/repositories/RoadmapRepository.js
const LearningRoadmap = require("../models/LearningRoadmap");
const redis = require("../config/redis");

const TTL = parseInt(process.env.AI_CACHE_TTL_SECONDS) || 86400;

// ─── Cache key builder ────────────────────────────────────
const cacheKey = (skill, level) =>
  `roadmap:template:${skill.toLowerCase().replace(/\s+/g, "-")}:${level}`;

// ─── Save new roadmap to DB ───────────────────────────────
exports.create = async (roadmapData) => {
  const roadmap = await LearningRoadmap.create(roadmapData);
  const key = cacheKey(
    roadmapData.skillName,
    roadmapData.userProfile.experienceLevel,
  );
  await redis.setex(
    key,
    TTL,
    JSON.stringify({
      phases: roadmapData.phases,
      summary: roadmapData.summary,
      estimatedWeeks: roadmapData.estimatedWeeks,
    }),
  );
  return roadmap;
};

// ─── Check cache for skill+level template ─────────────────
exports.getCachedTemplate = async (skillName, experienceLevel) => {
  try {
    const key = cacheKey(skillName, experienceLevel);
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  } // cache failure is non-fatal
};

// ─── Get user's roadmaps (DB only) ───────────────────────
exports.findByUser = async (userId) => {
  return LearningRoadmap.find({ userId })
    .select("-chatHistory") // exclude heavy chat data
    .sort({ createdAt: -1 });
};

// ─── Get single roadmap with ownership check ─────────────
exports.findById = async (id, userId) => {
  return LearningRoadmap.findOne({ _id: id, userId });
};

// ─── Mark milestone complete ─────────────────────────────
exports.completeMilestone = async (roadmapId, userId, milestoneId) => {
  const roadmap = await LearningRoadmap.findOne({ _id: roadmapId, userId });
  if (!roadmap) return null;

  for (const phase of roadmap.phases) {
    const ms = phase.milestones.id(milestoneId);
    if (ms) {
      ms.isCompleted = true;
      ms.completedAt = new Date();
      phase.isCompleted = phase.milestones.every((m) => m.isCompleted);
      break;
    }
  }

  const completed = roadmap.phases
    .flatMap((p) => p.milestones)
    .filter((m) => m.isCompleted).length;
  roadmap.completedMilestones = completed;
  roadmap.progressPercent = Math.round(
    (completed / roadmap.totalMilestones) * 100,
  );
  if (roadmap.progressPercent === 100) roadmap.status = "completed";

  return roadmap.save();
};

// ─── Append chat message ──────────────────────────────────
exports.appendChat = async (roadmapId, userId, messages) => {
  return LearningRoadmap.findOneAndUpdate(
    { _id: roadmapId, userId },
    { $push: { chatHistory: { $each: messages } } },
    { new: true, select: "chatHistory" },
  );
};
```

---

### 4.4 Controller — `server/controllers/AIRoadmap.js`

_Purpose: Orchestrates the business logic. Calls services and repositories, handles errors, returns HTTP responses._

```js
// server/controllers/AIRoadmap.js
const AIService = require("../services/AIService");
const RoadmapRepo = require("../repositories/RoadmapRepository");

// POST /api/v1/ai/generate-roadmap
exports.generateRoadmap = async (req, res) => {
  try {
    const { skillName, currentSkills, experienceLevel, weeklyHours, goal } =
      req.body;
    const userId = req.user.id;

    // ─── Step 1: Check Redis cache ─────────────────────────
    let roadmapStructure = await RoadmapRepo.getCachedTemplate(
      skillName,
      experienceLevel,
    );
    let fromCache = false;

    if (roadmapStructure) {
      fromCache = true;
      console.log(`Cache HIT for ${skillName}:${experienceLevel}`);
    } else {
      // ─── Step 2: Call Gemini AI ──────────────────────────
      console.log(`Cache MISS — calling Gemini for ${skillName}`);
      roadmapStructure = await AIService.generateRoadmap({
        skillName,
        currentSkills,
        experienceLevel,
        weeklyHours,
        goal,
      });
    }

    // ─── Step 3: Count milestones ─────────────────────────
    const totalMilestones = roadmapStructure.phases.reduce(
      (sum, p) => sum + (p.milestones?.length || 0),
      0,
    );

    // ─── Step 4: Save to MongoDB ──────────────────────────
    const roadmap = await RoadmapRepo.create({
      userId,
      skillName,
      userProfile: { currentSkills, experienceLevel, weeklyHours, goal },
      summary: roadmapStructure.summary,
      phases: roadmapStructure.phases,
      estimatedWeeks: roadmapStructure.estimatedWeeks,
      totalMilestones,
      chatHistory: [],
    });

    res.status(201).json({ success: true, fromCache, data: roadmap });
  } catch (err) {
    console.error("[generateRoadmap]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/ai/roadmaps
exports.getMyRoadmaps = async (req, res) => {
  try {
    const roadmaps = await RoadmapRepo.findByUser(req.user.id);
    res.json({ success: true, count: roadmaps.length, data: roadmaps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/ai/roadmaps/:id
exports.getRoadmapById = async (req, res) => {
  try {
    const roadmap = await RoadmapRepo.findById(req.params.id, req.user.id);
    if (!roadmap)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: roadmap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/v1/ai/roadmaps/:roadmapId/milestone/:milestoneId/complete
exports.completeMilestone = async (req, res) => {
  try {
    const roadmap = await RoadmapRepo.completeMilestone(
      req.params.roadmapId,
      req.user.id,
      req.params.milestoneId,
    );
    if (!roadmap)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: roadmap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/ai/roadmaps/:id/chat
exports.chatWithRoadmap = async (req, res) => {
  try {
    const roadmap = await RoadmapRepo.findById(req.params.id, req.user.id);
    if (!roadmap)
      return res.status(404).json({ success: false, message: "Not found" });

    const { message } = req.body;
    const systemCtx = [
      `You are a learning coach for ${roadmap.skillName}.`,
      `Student is ${roadmap.progressPercent}% complete.`,
      `Goal: ${roadmap.userProfile.goal}. Be concise and actionable.`,
    ].join(" ");

    // Build Gemini chat history format
    const history = roadmap.chatHistory.slice(-10).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    history.push({ role: "user", parts: [{ text: message }] });

    const reply = await AIService.chat(systemCtx, history);

    await RoadmapRepo.appendChat(req.params.id, req.user.id, [
      { role: "user", content: message },
      { role: "assistant", content: reply },
    ]);

    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
```

---

### 4.5 Routes — `server/routes/AIRoadmap.js`

```js
// server/routes/AIRoadmap.js
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { auth, isStudent } = require("../middlewares/Auth");
const ctrl = require("../controllers/AIRoadmap");

// Rate limiter — max 10 AI calls per student per hour
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: parseInt(process.env.AI_RATE_LIMIT_PER_HOUR) || 10,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: {
    success: false,
    message: "Too many requests. Try again in an hour.",
  },
});

// All routes require student auth
router.use(auth, isStudent);

router.post("/generate-roadmap", aiLimiter, ctrl.generateRoadmap);
router.get("/roadmaps", ctrl.getMyRoadmaps);
router.get("/roadmaps/:id", ctrl.getRoadmapById);
router.patch(
  "/roadmaps/:roadmapId/milestone/:milestoneId/complete",
  ctrl.completeMilestone,
);
router.post("/roadmaps/:id/chat", aiLimiter, ctrl.chatWithRoadmap);

module.exports = router;
```

---

### 4.6 Mount in `server/index.js`

Add these two lines alongside your existing route mounts:

```js
// In server/index.js — add after existing route mounts
const aiRoadmapRoutes = require("./routes/AIRoadmap");
app.use("/api/v1/ai", aiRoadmapRoutes);
```

---

## SECTION 05 • Database Schema & Redis Caching Strategy

### 5.1 LearningRoadmap MongoDB Model

_Location: `server/models/LearningRoadmap.js`_

> **🗣 Hinglish Explanation:** MongoDB mein documents hote hain jo JSON jaisa dikhte hain. Ek 'LearningRoadmap' document mein saara roadmap data hoga — phases, milestones, chat history, progress — sab kuch. Mongoose schema yeh define karta hai ki kis field ka kya type hai aur kya required hai.

| Field                      | Type                     | Purpose                      | Notes                      |
| -------------------------- | ------------------------ | ---------------------------- | -------------------------- |
| `userId`                   | ObjectId → User          | Who owns this roadmap        | Required, indexed          |
| `skillName`                | String                   | React.js, Python, etc.       | Required                   |
| `userProfile`              | Object                   | Snapshot of user at gen time | level, hours, goal, skills |
| `phases`                   | Array of PhaseSchema     | The actual roadmap content   | 3-5 phases                 |
| `phases[].milestones`      | Array of MilestoneSchema | Tasks within each phase      | 3-5 each                   |
| `milestones[].isCompleted` | Boolean                  | Progress tracking            | Default: false             |
| `totalMilestones`          | Number                   | Pre-calculated count         | Avoids re-counting         |
| `progressPercent`          | Number                   | 0-100 progress               | Updated on complete        |
| `status`                   | Enum                     | active/completed/paused      | Default: active            |
| `chatHistory`              | Array                    | AI conversation history      | Last 50 messages kept      |
| `createdAt / updatedAt`    | Date                     | Auto-managed by Mongoose     | `timestamps: true`         |

---

### 5.2 Redis Caching Strategy

We cache roadmap templates (not user-specific data) to avoid repeated AI calls for the same skill + level combination.

```
Cache Key Format:
  roadmap:template:{normalized-skill}:{experience-level}

Examples:
  roadmap:template:react-js:Beginner
  roadmap:template:machine-learning:Intermediate
  roadmap:template:system-design:Advanced

TTL: 24 hours (86400 seconds)
     After 24h, AI generates a fresh roadmap (AI knowledge improves over time)

What is cached:     { summary, phases, estimatedWeeks }
What is NOT cached: userId, userProfile, chatHistory, progress

Cache Hit Rate Target: 70%+ (popular skills get cached quickly)
Cost saving: Each cache hit saves one Gemini API call (~2-4 seconds)
```

| Scenario                               | Redis | Gemini | DB    | Time     |
| -------------------------------------- | ----- | ------ | ----- | -------- |
| First student asks for React beginner  | MISS  | Called | Write | ~5 sec   |
| Second student asks for React beginner | HIT   | Skip   | Write | ~1 sec   |
| Any student asks for rare skill        | MISS  | Called | Write | ~5 sec   |
| Getting user's existing roadmaps       | Skip  | Skip   | Read  | <0.5 sec |

---

## SECTION 06 • Complete Frontend Implementation

### 6.1 Redux Slice — `src/slices/aiRoadmapSlice.js`

> **🗣 Hinglish Explanation:** Redux ek global state manager hai. Jab roadmap generate hota hai, woh data Redux store mein save hota hai. Dono RoadmapViewer aur ChatPanel same Redux state se data lete hain. Isse prop-drilling se bachte hain — har component ko props nahi paas karne padte.

```js
// src/slices/aiRoadmapSlice.js
import { createSlice } from "@reduxjs/toolkit";

const aiRoadmapSlice = createSlice({
  name: "aiRoadmap",
  initialState: {
    roadmaps: [], // all user's roadmaps (list view)
    activeRoadmap: null, // currently viewed roadmap (detail view)
    loading: false, // global loading state for AI calls
    error: null, // error message if API fails
  },
  reducers: {
    setRoadmaps: (s, a) => {
      s.roadmaps = a.payload;
    },
    setActiveRoadmap: (s, a) => {
      s.activeRoadmap = a.payload;
    },
    setLoading: (s, a) => {
      s.loading = a.payload;
    },
    setError: (s, a) => {
      s.error = a.payload;
    },
    // Update roadmap in list + active (after milestone complete)
    updateRoadmap: (s, a) => {
      const idx = s.roadmaps.findIndex((r) => r._id === a.payload._id);
      if (idx !== -1) s.roadmaps[idx] = a.payload;
      if (s.activeRoadmap?._id === a.payload._id) s.activeRoadmap = a.payload;
    },
    clearError: (s) => {
      s.error = null;
    },
  },
});

export const {
  setRoadmaps,
  setActiveRoadmap,
  setLoading,
  setError,
  updateRoadmap,
  clearError,
} = aiRoadmapSlice.actions;
export default aiRoadmapSlice.reducer;
```

---

### 6.2 API Operations — `src/services/operations/aiRoadmapAPI.js`

_This is the bridge between Redux and the backend. Every API call lives here._

```js
// src/services/operations/aiRoadmapAPI.js
import { apiConnector } from "../apiconnector";
import { AI_ROADMAP_API } from "../apis";
import toast from "react-hot-toast";
import {
  setLoading,
  setActiveRoadmap,
  setRoadmaps,
  setError,
  updateRoadmap,
} from "../../slices/aiRoadmapSlice";

// ─── Generate Roadmap ─────────────────────────────────────
export const generateRoadmap = (data, token) => async (dispatch) => {
  dispatch(setLoading(true));
  const toastId = toast.loading("AI is building your roadmap... (5-10 sec)");
  try {
    const res = await apiConnector("POST", AI_ROADMAP_API.GENERATE, data, {
      Authorization: `Bearer ${token}`,
    });
    dispatch(setActiveRoadmap(res.data.data));
    toast.success("Roadmap created!", { id: toastId });
    return res.data.data;
  } catch (err) {
    const msg = err?.response?.data?.message || "Failed to generate roadmap";
    dispatch(setError(msg));
    toast.error(msg, { id: toastId });
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

// ─── Get all roadmaps ─────────────────────────────────────
export const fetchMyRoadmaps = (token) => async (dispatch) => {
  try {
    const res = await apiConnector("GET", AI_ROADMAP_API.MY_ROADMAPS, null, {
      Authorization: `Bearer ${token}`,
    });
    dispatch(setRoadmaps(res.data.data));
  } catch (err) {
    toast.error("Could not load roadmaps");
  }
};

// ─── Complete a milestone ─────────────────────────────────
export const markMilestoneComplete =
  (roadmapId, milestoneId, token) => async (dispatch) => {
    try {
      const res = await apiConnector(
        "PATCH",
        AI_ROADMAP_API.COMPLETE_MILESTONE(roadmapId, milestoneId),
        {},
        { Authorization: `Bearer ${token}` },
      );
      dispatch(updateRoadmap(res.data.data));
      toast.success("Milestone completed! 🎉");
    } catch (err) {
      toast.error("Could not save progress");
    }
  };
```

---

### 6.3 Update `src/services/apis.js`

```js
// Add to src/services/apis.js
const BASE = process.env.REACT_APP_BASE_URL;

export const AI_ROADMAP_API = {
  GENERATE: BASE + "/api/v1/ai/generate-roadmap",
  MY_ROADMAPS: BASE + "/api/v1/ai/roadmaps",
  BY_ID: (id) => `${BASE}/api/v1/ai/roadmaps/${id}`,
  COMPLETE_MILESTONE: (rid, mid) =>
    `${BASE}/api/v1/ai/roadmaps/${rid}/milestone/${mid}/complete`,
  CHAT: (id) => `${BASE}/api/v1/ai/roadmaps/${id}/chat`,
};
```

---

### 6.4 Main Page — `src/Pages/AIRoadmapPage.jsx`

```jsx
// src/Pages/AIRoadmapPage.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyRoadmaps } from "../services/operations/aiRoadmapAPI";
import SkillSearchScreen from "../Components/Core/AIRoadmap/SkillSearchScreen";
import UserProfileForm from "../Components/Core/AIRoadmap/UserProfileForm";
import RoadmapViewer from "../Components/Core/AIRoadmap/RoadmapViewer";

const STEPS = ["Select Skill", "Your Background", "Your Roadmap"];

export default function AIRoadmapPage() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);
  const { roadmaps, activeRoadmap } = useSelector((s) => s.aiRoadmap);

  const [step, setStep] = useState(0);
  const [skillName, setSkillName] = useState("");

  useEffect(() => {
    dispatch(fetchMyRoadmaps(token));
  }, []);

  return (
    <div className="mx-auto max-w-4xl py-10 px-4">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center
              text-sm font-semibold transition-all
              ${
                i < step
                  ? "bg-caribbeangreen-500 text-white"
                  : i === step
                    ? "bg-yellow-50 text-richblack-900 ring-2 ring-yellow-200"
                    : "bg-richblack-700 text-richblack-400"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span
              className={
                i === step ? "text-white font-medium" : "text-richblack-400"
              }
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="w-8 h-px bg-richblack-600" />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <SkillSearchScreen
          onSelect={(name) => {
            setSkillName(name);
            setStep(1);
          }}
        />
      )}
      {step === 1 && (
        <UserProfileForm
          skillName={skillName}
          onBack={() => setStep(0)}
          onGenerated={() => setStep(2)}
        />
      )}
      {step === 2 && activeRoadmap && (
        <RoadmapViewer
          onNewRoadmap={() => {
            setStep(0);
            setSkillName("");
          }}
        />
      )}
    </div>
  );
}
```

---

## SECTION 07 • Security, Scalability & Deployment

### 7.1 Security Checklist

| Concern               | Risk                          | Our Solution                            | Status    |
| --------------------- | ----------------------------- | --------------------------------------- | --------- |
| API Key Exposure      | Frontend exposes Gemini key   | Key ONLY in `server/.env`               | ✅ Solved |
| Unauthorized AI calls | Non-students misuse AI        | `isStudent` middleware on all AI routes | ✅ Solved |
| Rate Limiting         | One user burns all free quota | 10 calls/hour per student               | ✅ Solved |
| Prompt Injection      | User crafts malicious prompts | Validate schema, sanitize inputs        | ✅ Solved |
| Data Ownership        | Student A reads B's roadmap   | `userId` check in all DB queries        | ✅ Solved |
| Chat History Size     | DB bloat from long chats      | Keep only last 50 messages              | ✅ Solved |
| CORS                  | Unauthorized origins call API | CORS configured in `index.js`           | ✅ Solved |

> **⚠️ Never Do This:** NEVER put `GEMINI_API_KEY` in your React frontend code or `.env` at the root level. NEVER call the Gemini API directly from the browser — users can inspect Network tab and steal your key. Always proxy AI calls through your backend. The server is the only one that knows the API key.

---

### 7.2 Free Deployment Guide

#### Backend on Render.com

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo → Choose `server/` as root directory
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add all environment variables from `server/.env` in Render dashboard
6. Free tier: 750 hrs/month, spins down after 15 min inactivity (acceptable for projects)

#### Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → Import Project → Connect GitHub
2. Framework: Create React App
3. Add `REACT_APP_BASE_URL` = your Render backend URL
4. Deploy — Vercel auto-deploys on every git push

> **ℹ️ Render Free Tier Limitation:** Render free services 'spin down' after 15 minutes of inactivity — first request after spin-down takes ~30 seconds.
>
> - **Solution 1:** Implement a 'Wake up!' loading screen with progress bar when first connecting.
> - **Solution 2:** Use a free cron job service ([cron-job.org](https://cron-job.org)) to ping your backend every 10 minutes.
> - **Solution 3:** When you have users, upgrade to Render Starter ($7/month) — no spin-down.

---

### 7.3 Scalability Roadmap

When your platform grows, here is the upgrade path for each component:

| Component      | Free Tier Limit     | When to Upgrade            | Upgrade Option           |
| -------------- | ------------------- | -------------------------- | ------------------------ |
| Gemini Flash   | 1500 req/day free   | At 100+ active students    | Gemini Pro / GPT-4o-mini |
| Upstash Redis  | 10K cmd/day free    | At 1000+ daily requests    | Upstash Pay-as-you-go    |
| MongoDB Atlas  | 512MB storage       | At ~5000 roadmaps stored   | Atlas M10 ($57/month)    |
| Render Backend | Spins down (free)   | Immediately for production | Render Starter ($7/mo)   |
| Rate Limits    | 10 AI calls/hr/user | Paid users get more        | Per-plan rate limits     |

---

## SECTION 08 • AI-Assisted Development Workflow

### 8.1 Breaking the Feature Into AI Prompts

The biggest mistake developers make when using AI tools (Cursor, Claude, Copilot) is giving too much context at once. Break this feature into these exact prompt sessions:

> **🗣 Hinglish Explanation:** AI tools ko ek baar mein sara feature explain karne ki galti mat karo. Ek file, ek responsibility — yahi sahi approach hai. Pehle backend models banao. Phir services. Phir controllers. Phir routes. Phir frontend. Har step mein AI ko batao: 'Yeh file already exist karti hai: [paste karo]' — context dena zaroori hai.

| Session # | Task for AI          | Files to Paste as Context                   | What to Ask                        |
| --------- | -------------------- | ------------------------------------------- | ---------------------------------- |
| 1         | Create MongoDB model | Existing `User.js`, `CourseProgress.js`     | Create `LearningRoadmap.js` schema |
| 2         | Create Redis config  | `server/config/cloudinary.js` (pattern)     | Create `redis.js` using Upstash    |
| 3         | Create AI service    | Nothing (fresh file)                        | Create `AIService.js` for Gemini   |
| 4         | Create repository    | `LearningRoadmap.js`, `redis.js`            | Create `RoadmapRepository.js`      |
| 5         | Create controller    | `AIService.js`, `RoadmapRepository.js`      | Create `AIRoadmap.js` controller   |
| 6         | Create routes        | Existing `routes/Course.js` (pattern)       | Create `routes/AIRoadmap.js`       |
| 7         | Redux slice          | Existing `authSlice.js` (pattern)           | Create `aiRoadmapSlice.js`         |
| 8         | API operations       | Existing `studentFeaturesAPI.js`, `apis.js` | Create `aiRoadmapAPI.js`           |
| 9         | SkillSearchScreen    | Existing `EnrolledCourses.jsx` (pattern)    | Create `SkillSearchScreen.jsx`     |
| 10        | UserProfileForm      | Existing Settings form code                 | Create `UserProfileForm.jsx`       |
| 11        | RoadmapViewer        | `aiRoadmapSlice.js`, `aiRoadmapAPI.js`      | Create `RoadmapViewer.jsx`         |

---

### 8.2 High-Quality AI Prompt Templates

#### Template 1: Creating a new backend file

```
I'm building an EdTech platform called StudyNotion (MERN stack).
I need to create [FILE NAME] which is responsible for [PURPOSE].

Here is the existing file it should follow as a pattern:
[PASTE EXISTING SIMILAR FILE]

The new file needs to:
- [Requirement 1]
- [Requirement 2]

These are the imports/dependencies available:
- [Package 1]
- [Package 2]

Follow these coding standards:
- Use async/await with try-catch
- Export named functions (not default)
- Add a comment above each function explaining its purpose
- Handle all errors gracefully

Return ONLY the file code, no explanation needed.
```

#### Template 2: Debugging a specific error

```
I'm getting this error in [FILE NAME]:
[PASTE EXACT ERROR MESSAGE]

Here is the relevant code:
[PASTE CODE SNIPPET]

The function is called from [CALLER FILE]:
[PASTE CALLER CODE]

What I've already tried:
- [Attempt 1]
- [Attempt 2]

What is causing this error and how do I fix it?
Explain why the error happens, then give me the fixed code.
```

---

### 8.3 VS Code / Cursor Workspace Setup

#### Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** — fast component scaffolding
- **Prettier** — code formatting (set format on save)
- **ESLint** — catch bugs before runtime
- **MongoDB for VS Code** — browse your Atlas data without leaving the editor
- **REST Client or Thunder Client** — test APIs without leaving VS Code
- **GitLens** — visualise Git history on every line

#### Recommended Folder Navigation

Pin these folders to your VS Code sidebar for this feature:

- `server/controllers/AIRoadmap.js`
- `server/services/AIService.js`
- `server/repositories/RoadmapRepository.js`
- `src/Components/Core/AIRoadmap/` (whole folder)
- `src/slices/aiRoadmapSlice.js`

#### Git Workflow

```bash
# Create a feature branch
git checkout -b feature/ai-learning-roadmap

# Commit in layers — one commit per section
git commit -m "feat: add LearningRoadmap model"
git commit -m "feat: add AI service with Gemini"
git commit -m "feat: add roadmap controller and routes"
git commit -m "feat: add frontend Redux slice and components"

# PR review before merging to main
git diff main..feature/ai-learning-roadmap
```

---

### 8.4 Testing Strategy

#### Backend Testing Checklist

| Test                     | Tool                     | What to Check                          |
| ------------------------ | ------------------------ | -------------------------------------- |
| `POST /generate-roadmap` | Postman/Thunder          | Returns valid roadmap JSON with phases |
| Cache hit                | Postman (2nd request)    | Response time < 1s, `fromCache: true`  |
| Rate limit               | Postman (11 rapid calls) | 11th call returns 429 error            |
| Auth guard               | No JWT token             | Returns 401 Unauthorized               |
| Role guard               | Instructor JWT           | Returns 403 Forbidden                  |
| Milestone complete       | PATCH endpoint           | `progressPercent` increases correctly  |
| Chat endpoint            | `POST /chat`             | Returns string reply from AI           |

#### Frontend Testing Checklist

- Step 1: Can pick a skill from popular list and custom input
- Step 2: Form validation works — shows errors for empty required fields
- Step 3: Loading state shows during AI generation (5-10 sec)
- Step 3: Roadmap renders with all phases and milestones
- Step 4: Checking a milestone updates progress bar in real-time
- Step 4: Chat panel sends and receives messages correctly
- Redux DevTools: confirm state updates correctly at each step

---

## SECTION 09 • Monitoring, Observability & Production Checklist

### 9.1 Logging Strategy

Add structured logging at key points to diagnose issues in production:

```js
// Add to AIRoadmap controller — structured logs
console.log(
  JSON.stringify({
    event: "roadmap_generated",
    userId: userId,
    skillName: skillName,
    experienceLevel: experienceLevel,
    fromCache: fromCache,
    totalMilestones: totalMilestones,
    durationMs: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  }),
);
```

---

### 9.2 Free Monitoring Tools

- **Render.com Dashboard** — CPU, memory, request logs (built-in)
- **MongoDB Atlas Monitoring** — query performance, slow queries
- **Upstash Redis Console** — cache hit rate, memory usage
- **UptimeRobot** (free) — ping your API every 5 min, alert if down
- **Sentry.io** (free tier) — catch uncaught exceptions with stack traces

---

### 9.3 Pre-Launch Production Checklist

| Item                               | How to Verify                                  | Done? |
| ---------------------------------- | ---------------------------------------------- | ----- |
| `GEMINI_API_KEY` set in Render env | Check Render dashboard env vars                | ☐     |
| `UPSTASH` URLs set in Render env   | Check Render dashboard env vars                | ☐     |
| Rate limiting enabled              | Send 11 rapid requests → get 429               | ☐     |
| Auth on all AI routes              | Call without token → get 401                   | ☐     |
| CORS allows frontend domain        | Check `server/index.js` cors config            | ☐     |
| MongoDB indexes on `userId`        | Add index: `LearningRoadmap.index({userId:1})` | ☐     |
| Error boundaries in React          | Wrap `AIRoadmapPage` in `ErrorBoundary`        | ☐     |
| Loading states for all async ops   | Slow network → spinner visible                 | ☐     |
| Render wake-up solution            | Cron job or loading screen                     | ☐     |
| Test with real student account     | Full 4-screen flow works end-to-end            | ☐     |

---

## SECTION 10 • 7-Day Implementation Timeframe (1.5 Hours/Day)

Here is our daily breakdown for implementing this feature within a strict **7-day** window, investing **1.5 hours daily** (total 10.5 hours).

### 📅 Day 1 — Setup, Database Schema & Caching Layer (1.5 Hours)

- Install NPM packages (`@google/generative-ai`, `@upstash/redis`, `express-rate-limit`, `joi`, `http-errors`).
- Set up environment variables in `server/.env`.
- Implement MongoDB model `LearningRoadmap.js` for storing roadmaps.
- Set up Redis config `redis.js` for cached response.

### 📅 Day 2 — AI Service & Repository Layer (1.5 Hours)

- Create `AIService.js` using Gemini 1.5 Flash SDK.
- Build prompt generation logic and JSON schemas.
- Implement repository helper `RoadmapRepository.js` for DB CRUD and Cache fetch/save operations.

### 📅 Day 3 — Backend Controller & Routing (1.5 Hours)

- Write controllers for roadmap generation, milestone completion, and chat context.
- Define routing paths in `routes/AIRoadmap.js` with authentication & student validations (`IsStudent`).
- Mount AI routes in `server/index.js`.
- Test controllers and operations locally using Postman/REST client.

### 📅 Day 4 — Redux State & Frontend API Connectors (1.5 Hours)

- Add endpoints mapping in `src/services/apis.js`.
- Create Redux slice `aiRoadmapSlice.js`.
- Add slice to root reducer list in `src/reducer/index.js`.
- Implement async API functions in `src/services/operations/aiRoadmapAPI.js`.

### 📅 Day 5 — Multi-Step Layout UI & Search/Profile Forms (1.5 Hours)

- Add sidebar link metadata in `src/data/dashboard-links.js`.
- Add router path in `src/App.js` under student routes.
- Create dashboard component `AIRoadmapPage.jsx` for stepping state.
- Design `SkillSearchScreen.jsx` & `UserProfileForm.jsx` matching existing design colors.

### 📅 Day 6 — Roadmap Detailed Viewer & Milestone Progress (1.5 Hours)

- Build detailed Accordion-based viewer `RoadmapViewer.jsx`.
- Implement `MilestoneCard.jsx` and progress bar component `ProgressBar.jsx`.
- Connect checklist state changes to call PATCH API in background.

### 📅 Day 7 — Chat Support Panel, Testing & Verification (1.5 Hours)

- Integrate conversational chat panel `ChatPanel.jsx`.
- Perform UI layout responsiveness check and visual consistency reviews.
- Audit authentication layers, error catchers, and final launch checks.

---

> **You now have everything you need to build this feature.**
> Start with Section 3 (setup), then Section 4 (backend), then Section 6 (frontend).
> **Build → Test → Commit → Repeat. You've got this. 🚀**
