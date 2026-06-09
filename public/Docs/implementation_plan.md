# Implementation Plan - AI Learning Roadmap Integration

This implementation plan details the integration of the AI Learning Roadmap feature into the StudyNotion MERN platform over the next 7 days, investing 1.5 hours daily. It ensures full UI consistency with the existing dashboard design.

## User Review Required

> [!IMPORTANT]
> - **Middleware Casing**: The original handbook references `isStudent` middleware, but in the codebase, it is named `IsStudent` (defined in `server/middlewares/Auth.js`). We will use `IsStudent` to maintain compatibility with the existing middleware.
> - **Redux Store**: We will add `aiRoadmap` reducer to `src/reducer/index.js` to handle the global state.
> - **Third-party Packages**: We need to install `@google/generative-ai` and `@upstash/redis` on the backend.
> - **UI Theme Consistency**: The frontend elements will strictly use existing Tailwind colors (`richblack-*` backgrounds, `yellow-50` primary buttons, `caribbeangreen-500` accents) and styling components matching the current student dashboard (e.g. `Sidebar`, `EnrolledCourses`).

## Open Questions

- Do you have the Upstash Redis credentials and Gemini API key ready for the `.env` file, or should we use mock services for testing during the early phases of local development?
- Would you like the "AI Roadmap" sidebar link to be positioned below "Cart" or as the top item in the sidebar?

---

## 7-Day Timeline (1.5 Hours Daily)

We will distribute the 11 integration sessions across 7 days, matching the daily 1.5-hour constraint.

### 📅 Day 1: Backend Setup, Schema, and Redis Caching
- **Goal**: Initialize the environment and data layer.
- **Tasks**:
  - Install dependencies: `@google/generative-ai`, `@upstash/redis`, `express-rate-limit`, `joi`, `http-errors` in `server/`.
  - Add configuration values in `server/.env`.
  - Create the MongoDB model [LearningRoadmap.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/models/LearningRoadmap.js) defining user roadmaps, phases, milestones, and chat history.
  - Create Upstash Redis client configuration in [redis.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/config/redis.js).

### 📅 Day 2: AI Service & Repository Layer
- **Goal**: Core AI integration and repository functions.
- **Tasks**:
  - Implement [AIService.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/services/AIService.js) to call Google Gemini 1.5 Flash in JSON mode.
  - Implement [RoadmapRepository.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/repositories/RoadmapRepository.js) wrapping database operations and Upstash Redis template caching.

### 📅 Day 3: Controller, Routes, Rate Limiting & Mount
- **Goal**: Expose backend APIs safely.
- **Tasks**:
  - Create the controller logic in [AIRoadmap.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/controllers/AIRoadmap.js).
  - Add route definitions and rate limiters in [routes/AIRoadmap.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/routes/AIRoadmap.js).
  - Mount the routes under `/api/v1/ai` in the main [server/index.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/index.js) file.
  - Run manual test API requests to verify responses.

### 📅 Day 4: Redux State Setup & Client API Connection
- **Goal**: Set up state management on the React frontend.
- **Tasks**:
  - Configure the endpoints in [src/services/apis.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/services/apis.js).
  - Create [aiRoadmapSlice.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/slices/aiRoadmapSlice.js) and register it in [src/reducer/index.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/reducer/index.js).
  - Write API operations in [src/services/operations/aiRoadmapAPI.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/services/operations/aiRoadmapAPI.js).

### 📅 Day 5: Multi-Step Dashboard Layout & Form UI
- **Goal**: Establish navigation and the first two screens.
- **Tasks**:
  - Register the route `/dashboard/ai-roadmap` in [src/App.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/App.js).
  - Add the sidebar entry "AI Roadmap" in [src/data/dashboard-links.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/data/dashboard-links.js).
  - Implement [AIRoadmapPage.jsx](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/Pages/AIRoadmapPage.jsx) as a multi-step component router.
  - Implement [SkillSearchScreen.jsx](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/Components/Core/AIRoadmap/SkillSearchScreen.jsx) and [UserProfileForm.jsx](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/Components/Core/AIRoadmap/UserProfileForm.jsx) using theme-consistent forms and buttons.

### 📅 Day 6: Roadmap Viewer & Milestone Card Integration
- **Goal**: Display generated roadmaps and support progress tracking.
- **Tasks**:
  - Implement [RoadmapViewer.jsx](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/Components/Core/AIRoadmap/RoadmapViewer.jsx) showing the summary, phases, and general stats.
  - Create [MilestoneCard.jsx](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/Components/Core/AIRoadmap/MilestoneCard.jsx) and [ProgressBar.jsx](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/Components/Core/AIRoadmap/ProgressBar.jsx) matching the style in `EnrolledCourses.jsx`.
  - Connect milestone toggle events to trigger progress patches on the database.

### 📅 Day 7: AI Chat Panel, Polish & Final Verification
- **Goal**: Complete the chat support panel and run final UI audits.
- **Tasks**:
  - Implement [ChatPanel.jsx](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/Components/Core/AIRoadmap/ChatPanel.jsx) with custom chat bubbles matching StudyNotion's colors.
  - Verify styling across standard desktop/mobile responsiveness.
  - Ensure pre-launch check compliance.

---

## Proposed Changes

### Backend

#### [NEW] [LearningRoadmap.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/models/LearningRoadmap.js)
MongoDB model storing roadmaps, including user profile details, referencing the sub-schemas, and managing suggested course mappings.

#### [NEW] [RoadmapResource.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/models/RoadmapResource.js)
Sub-schema storing individual learning resource links (video, articles, projects, and platform courses).

#### [NEW] [RoadmapMilestone.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/models/RoadmapMilestone.js)
Sub-schema storing milestones nested in roadmap phases.

#### [NEW] [RoadmapPhase.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/models/RoadmapPhase.js)
Sub-schema storing phases nested in roadmaps.

#### [NEW] [ChatMessage.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/models/ChatMessage.js)
Sub-schema storing chatbot conversation history message bubbles.

#### [NEW] [redis.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/config/redis.js)
Upstash Redis connector supporting global caching configurations.

#### [NEW] [AIService.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/services/AIService.js)
Gemini generative AI wrapper generating roadmaps and handling chat conversations.

#### [NEW] [RoadmapRepository.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/repositories/RoadmapRepository.js)
Data-access layer bridging MongoDB queries and Redis caching functions.

#### [NEW] [AIRoadmap.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/controllers/AIRoadmap.js)
Business logic controller containing API handlers for generation, list-fetch, milestone completions, and roadmap-specific chat context.

#### [NEW] [AIRoadmap.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/routes/AIRoadmap.js)
API routing mapping endpoints with role checks (`IsStudent`) and request rate limiters.

#### [NEW] [rateLimit.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/middlewares/rateLimit.js)
Rate limiting middleware encapsulating connection quotas to protect AI resources.

#### [MODIFY] [index.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/server/index.js)
Mount backend AI routes under `/api/v1/ai`.

---

### Frontend

#### [MODIFY] [apis.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/services/apis.js)
Register new `/api/v1/ai` endpoint mappings.

#### [NEW] [aiRoadmapSlice.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/slices/aiRoadmapSlice.js)
Redux toolkit state reducer for managing lists of roadmaps, active details, errors, and loading statuses.

#### [MODIFY] [index.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/reducer/index.js)
Register `aiRoadmap` reducer in the global store reducer.

#### [NEW] [aiRoadmapAPI.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/services/operations/aiRoadmapAPI.js)
Axios API operation dispatchers supporting loading spinners and react-hot-toast notifications.

#### [MODIFY] [App.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/App.js)
Add route path `/dashboard/ai-roadmap` inside private Student routes.

#### [MODIFY] [dashboard-links.js](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/data/dashboard-links.js)
Include "AI Roadmap" in the student dashboard navigation sidebar items.

#### [NEW] [AIRoadmapPage.jsx](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/Pages/AIRoadmapPage.jsx)
Dashboard child page displaying the three-step progression flow.

#### [NEW] [AIRoadmap Components](file:///d:/Working%20Projects/Study_Notion_MERN-stack/src/Components/Core/AIRoadmap)
Create component directory with:
- `SkillSearchScreen.jsx` - Skill entry UI
- `UserProfileForm.jsx` - Persona questionnaire UI
- `RoadmapViewer.jsx` - Roadmap detailed viewer UI
- `MilestoneCard.jsx` - Complete/pending milestone item
- `ProgressBar.jsx` - Core indicator widget
- `ChatPanel.jsx` - AI Coach conversational sidebar

---

## Verification Plan

### Automated Tests
- Run database checks on MongoDB and Redis to ensure cache hits/misses work correctly.
- Assert correct API payloads using manual script queries to the controllers.

### Manual Verification
- Test end-to-end integration by simulating a student account generating a new roadmap (e.g. for "React JS"), checking milestone progress, and using the chatbot assistant.
- Verify Tailwind consistency checks against original layout elements (sidebar links highlight correctly, margins are aligned with other dashboard options).
