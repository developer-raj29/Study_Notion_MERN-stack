const TECH_RELATIONS = {
  "react": ["redux", "nextjs", "next.js", "javascript", "js", "html", "css", "frontend", "tailwind"],
  "react js": ["redux", "nextjs", "next.js", "javascript", "js", "html", "css", "frontend", "tailwind"],
  "reactjs": ["redux", "nextjs", "next.js", "javascript", "js", "html", "css", "frontend", "tailwind"]
};

const SECONDARY_TOKENS = ["js", "javascript", "ts", "typescript", "stack", "framework", "library"];

const course = {
  courseName: "Redux Toolkit Masterclass",
  courseDescription: "Modern state management library for React apps.",
  whatYouWillLearn: "Redux, state management, React",
  tag: ["Redux", "React", "State"],
  category: { name: "Web Development" }
};

const skillName = "React JS";

const normalizedSkill = skillName.toLowerCase().trim();
const skillTokens = normalizedSkill.split(/\s+/).filter(Boolean);

const courseName = (course.courseName || "").toLowerCase();
const categoryName = (course.category?.name || "").toLowerCase();
const tags = (course.tag || []).map((t) => t.toLowerCase());
const description = (course.courseDescription || "").toLowerCase();
const whatYouWillLearn = (course.whatYouWillLearn || "").toLowerCase();
const combinedDesc = `${description} ${whatYouWillLearn}`;

console.log("skillTokens:", skillTokens);
console.log("courseName:", courseName);
console.log("categoryName:", categoryName);
console.log("tags:", tags);
console.log("combinedDesc:", combinedDesc);

let score = 0;

// 1. Direct/Exact Match on Course Name
if (courseName.includes(normalizedSkill)) {
  score = 96;
  console.log("Exact match matched! Score:", score);
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

  console.log("matchedTokens on courseName:", matchedTokens);

  if (matchedTokens > 0) {
    const primaryTokens = skillTokens.filter((t) => !SECONDARY_TOKENS.includes(t));
    const matchesPrimary = primaryTokens.length > 0 && primaryTokens.every((t) => courseName.includes(t));

    console.log("primaryTokens:", primaryTokens, "matchesPrimary:", matchesPrimary);

    if (matchesPrimary) {
      score = 90 + (matchedTokens / skillTokens.length) * 6;
    } else {
      score = 80 + (matchedTokens / skillTokens.length) * 10;
    }
    console.log("Token match score:", score);
  }
}

// 2. Tech Relations / Semantics
if (score < 70) {
  let relatedTerms = [];
  Object.keys(TECH_RELATIONS).forEach((key) => {
    if (normalizedSkill.includes(key) || key.includes(normalizedSkill)) {
      relatedTerms = [...relatedTerms, ...TECH_RELATIONS[key]];
    }
  });
  relatedTerms = [...new Set(relatedTerms)].filter((term) => !skillTokens.includes(term));
  console.log("relatedTerms:", relatedTerms);

  let matchedRelated = 0;
  relatedTerms.forEach((term) => {
    if (courseName.includes(term)) {
      matchedRelated++;
    }
  });

  console.log("matchedRelated on courseName:", matchedRelated);

  if (matchedRelated > 0) {
    score = Math.max(score, 70 + Math.min(matchedRelated * 21, 25));
    console.log("Tech relation score:", score);
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
    console.log("Category/Tag boost score:", score);
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
    console.log("Description match score:", score);
  }
}

console.log("Final score calculated:", score);
