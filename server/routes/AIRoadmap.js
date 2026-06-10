const express = require("express");
const router = express.Router();
const { auth, IsStudent } = require("../middlewares/Auth");
const { aiLimiter } = require("../middlewares/rateLimit");
const ctrl = require("../controllers/AIRoadmap");

// All AI learning roadmap endpoints require Student authentication
router.use(auth, IsStudent);

// API Endpoints
router.post("/generate-roadmap", aiLimiter, ctrl.generateRoadmap);
router.get("/roadmaps", ctrl.getMyRoadmaps);
router.get("/roadmaps/:id", ctrl.getRoadmapById);
router.patch("/roadmaps/:roadmapId/milestone/:milestoneId/complete", ctrl.completeMilestone);
router.post("/roadmaps/:id/chat", aiLimiter, ctrl.chatWithRoadmap);

module.exports = router;
