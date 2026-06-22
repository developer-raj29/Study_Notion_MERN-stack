const Course = require("../models/Course");
const User = require("../models/User");

const TECH_RELATIONS = {
  "react": ["redux", "nextjs", "next.js", "javascript", "js", "html", "css", "frontend", "tailwind"],
  "react js": ["redux", "nextjs", "next.js", "javascript", "js", "html", "css", "frontend", "tailwind"],
  "reactjs": ["redux", "nextjs", "next.js", "javascript", "js", "html", "css", "frontend", "tailwind"],
  "node": ["express", "mongodb", "javascript", "js", "backend", "mongoose", "rest api"],
  "node js": ["express", "mongodb", "javascript", "js", "backend", "mongoose", "rest api"],
  "nodejs": ["express", "mongodb", "javascript", "js", "backend", "mongoose", "rest api"],
  "express": ["node", "mongodb", "backend", "javascript", "js", "mongoose"],
  "mongodb": ["mongoose", "node", "express", "backend", "nosql"],
  "javascript": ["typescript", "html", "css", "frontend", "es6"],
  "js": ["typescript", "html", "css", "frontend", "es6"],
  "next.js": ["react", "frontend", "backend", "javascript", "js", "tailwind"],
  "nextjs": ["react", "frontend", "backend", "javascript", "js", "tailwind"],
  "mern": ["react", "node", "mongodb", "express", "javascript", "js", "backend", "frontend"]
};

const SECONDARY_TOKENS = ["js", "javascript", "ts", "typescript", "stack", "framework", "library"];

/**
 * Calculates a relevance score (0-100) of a course for a given skillName
 */
function calculateRelevance(course, skillName) {
  const normalizedSkill = skillName.toLowerCase().trim();
  const skillTokens = normalizedSkill.split(/\s+/).filter(Boolean);

  if (skillTokens.length === 0) return 0;

  const courseName = (course.courseName || "").toLowerCase();
  const categoryName = (course.category?.name || "").toLowerCase();
  const tags = (course.tag || []).map((t) => t.toLowerCase());
  const description = (course.courseDescription || "").toLowerCase();
  const whatYouWillLearn = (course.whatYouWillLearn || "").toLowerCase();
  const combinedDesc = `${description} ${whatYouWillLearn}`;

  let score = 0;

  // 1. Direct/Exact Match on Course Name
  if (courseName.includes(normalizedSkill)) {
    score = 96;
  } else {
    // Overlap checks
    let matchedTokens = 0;
    skillTokens.forEach((token) => {
      if (token.length > 1 || token === "js") {
        if (courseName.includes(token)) {
          matchedTokens++;
        }
      }
    });

    if (matchedTokens > 0) {
      // Primary keyword overlap check (filter out secondary terms like 'js' to find core tech)
      const primaryTokens = skillTokens.filter((t) => !SECONDARY_TOKENS.includes(t));
      const matchesPrimary = primaryTokens.length > 0 && primaryTokens.every((t) => courseName.includes(t));

      if (matchesPrimary) {
        score = 90 + (matchedTokens / skillTokens.length) * 6; // e.g. 96% for "React Complete Bootcamp" vs "React JS"
      } else {
        // If there are primary tokens, but none are matched in the courseName, score should be low
        const matchedPrimaryCount = primaryTokens.filter((t) => courseName.includes(t)).length;
        if (primaryTokens.length > 0 && matchedPrimaryCount === 0) {
          score = 30 + (matchedTokens / skillTokens.length) * 12; // e.g. 36%
        } else {
          score = 80 + (matchedTokens / skillTokens.length) * 10;
        }
      }
    }
  }

  // 2. Tech Relations / Semantics (React -> Redux, Next.js, etc.)
  if (score < 70) {
    let relatedTerms = [];
    Object.keys(TECH_RELATIONS).forEach((key) => {
      if (normalizedSkill.includes(key) || key.includes(normalizedSkill)) {
        relatedTerms = [...relatedTerms, ...TECH_RELATIONS[key]];
      }
    });
    // Deduplicate and filter out self-tokens
    relatedTerms = [...new Set(relatedTerms)].filter((term) => !skillTokens.includes(term));

    let matchedRelated = 0;
    relatedTerms.forEach((term) => {
      if (courseName.includes(term)) {
        matchedRelated++;
      }
    });

    if (matchedRelated > 0) {
      // E.g. Redux Toolkit Masterclass gets 70 + 21 = 91%
      score = Math.max(score, 70 + Math.min(matchedRelated * 21, 25));
    }
  }

  // 3. Category & Tags Match Boost
  if (score < 50) {
    let matchedCatOrTag = false;
    skillTokens.forEach((token) => {
      if (categoryName.includes(token) || tags.some((t) => t.includes(token))) {
        matchedCatOrTag = true;
      }
    });

    if (matchedCatOrTag) {
      score = Math.max(score, 50);
    }
  }

  // 4. Description Substring Match
  if (score === 0) {
    let matchedDesc = 0;
    skillTokens.forEach((token) => {
      if (combinedDesc.includes(token)) {
        matchedDesc++;
      }
    });
    if (matchedDesc > 0) {
      score = Math.max(score, 30 + (matchedDesc / skillTokens.length) * 12);
    }
  }

  return Math.min(Math.round(score), 100);
}

/**
 * Recommends internal courses for a specific skillName
 * Returns top matching courses with relevanceScore > 70%, capped at 5 courses.
 */
exports.recommendCoursesForSkill = async (skillName) => {
  if (!skillName) return [];

  try {
    // Retrieve all Published courses
    const allCourses = await Course.find({ status: "Published" })
      .populate("category")
      .populate("instructor", "firstName lastName image");

    // Map and score courses
    const scoredCourses = allCourses
      .map((course) => {
        const score = calculateRelevance(course, skillName);
        return {
          ...course.toObject(),
          relevanceScore: score,
        };
      })
      .filter((c) => c.relevanceScore > 70) // Only relevance scores greater than 70%
      .sort((a, b) => b.relevanceScore - a.relevanceScore) // Highest match percentage first
      .slice(0, 5); // Limit 5 courses maximum

    return scoredCourses;
  } catch (err) {
    console.error("[recommendCoursesForSkill] Error during course matching:", err.message);
    return [];
  }
};

exports.calculateRelevance = calculateRelevance;
