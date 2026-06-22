const mongoose = require("mongoose");
const Course = require("../models/Course");
const Category = require("../models/Category");
const dbConnect = require("../config/database");
const { recommendCoursesForSkill } = require("../services/courseRecommendationService");

async function debug() {
  dbConnect();
  
  await new Promise((resolve) => mongoose.connection.once("open", resolve));

  const testCategory = await Category.create({
    name: "Web Development",
    description: "Web tech courses",
  });

  const dummyInstructor = new mongoose.Types.ObjectId();

  const mockCoursesData = [
    {
      courseName: "React Complete Bootcamp",
      courseDescription: "Learn React from basic components to state management.",
      instructor: dummyInstructor,
      whatYouWillLearn: "React, state, hooks, lifecycle",
      price: 1000,
      tag: ["React", "Frontend", "JS"],
      category: testCategory._id,
      status: "Published",
    },
    {
      courseName: "Redux Toolkit Masterclass",
      courseDescription: "Modern state management library for React apps.",
      instructor: dummyInstructor,
      whatYouWillLearn: "Redux, state management, React",
      price: 1500,
      tag: ["Redux", "React", "State"],
      category: testCategory._id,
      status: "Published",
    },
  ];

  const created = await Course.insertMany(mockCoursesData);
  console.log("Mock courses created!");

  try {
    const allCourses = await Course.find({ status: "Published" })
      .populate("category")
      .populate("instructor", "firstName lastName image");

    console.log("Loaded all courses count:", allCourses.length);

    allCourses.forEach(course => {
      // Let's print out what is passed to calculateRelevance and what it computes
      const courseName = (course.courseName || "").toLowerCase();
      const tags = (course.tag || []).map((t) => t.toLowerCase());
      console.log(`Course: ${course.courseName}`);
      console.log(`- name: ${courseName}`);
      console.log(`- category name: ${course.category?.name}`);
      console.log(`- tags: ${JSON.stringify(tags)}`);
    });

    const recommendations = await recommendCoursesForSkill("React JS");
    console.log("Recommendations found:", recommendations.map(c => ({ name: c.courseName, score: c.relevanceScore })));

  } finally {
    await Course.deleteMany({ _id: { $in: created.map(c => c._id) } });
    await Category.deleteOne({ _id: testCategory._id });
    await mongoose.connection.close();
  }
}

debug();
