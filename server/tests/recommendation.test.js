const assert = require("assert");
const mongoose = require("mongoose");
const Course = require("../models/Course");
const Category = require("../models/Category");
const { recommendCoursesForSkill, calculateRelevance } = require("../services/courseRecommendationService");

async function testRecommendationService() {
  console.log("▶ Running Course Recommendation Service tests...");

  // 1. Create a dummy category
  const testCategory = await Category.create({
    name: "Web Development",
    description: "Web tech courses",
  });

  const dummyInstructor = new mongoose.Types.ObjectId();

  // 2. Insert mock courses: Published & Drafts with varying keywords
  const mockCoursesData = [
    {
      courseName: "React Complete Bootcamp Test",
      courseDescription: "Learn React from basic components to state management.",
      instructor: dummyInstructor,
      whatYouWillLearn: "React, state, hooks, lifecycle",
      price: 1000,
      tag: ["React", "Frontend", "JS"],
      category: testCategory._id,
      status: "Published",
    },
    {
      courseName: "Redux Toolkit Masterclass Test",
      courseDescription: "Modern state management library for React apps.",
      instructor: dummyInstructor,
      whatYouWillLearn: "Redux, state management, React",
      price: 1500,
      tag: ["Redux", "React", "State"],
      category: testCategory._id,
      status: "Published",
    },
    {
      courseName: "React Native Draft App Test",
      courseDescription: "Mobile apps with React.",
      instructor: dummyInstructor,
      whatYouWillLearn: "React Native",
      price: 2000,
      tag: ["React", "Mobile"],
      category: testCategory._id,
      status: "Draft", // Should be ignored by retrieve filter
    },
  ];

  const createdCourses = await Course.insertMany(mockCoursesData);
  console.log(`✓ Inserted ${createdCourses.length} mock courses for matching evaluation.`);

  try {
    // 3. Test exact matching logic via direct calculateRelevance calls
    console.log("Testing matching scores mathematically...");
    
    const reactBootcamp = createdCourses.find(c => c.courseName === "React Complete Bootcamp Test");
    const reduxMaster = createdCourses.find(c => c.courseName === "Redux Toolkit Masterclass Test");
    
    // Simulate node course
    const nodeCourse = {
      courseName: "Node.js Backend Essentials",
      courseDescription: "Build microservices and HTTP servers using Node.",
      whatYouWillLearn: "Node, express, REST API",
      tag: ["Node", "Backend"],
      category: { name: "Web Development" }
    };

    const scoreReact = calculateRelevance(reactBootcamp, "React JS");
    const scoreRedux = calculateRelevance(reduxMaster, "React JS");
    const scoreNode = calculateRelevance(nodeCourse, "React JS");

    console.log(`- React Complete Bootcamp Test score: ${scoreReact}%`);
    console.log(`- Redux Toolkit Masterclass Test score: ${scoreRedux}%`);
    console.log(`- Node.js Backend Essentials score: ${scoreNode}%`);

    assert.ok(scoreReact >= 80, "React Bootcamp should score high for React JS skill");
    assert.ok(scoreRedux >= 70, "Redux Masterclass should score high (> 70) for React JS skill");
    assert.ok(scoreNode < 70, "Node Backend should score low (< 70) for React JS skill");

    // 4. Test database retrieval filtering (Draft check & status checks)
    console.log("Testing database retrieval & status filters...");
    const recommendations = await recommendCoursesForSkill("React JS");

    // Assert that draft course is never recommended
    const hasDraft = recommendations.some((c) => c.courseName === "React Native Draft App Test");
    assert.strictEqual(hasDraft, false, "Draft courses must never be recommended");

    console.log("✓ Recommendation matching scores and database filters validated successfully!");
  } finally {
    // 5. Cleanup DB
    console.log("Cleaning up mock courses and category...");
    await Course.deleteMany({ _id: { $in: createdCourses.map((c) => c._id) } });
    await Category.deleteOne({ _id: testCategory._id });
    console.log("✓ Cleanup finished cleanly.");
  }
}

module.exports = { testRecommendationService };
