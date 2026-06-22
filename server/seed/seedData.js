/**
 * ============================================================
 * StudyNotion - Production-Ready MongoDB Seed Data Generator
 * ============================================================
 * Collections: Profiles, Users, Categories, Courses, Sections,
 *              SubSections, RatingAndReviews, CourseProgress
 *
 * Aligned with existing Mongoose schemas:
 *   - Profile   (gender, dateOfBirth, about, contactNumber)
 *   - User      (firstName, lastName, email, password, accountType,
 *                additionalDetails->Profile, courses, image,
 *                courseProgress, createdAt)
 *   - Category  (name, description, courses[])
 *   - Course    (courseName, courseDescription, instructor, whatYouWillLearn,
 *                courseContent[], ratingAndReviews[], price, thumbnail,
 *                tag[], category, studentsEnrolled[], instructions[], status)
 *   - Section   (sectionName, subSection[])
 *   - SubSection(title, timeDuration, description, videoUrl)
 *   - RatingAndReview (user, rating, review, course)
 *   - CourseProgress  (courseID, userId, completedVideos[])
 *
 * Usage:
 *   cd server
 *   node seed/seedData.js
 *
 * NOTE: This will WIPE the above collections then re-seed them.
 * ============================================================
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// ─── Model Imports ───────────────────────────────────────────
const Profile       = require("../models/Profile");
const User          = require("../models/User");
const Category      = require("../models/Category");
const Course        = require("../models/Course");
const Section       = require("../models/Section");
const SubSection    = require("../models/SubSection");
const RatingAndReview = require("../models/RatingAndReviews");
const CourseProgress  = require("../models/CourseProgess");

// ─── Helpers ─────────────────────────────────────────────────
const pick  = (arr) => arr[Math.floor(Math.random() * arr.length)];
const range = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max, decimals = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const slug = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ─── Avatar & Thumbnail Helpers (Picsum / UI-Avatars) ────────
const avatar = (seed) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&background=random&color=fff&size=256`;

const thumbnail = (keyword, id) =>
  `https://picsum.photos/seed/${slug(keyword)}-${id}/800/450`;

// ============================================================
// RAW DATA POOLS
// ============================================================

// ─── Instructor Pool (20) ────────────────────────────────────
const instructorPool = [
  { firstName: "Aarav",   lastName: "Sharma",     email: "aarav.sharma@studynotion.com", password: "Password@1234", bio: "Full-Stack Engineer with 10 years at top tech firms. Passionate about teaching scalable systems.",            skills: ["Node.js","React","MongoDB","System Design"] },
  { firstName: "Priya",   lastName: "Nair",       email: "priya.nair@studynotion.com", password: "Password@1234", bio: "Data Scientist & ML Engineer. Previously at Google Brain. Loves making complex algorithms simple.",           skills: ["Python","TensorFlow","Scikit-learn","Data Viz"] },
  { firstName: "Rohan",   lastName: "Mehta",      email: "rohan.mehta@studynotion.com", password: "Password@1234", bio: "DevOps & Cloud Architect certified on AWS & GCP. Building cloud-native applications since 2013.",             skills: ["AWS","Docker","Kubernetes","Terraform"] },
  { firstName: "Sneha",   lastName: "Kapoor",     email: "sneha.kapoor@studynotion.com", password: "Password@1234", bio: "UI/UX Designer turned frontend developer. 8 years designing world-class digital products.",                  skills: ["Figma","React","CSS","Design Systems"] },
  { firstName: "Vikram",  lastName: "Patel",      email: "vikram.patel@studynotion.com", password: "Password@1234", bio: "Cybersecurity expert and ethical hacker. CEH & OSCP certified. 12 years in enterprise security.",            skills: ["Penetration Testing","OWASP","Kali Linux","Cryptography"] },
  { firstName: "Ananya",  lastName: "Reddy",      email: "ananya.reddy@studynotion.com", password: "Password@1234", bio: "Blockchain developer and DeFi enthusiast. Built multiple production smart-contract systems.",                 skills: ["Solidity","Ethereum","Web3.js","Hardhat"] },
  { firstName: "Karan",   lastName: "Singh",      email: "karan.singh@studynotion.com", password: "Password@1234", bio: "Mobile app developer specializing in React Native and Flutter. 200k+ app downloads.",                       skills: ["React Native","Flutter","Firebase","App Store"] },
  { firstName: "Meera",   lastName: "Joshi",      email: "meera.joshi@studynotion.com", password: "Password@1234", bio: "Digital Marketing strategist with Fortune 500 experience. SEO, PPC & content marketing expert.",            skills: ["SEO","Google Ads","Analytics","Content Strategy"] },
  { firstName: "Arjun",   lastName: "Kumar",      email: "arjun.kumar@studynotion.com", password: "Password@1234", bio: "Python developer and automation engineer. Creator of several popular open-source libraries.",                 skills: ["Python","Django","FastAPI","Automation"] },
  { firstName: "Neha",    lastName: "Gupta",      email: "neha.gupta@studynotion.com", password: "Password@1234", bio: "AI researcher with PhD in Computer Vision. Published papers in top IEEE conferences.",                      skills: ["Deep Learning","OpenCV","PyTorch","Computer Vision"] },
  { firstName: "Siddharth",lastName: "Rao",       email: "siddharth.rao@studynotion.com", password: "Password@1234", bio: "SQL & NoSQL database architect. 15 years optimizing databases for high-traffic platforms.",                  skills: ["PostgreSQL","MongoDB","Redis","Database Design"] },
  { firstName: "Kavita",  lastName: "Bose",       email: "kavita.bose@studynotion.com", password: "Password@1234", bio: "Game developer and Unity expert. Shipped 3 titles on Steam with combined 500k+ wishlists.",                 skills: ["Unity","C#","Game Design","3D Modeling"] },
  { firstName: "Rahul",   lastName: "Verma",      email: "rahul.verma@studynotion.com", password: "Password@1234", bio: "Embedded systems and IoT engineer. Built industrial IoT solutions deployed in 15 countries.",                skills: ["Arduino","Raspberry Pi","C++","MQTT"] },
  { firstName: "Divya",   lastName: "Iyer",       email: "divya.iyer@studynotion.com", password: "Password@1234", bio: "Product Manager turned Agile coach. Helped 50+ teams transition to lean product development.",              skills: ["Scrum","Jira","Product Strategy","OKRs"] },
  { firstName: "Manish",  lastName: "Agarwal",    email: "manish.agarwal@studynotion.com", password: "Password@1234", bio: "Java enterprise architect. Spring Boot & microservices consultant for banking and fintech.",                  skills: ["Java","Spring Boot","Microservices","Kafka"] },
  { firstName: "Pooja",   lastName: "Desai",      email: "pooja.desai@studynotion.com", password: "Password@1234", bio: "Data Engineering expert. Built petabyte-scale pipelines at a major e-commerce company.",                    skills: ["Apache Spark","Kafka","Airflow","BigQuery"] },
  { firstName: "Amit",    lastName: "Tiwari",     email: "amit.tiwari@studynotion.com", password: "Password@1234", bio: "Frontend performance engineer. Obsessed with Core Web Vitals and 60fps animations.",                        skills: ["JavaScript","WebGL","Performance","Three.js"] },
  { firstName: "Shweta",  lastName: "Pandey",     email: "shweta.pandey@studynotion.com", password: "Password@1234", bio: "NLP and Generative AI specialist. Fine-tuned LLMs for production use at a Series-B startup.",               skills: ["LLMs","LangChain","HuggingFace","RAG"] },
  { firstName: "Gaurav",  lastName: "Mishra",     email: "gaurav.mishra@studynotion.com", password: "Password@1234", bio: "Linux kernel contributor and open-source advocate. Speaks at major developer conferences globally.",         skills: ["Linux","Bash","C","Open Source"] },
  { firstName: "Ritu",    lastName: "Saxena",     email: "ritu.saxena@studynotion.com", password: "Password@1234", bio: "Cloud-native architect specializing in serverless and event-driven architectures on Azure.",                 skills: ["Azure","Serverless","Event-Driven","CI/CD"] },
];

// ─── Student Pool (50) ───────────────────────────────────────
const studentPool = [
  { firstName: "Aditya",   lastName: "Shah",        gender: "Male",   dob: "2001-05-14", email: "aditya.shah12@gmail.com", password: "Password@1234" },
  { firstName: "Bhavna",   lastName: "Chaudhary",   gender: "Female", dob: "2000-09-22", email: "bhavna.chaudhary@gmail.com", password: "Password@1234" },
  { firstName: "Chirag",   lastName: "Malhotra",    gender: "Male",   dob: "2002-03-11", email: "chirag.malhotra@gmail.com", password: "Password@1234" },
  { firstName: "Deepika",  lastName: "Srivastava",  gender: "Female", dob: "1999-07-30", email: "deepika.srivastava@gmail.com", password: "Password@1234" },
  { firstName: "Eshan",    lastName: "Trivedi",     gender: "Male",   dob: "2001-12-01", email: "eshan.trivedi@gmail.com", password: "Password@1234" },
  { firstName: "Falguni",  lastName: "Rawal",       gender: "Female", dob: "2003-02-19", email: "falguni.rawal@gmail.com", password: "Password@1234" },
  { firstName: "Gaurav",   lastName: "Bhatt",       gender: "Male",   dob: "2000-06-08", email: "gaurav.bhatt@gmail.com", password: "Password@1234" },
  { firstName: "Hema",     lastName: "Krishnan",    gender: "Female", dob: "2002-11-25", email: "hema.krishnan@gmail.com", password: "Password@1234" },
  { firstName: "Ishaan",   lastName: "Dutta",       gender: "Male",   dob: "2001-04-17", email: "ishaan.dutta@gmail.com", password: "Password@1234" },
  { firstName: "Jaya",     lastName: "Pillai",      gender: "Female", dob: "1998-08-03", email: "jaya.pillai@gmail.com", password: "Password@1234" },
  { firstName: "Kabir",    lastName: "Bajaj",       gender: "Male",   dob: "2000-01-21", email: "kabir.bajaj@gmail.com", password: "Password@1234" },
  { firstName: "Lalita",   lastName: "Menon",       gender: "Female", dob: "2003-10-09", email: "lalita.menon@gmail.com", password: "Password@1234" },
  { firstName: "Manas",    lastName: "Choudhury",   gender: "Male",   dob: "1999-03-15", email: "manas.choudhury@gmail.com", password: "Password@1234" },
  { firstName: "Nandita",  lastName: "Roy",         gender: "Female", dob: "2001-07-27", email: "nandita.roy@gmail.com", password: "Password@1234" },
  { firstName: "Om",       lastName: "Prakash",     gender: "Male",   dob: "2002-05-06", email: "om.prakash@gmail.com", password: "Password@1234" },
  { firstName: "Pallavi",  lastName: "Thakur",      gender: "Female", dob: "2000-12-18", email: "pallavi.thakur@gmail.com", password: "Password@1234" },
  { firstName: "Qasim",    lastName: "Siddiqui",    gender: "Male",   dob: "2001-09-04", email: "qasim.siddiqui@gmail.com", password: "Password@1234" },
  { firstName: "Ritika",   lastName: "Arora",       gender: "Female", dob: "2002-02-14", email: "ritika.arora@gmail.com", password: "Password@1234" },
  { firstName: "Saurabh",  lastName: "Yadav",       gender: "Male",   dob: "1998-06-23", email: "saurabh.yadav@gmail.com", password: "Password@1234" },
  { firstName: "Tanya",    lastName: "Khanna",      gender: "Female", dob: "2003-01-11", email: "tanya.khanna@gmail.com", password: "Password@1234" },
  { firstName: "Ujjwal",   lastName: "Rawat",       gender: "Male",   dob: "2000-04-29", email: "ujjwal.rawat@gmail.com", password: "Password@1234" },
  { firstName: "Vanshika", lastName: "Aggarwal",    gender: "Female", dob: "2001-08-16", email: "vanshika.aggarwal@gmail.com", password: "Password@1234" },
  { firstName: "Waqar",    lastName: "Ahmed",       gender: "Male",   dob: "2002-07-07", email: "waqar.ahmed@gmail.com", password: "Password@1234" },
  { firstName: "Xena",     lastName: "D'Souza",     gender: "Female", dob: "1999-11-20", email: "xena.dsouza@gmail.com", password: "Password@1234" },
  { firstName: "Yash",     lastName: "Chauhan",     gender: "Male",   dob: "2001-03-03", email: "yash.chauhan@gmail.com", password: "Password@1234" },
  { firstName: "Zara",     lastName: "Khan",        gender: "Female", dob: "2002-09-28", email: "zara.khan@gmail.com", password: "Password@1234" },
  { firstName: "Akash",    lastName: "Pandya",      gender: "Male",   dob: "2000-02-10", email: "akash.pandya@gmail.com", password: "Password@1234" },
  { firstName: "Bindu",    lastName: "Narayanan",   gender: "Female", dob: "2003-06-04", email: "bindu.narayanan@gmail.com", password: "Password@1234" },
  { firstName: "Chetan",   lastName: "Goswami",     gender: "Male",   dob: "1999-10-13", email: "chetan.goswami@gmail.com", password: "Password@1234" },
  { firstName: "Diksha",   lastName: "Parikh",      gender: "Female", dob: "2001-01-07", email: "diksha.parikh@gmail.com", password: "Password@1234" },
  { firstName: "Eklavya",  lastName: "Bisht",       gender: "Male",   dob: "2002-04-22", email: "eklavya.bisht@gmail.com", password: "Password@1234" },
  { firstName: "Farida",   lastName: "Qureshi",     gender: "Female", dob: "2000-08-31", email: "farida.qureshi@gmail.com", password: "Password@1234" },
  { firstName: "Ganesh",   lastName: "Patil",       gender: "Male",   dob: "2001-11-15", email: "ganesh.patil@gmail.com", password: "Password@1234" },
  { firstName: "Harshita", lastName: "Lal",         gender: "Female", dob: "2003-03-25", email: "harshita.lal@gmail.com", password: "Password@1234" },
  { firstName: "Indra",    lastName: "Bali",        gender: "Male",   dob: "1998-07-09", email: "indra.bali@gmail.com", password: "Password@1234" },
  { firstName: "Jasmine",  lastName: "Oberoi",      gender: "Female", dob: "2002-12-02", email: "jasmine.oberoi@gmail.com", password: "Password@1234" },
  { firstName: "Kush",     lastName: "Taneja",      gender: "Male",   dob: "2001-05-20", email: "kush.taneja@gmail.com", password: "Password@1234" },
  { firstName: "Lavanya",  lastName: "Subramanian", gender: "Female", dob: "2000-09-08", email: "lavanya.subramanian@gmail.com", password: "Password@1234" },
  { firstName: "Mohit",    lastName: "Soni",        gender: "Male",   dob: "2002-01-26", email: "mohit.soni@gmail.com", password: "Password@1234" },
  { firstName: "Nisha",    lastName: "Rajput",      gender: "Female", dob: "1999-04-12", email: "nisha.rajput@gmail.com", password: "Password@1234" },
  { firstName: "Omkar",    lastName: "Wagh",        gender: "Male",   dob: "2001-06-18", email: "omkar.wagh@gmail.com", password: "Password@1234" },
  { firstName: "Priyanka", lastName: "Mukherjee",   gender: "Female", dob: "2003-02-07", email: "priyanka.mukherjee@gmail.com", password: "Password@1234" },
  { firstName: "Rajat",    lastName: "Dubey",       gender: "Male",   dob: "2000-10-24", email: "rajat.dubey@gmail.com", password: "Password@1234" },
  { firstName: "Simran",   lastName: "Sethi",       gender: "Female", dob: "2001-03-30", email: "simran.sethi@gmail.com", password: "Password@1234" },
  { firstName: "Tarun",    lastName: "Sharma",      gender: "Male",   dob: "2002-08-13", email: "tarun.sharma@gmail.com", password: "Password@1234" },
  { firstName: "Uma",      lastName: "Patel",       gender: "Female", dob: "2000-11-06", email: "uma.patel@gmail.com", password: "Password@1234" },
  { firstName: "Varun",    lastName: "Misra",       gender: "Male",   dob: "1998-05-17", email: "varun.misra@gmail.com", password: "Password@1234" },
  { firstName: "Wahida",   lastName: "Banu",        gender: "Female", dob: "2002-07-22", email: "wahida.banu@gmail.com", password: "Password@1234" },
  { firstName: "Xerxes",   lastName: "Contractor",  gender: "Male",   dob: "2001-09-11", email: "xerxes.contractor@gmail.com", password: "Password@1234" },
  { firstName: "Yamini",   lastName: "Nanda",       gender: "Female", dob: "2003-04-05", email: "yamini.nanda@gmail.com", password: "Password@1234" },
];

// ─── Admin Pool (3) ──────────────────────────────────────────
const adminPool = [
  { firstName: "Rajesh", lastName: "Yadav",      email: "rajesh.yadav@studynotion.com", password: "Password@1234", bio: "Platform Administrator & Co-Founder of StudyNotion." },
  { firstName: "Sunita", lastName: "Chatterjee", email: "sunita.chatterjee@studynotion.com", password: "Password@1234", bio: "Head of Content Quality at StudyNotion." },
  { firstName: "Alok",   lastName: "Srivastava", email: "alok.srivastava@studynotion.com", password: "Password@1234", bio: "CTO & Technical Administrator of StudyNotion." },
];

// ─── Categories ──────────────────────────────────────────────
const categoryDefs = [
  { name: "Web Development",        description: "Master modern web technologies including HTML, CSS, JavaScript, React, Node.js and full-stack frameworks to build production-ready applications." },
  { name: "Mobile Development",     description: "Build cross-platform and native mobile applications for iOS and Android using React Native, Flutter, Swift, and Kotlin." },
  { name: "AI & Machine Learning",  description: "Dive into artificial intelligence, neural networks, deep learning, and build intelligent systems using Python, TensorFlow, and PyTorch." },
  { name: "Data Science",           description: "Learn data analysis, visualization, statistical modeling, and build data-driven insights using Python, R, and modern BI tools." },
  { name: "Cyber Security",         description: "Protect systems and networks with ethical hacking, penetration testing, OWASP practices, and security engineering." },
  { name: "DevOps & SRE",           description: "Master CI/CD pipelines, Docker, Kubernetes, cloud infrastructure, and site reliability engineering practices." },
  { name: "Cloud Computing",        description: "Build and architect scalable cloud solutions on AWS, GCP, and Azure. Prepare for top cloud certifications." },
  { name: "UI/UX Design",           description: "Design beautiful, user-centered digital products using Figma, Adobe XD, and proven design thinking methodologies." },
  { name: "Blockchain & Web3",      description: "Build decentralized applications, smart contracts, and DeFi protocols on Ethereum, Solana, and Polygon." },
  { name: "Digital Marketing",      description: "Drive growth with SEO, SEM, social media marketing, email campaigns, and data-driven marketing analytics." },
  { name: "Database Engineering",   description: "Design and optimize SQL and NoSQL databases, master query performance, replication, and distributed storage systems." },
  { name: "Game Development",       description: "Create 2D and 3D games using Unity, Unreal Engine, and Godot. Learn game physics, AI, and monetization strategies." },
  { name: "Programming Languages",  description: "Deep-dive into Python, Java, Go, Rust, C++, and more with production-level projects and best practices." },
];

// ─── Course Definitions ──────────────────────────────────────
// Each entry: { title, catIndex, instructorIndex, price, level, lang, tags, short, full, outcomes, instructions, sections[] }
const courseDefs = [
  // ── WEB DEVELOPMENT (cat 0) ─────────────────────────────
  {
    title: "The Complete React Developer Bootcamp",
    catIndex: 0, instructorIndex: 0, price: 2999, level: "Intermediate", lang: "English",
    tags: ["React","JavaScript","Frontend","Hooks","Redux"],
    short: "Build production-grade React applications with Hooks, Context, Redux Toolkit, and React Query.",
    full: "This comprehensive course takes you from React fundamentals to advanced patterns used in real-world enterprise applications. You will master function components, custom hooks, performance optimization with useMemo and useCallback, global state management with Redux Toolkit, server-state with React Query, and testing with React Testing Library. By the end, you will have built three production-ready projects including a Trello-style kanban board and a real-time chat app.",
    outcomes: "Build scalable React apps|Master Hooks & Context API|Implement Redux Toolkit state management|Write unit and integration tests|Deploy React apps to Vercel & Netlify",
    instructions: "Basic HTML & CSS knowledge required|Familiarity with JavaScript ES6+|Node.js installed on your machine",
    sections: [
      { name: "React Foundations", lectures: [
        { title: "Course Overview & Setup", dur: "08:20", preview: true },
        { title: "JSX Deep Dive & Virtual DOM", dur: "14:35", preview: true },
        { title: "Function Components & Props", dur: "18:10", preview: false },
        { title: "State with useState Hook", dur: "21:45", preview: false },
      ]},
      { name: "Core React Patterns", lectures: [
        { title: "useEffect & Side Effects", dur: "19:30", preview: false },
        { title: "Custom Hooks - Build Your Own", dur: "24:15", preview: false },
        { title: "Context API & useContext", dur: "17:50", preview: false },
        { title: "useReducer for Complex State", dur: "22:00", preview: false },
      ]},
      { name: "Advanced State Management", lectures: [
        { title: "Introduction to Redux Toolkit", dur: "15:40", preview: true },
        { title: "Slices, Actions & Reducers", dur: "28:10", preview: false },
        { title: "Async Thunks & API Integration", dur: "26:55", preview: false },
        { title: "RTK Query for Server State", dur: "31:20", preview: false },
      ]},
      { name: "Performance Optimization", lectures: [
        { title: "React.memo & Preventing Re-renders", dur: "16:45", preview: false },
        { title: "useMemo & useCallback", dur: "19:00", preview: false },
        { title: "Code Splitting & Lazy Loading", dur: "21:30", preview: false },
      ]},
      { name: "Testing React Applications", lectures: [
        { title: "Setup Jest & React Testing Library", dur: "12:15", preview: false },
        { title: "Unit Testing Components", dur: "24:40", preview: false },
        { title: "Integration Tests with MSW", dur: "28:00", preview: false },
      ]},
      { name: "Capstone Projects", lectures: [
        { title: "Project 1: Task Manager App", dur: "45:20", preview: false },
        { title: "Project 2: Real-time Chat App", dur: "52:10", preview: false },
        { title: "Deployment & CI/CD Pipeline", dur: "18:35", preview: false },
      ]},
    ],
  },
  {
    title: "Node.js & Express API Masterclass",
    catIndex: 0, instructorIndex: 0, price: 2499, level: "Intermediate", lang: "English",
    tags: ["Node.js","Express","REST API","JWT","MongoDB"],
    short: "Design and build scalable RESTful APIs with Node.js, Express, MongoDB, and JWT authentication.",
    full: "This course teaches you to build production-quality backend APIs from the ground up. You will learn the Node.js event loop, module system, Express routing and middleware architecture, database design with Mongoose, authentication & authorization with JWT and bcrypt, file uploads with Multer/Cloudinary, real-time features with Socket.io, API testing with Jest and Supertest, and production deployment on Railway and Render.",
    outcomes: "Design RESTful API architecture|Implement JWT auth & RBAC|Integrate MongoDB with Mongoose|Handle file uploads to cloud storage|Write API tests with Jest & Supertest",
    instructions: "JavaScript fundamentals required|Understanding of HTTP concepts|MongoDB Atlas free tier account",
    sections: [
      { name: "Node.js Internals", lectures: [
        { title: "Event Loop & Non-blocking I/O", dur: "22:10", preview: true },
        { title: "Module System & npm", dur: "15:30", preview: false },
        { title: "File System & Streams", dur: "19:45", preview: false },
      ]},
      { name: "Express.js Framework", lectures: [
        { title: "Routing & Middleware Chain", dur: "20:00", preview: true },
        { title: "Error Handling Middleware", dur: "16:20", preview: false },
        { title: "Request Validation with Joi", dur: "18:10", preview: false },
        { title: "CORS & Security Headers", dur: "14:55", preview: false },
      ]},
      { name: "Database Integration", lectures: [
        { title: "Mongoose Schemas & Models", dur: "23:15", preview: false },
        { title: "Advanced Queries & Aggregation", dur: "29:40", preview: false },
        { title: "Indexing & Query Optimization", dur: "21:00", preview: false },
      ]},
      { name: "Authentication & Security", lectures: [
        { title: "Password Hashing with bcrypt", dur: "13:25", preview: false },
        { title: "JWT Access & Refresh Tokens", dur: "26:30", preview: false },
        { title: "Role-Based Access Control", dur: "20:45", preview: false },
        { title: "Rate Limiting & API Security", dur: "17:00", preview: false },
      ]},
      { name: "Real-time & File Handling", lectures: [
        { title: "Socket.io for Real-time Features", dur: "32:10", preview: false },
        { title: "File Uploads with Multer", dur: "18:50", preview: false },
        { title: "Cloudinary Image Processing", dur: "16:30", preview: false },
      ]},
    ],
  },
  {
    title: "Full-Stack MERN Development",
    catIndex: 0, instructorIndex: 0, price: 3999, level: "Advanced", lang: "English",
    tags: ["MERN","React","Node.js","MongoDB","Full Stack"],
    short: "Build 3 complete full-stack applications using MongoDB, Express, React, and Node.js.",
    full: "The definitive MERN stack course for developers who want to go from zero to full-stack employment. This course covers every layer of the stack with real-world patterns: React with TypeScript on the frontend, Express REST APIs with JWT auth on the backend, MongoDB with Mongoose for data persistence, and deployment on VPS using Nginx and PM2. You will build an e-commerce platform, a social media app, and a project management tool.",
    outcomes: "Architect full MERN applications|Implement end-to-end authentication|Deploy to production VPS|Build real-time features with Socket.io|Master TypeScript in React",
    instructions: "JavaScript ES6+ knowledge|Basic React experience|Command line basics",
    sections: [
      { name: "Architecture & Project Setup", lectures: [
        { title: "MERN Architecture Deep Dive", dur: "18:00", preview: true },
        { title: "Monorepo Setup with Turborepo", dur: "14:30", preview: false },
        { title: "Environment & Configuration Management", dur: "12:15", preview: false },
      ]},
      { name: "Backend API Development", lectures: [
        { title: "Express App Factory Pattern", dur: "20:45", preview: false },
        { title: "Mongoose Data Modeling", dur: "25:20", preview: false },
        { title: "Auth System with Refresh Tokens", dur: "30:10", preview: false },
        { title: "Payment Integration with Razorpay", dur: "24:00", preview: false },
      ]},
      { name: "React Frontend (TypeScript)", lectures: [
        { title: "React + TypeScript Setup", dur: "16:40", preview: true },
        { title: "TanStack Router Integration", dur: "22:30", preview: false },
        { title: "Zustand State Management", dur: "19:50", preview: false },
        { title: "Form Handling with React Hook Form", dur: "21:15", preview: false },
      ]},
      { name: "Project 1: E-commerce Store", lectures: [
        { title: "Product Catalog & Search", dur: "35:20", preview: false },
        { title: "Cart & Checkout Flow", dur: "40:15", preview: false },
        { title: "Order Management System", dur: "28:00", preview: false },
      ]},
      { name: "Project 2: Social Media Platform", lectures: [
        { title: "News Feed & Infinite Scroll", dur: "38:45", preview: false },
        { title: "Real-time Notifications", dur: "32:10", preview: false },
        { title: "Media Upload & Processing", dur: "26:30", preview: false },
      ]},
      { name: "Production Deployment", lectures: [
        { title: "VPS Setup with Ubuntu & Nginx", dur: "24:20", preview: false },
        { title: "PM2 Process Manager & SSL", dur: "18:40", preview: false },
        { title: "CI/CD with GitHub Actions", dur: "22:10", preview: false },
      ]},
    ],
  },
  {
    title: "Next.js 14 — App Router Mastery",
    catIndex: 0, instructorIndex: 3, price: 2799, level: "Intermediate", lang: "English",
    tags: ["Next.js","React","SSR","App Router","TypeScript"],
    short: "Master Next.js 14 App Router, Server Components, Server Actions, and full-stack capabilities.",
    full: "Next.js 14 introduced a revolutionary App Router paradigm that changes how we build React applications. This course covers Server Components, Client Components, Server Actions, streaming, parallel routes, intercepting routes, and the new data-fetching model. You will also learn Prisma ORM, NextAuth.js v5, Vercel deployment, and Edge Runtime. Build a production-grade SaaS starter kit by the end of this course.",
    outcomes: "Master React Server Components|Build full-stack Next.js apps|Implement NextAuth.js authentication|Optimize performance with streaming|Deploy on Vercel Edge Network",
    instructions: "Solid React knowledge required|TypeScript basics helpful|Git version control",
    sections: [
      { name: "App Router Fundamentals", lectures: [
        { title: "Pages Router vs App Router", dur: "16:20", preview: true },
        { title: "Server Components vs Client Components", dur: "22:45", preview: false },
        { title: "Layouts, Templates & Loading States", dur: "18:30", preview: false },
        { title: "Error Boundaries & Not Found Pages", dur: "14:00", preview: false },
      ]},
      { name: "Data Fetching & Caching", lectures: [
        { title: "fetch API & Next.js Caching", dur: "20:10", preview: true },
        { title: "Server Actions for Mutations", dur: "26:30", preview: false },
        { title: "Optimistic Updates Pattern", dur: "21:50", preview: false },
        { title: "React Query with App Router", dur: "24:15", preview: false },
      ]},
      { name: "Authentication with NextAuth.js v5", lectures: [
        { title: "OAuth Providers Setup", dur: "19:40", preview: false },
        { title: "Database Sessions with Prisma", dur: "23:00", preview: false },
        { title: "Middleware & Protected Routes", dur: "17:30", preview: false },
      ]},
      { name: "Advanced Routing Patterns", lectures: [
        { title: "Parallel & Intercepting Routes", dur: "28:20", preview: false },
        { title: "Modal & Drawer Patterns", dur: "16:45", preview: false },
        { title: "Internationalization (i18n)", dur: "20:00", preview: false },
      ]},
    ],
  },
  {
    title: "TypeScript for Modern JavaScript Developers",
    catIndex: 0, instructorIndex: 16, price: 1999, level: "Beginner", lang: "English",
    tags: ["TypeScript","JavaScript","Types","Generics","OOP"],
    short: "Master TypeScript from beginner to advanced: types, generics, decorators, and real-world projects.",
    full: "TypeScript is no longer optional for professional JavaScript developers. This course covers the complete TypeScript type system: primitives, unions, intersections, generics, conditional types, mapped types, template literal types, and utility types. You will also learn how to migrate JavaScript codebases to TypeScript, work with popular frameworks in TypeScript, and use advanced patterns like discriminated unions and type guards.",
    outcomes: "Write fully typed TypeScript|Use advanced generic patterns|Migrate JS projects to TS|Integrate TS with React & Node|Use decorators & metadata",
    instructions: "Solid JavaScript knowledge|Familiarity with ES6+ syntax",
    sections: [
      { name: "TypeScript Basics", lectures: [
        { title: "Why TypeScript? Setup & Config", dur: "12:30", preview: true },
        { title: "Primitive Types & Type Inference", dur: "16:20", preview: false },
        { title: "Arrays, Tuples & Enums", dur: "18:45", preview: false },
        { title: "Functions & Return Types", dur: "14:10", preview: false },
      ]},
      { name: "Object Types & OOP", lectures: [
        { title: "Interfaces vs Type Aliases", dur: "19:30", preview: true },
        { title: "Classes & Access Modifiers", dur: "22:00", preview: false },
        { title: "Inheritance & Abstract Classes", dur: "20:15", preview: false },
      ]},
      { name: "Advanced Types", lectures: [
        { title: "Generics Deep Dive", dur: "28:40", preview: false },
        { title: "Conditional & Mapped Types", dur: "24:50", preview: false },
        { title: "Utility Types: Partial, Pick, Omit", dur: "19:20", preview: false },
        { title: "Template Literal Types", dur: "16:00", preview: false },
      ]},
      { name: "TypeScript in Practice", lectures: [
        { title: "TypeScript with React", dur: "25:30", preview: false },
        { title: "TypeScript with Express", dur: "22:10", preview: false },
        { title: "Migrating JS Codebase to TS", dur: "30:00", preview: false },
      ]},
    ],
  },

  // ── MOBILE DEVELOPMENT (cat 1) ──────────────────────────
  {
    title: "React Native: Build iOS & Android Apps",
    catIndex: 1, instructorIndex: 6, price: 2799, level: "Intermediate", lang: "English",
    tags: ["React Native","Mobile","iOS","Android","Expo"],
    short: "Build cross-platform mobile apps for iOS and Android using React Native and Expo.",
    full: "This course takes you from React Native zero to hero. You will learn Expo and bare workflow, navigation with React Navigation, state management with Zustand, data fetching with React Query, styling with NativeWind, camera & media access, push notifications with Expo Notifications, maps with React Native Maps, and publishing to the App Store and Google Play. Build a ride-sharing app UI and a full social media mobile app.",
    outcomes: "Build iOS & Android apps with one codebase|Master navigation patterns|Integrate device APIs|Push notifications|Publish to app stores",
    instructions: "React.js knowledge required|JavaScript ES6+|Mac for iOS simulator (optional)",
    sections: [
      { name: "React Native Foundations", lectures: [
        { title: "Expo Setup & First App", dur: "14:20", preview: true },
        { title: "Core Components & StyleSheet", dur: "20:30", preview: false },
        { title: "Flexbox Layout System", dur: "18:15", preview: false },
        { title: "FlatList & SectionList", dur: "16:40", preview: false },
      ]},
      { name: "Navigation with React Navigation", lectures: [
        { title: "Stack Navigator", dur: "17:50", preview: true },
        { title: "Tab & Drawer Navigator", dur: "19:20", preview: false },
        { title: "Deep Linking & URL Schemes", dur: "22:00", preview: false },
        { title: "Auth Flow & Protected Screens", dur: "24:30", preview: false },
      ]},
      { name: "Device Features", lectures: [
        { title: "Camera & Image Picker", dur: "21:10", preview: false },
        { title: "Location & Maps Integration", dur: "25:40", preview: false },
        { title: "Push Notifications", dur: "23:00", preview: false },
        { title: "Async Storage & SecureStore", dur: "15:30", preview: false },
      ]},
      { name: "App Store Deployment", lectures: [
        { title: "EAS Build & Submit", dur: "20:00", preview: false },
        { title: "App Store & Play Store Guidelines", dur: "18:20", preview: false },
        { title: "OTA Updates with Expo", dur: "12:45", preview: false },
      ]},
    ],
  },
  {
    title: "Flutter & Dart: Complete Mobile Development",
    catIndex: 1, instructorIndex: 6, price: 2599, level: "Beginner", lang: "English",
    tags: ["Flutter","Dart","Mobile","Firebase","BLoC"],
    short: "Build beautiful cross-platform apps with Flutter and Dart from scratch to production.",
    full: "Flutter enables you to build natively compiled applications for mobile, web, and desktop from a single codebase using the Dart programming language. This comprehensive course covers Dart fundamentals, Flutter widgets, custom animations, state management with BLoC and Riverpod, Firebase integration (Auth, Firestore, Storage, FCM), REST API integration, and deployment. You will build a full e-commerce app and a fitness tracker.",
    outcomes: "Master Dart & Flutter widget tree|Implement BLoC state management|Integrate Firebase services|Create custom animations|Publish to app stores",
    instructions: "No prior mobile experience needed|Basic programming knowledge|Flutter SDK installed",
    sections: [
      { name: "Dart Language Essentials", lectures: [
        { title: "Variables, Types & Functions", dur: "16:00", preview: true },
        { title: "OOP in Dart", dur: "20:30", preview: false },
        { title: "Futures & async/await", dur: "18:10", preview: false },
        { title: "Streams & Reactive Programming", dur: "22:40", preview: false },
      ]},
      { name: "Flutter Widgets & Layouts", lectures: [
        { title: "StatelessWidget vs StatefulWidget", dur: "15:20", preview: true },
        { title: "Material Design Components", dur: "24:00", preview: false },
        { title: "Custom Widgets & Composition", dur: "21:30", preview: false },
        { title: "Responsive Layouts", dur: "19:50", preview: false },
      ]},
      { name: "State Management with BLoC", lectures: [
        { title: "BLoC Pattern Explained", dur: "18:45", preview: false },
        { title: "Cubits & BLoC Events", dur: "25:20", preview: false },
        { title: "BLoC Testing", dur: "20:00", preview: false },
      ]},
      { name: "Firebase Integration", lectures: [
        { title: "Firebase Auth - Email & Google", dur: "22:15", preview: false },
        { title: "Cloud Firestore CRUD", dur: "28:40", preview: false },
        { title: "Firebase Storage for Media", dur: "19:30", preview: false },
        { title: "Push Notifications with FCM", dur: "21:00", preview: false },
      ]},
    ],
  },

  // ── AI & ML (cat 2) ─────────────────────────────────────
  {
    title: "Machine Learning with Python - Zero to Hero",
    catIndex: 2, instructorIndex: 1, price: 3499, level: "Intermediate", lang: "English",
    tags: ["Machine Learning","Python","Scikit-learn","Data Science","AI"],
    short: "Master machine learning algorithms, model training, evaluation, and deployment with Python.",
    full: "This is the definitive machine learning course for aspiring data scientists and ML engineers. You will learn supervised and unsupervised learning algorithms from scratch, implement them with NumPy, then use Scikit-learn for production models. Topics include linear regression, logistic regression, decision trees, random forests, gradient boosting, k-means clustering, PCA, SVMs, and neural network basics. Every algorithm is taught with mathematical intuition and practical code.",
    outcomes: "Implement ML algorithms from scratch|Master Scikit-learn pipeline|Perform feature engineering|Evaluate models with proper metrics|Deploy models with FastAPI",
    instructions: "Python programming required|Basic statistics knowledge|Calculus fundamentals helpful",
    sections: [
      { name: "ML Foundations", lectures: [
        { title: "What is Machine Learning?", dur: "15:00", preview: true },
        { title: "Python ML Stack Setup", dur: "10:30", preview: true },
        { title: "NumPy & Pandas Refresher", dur: "25:20", preview: false },
        { title: "Data Preprocessing Pipeline", dur: "22:10", preview: false },
      ]},
      { name: "Supervised Learning", lectures: [
        { title: "Linear Regression - Math & Code", dur: "30:15", preview: false },
        { title: "Logistic Regression & Classification", dur: "28:40", preview: false },
        { title: "Decision Trees & Random Forests", dur: "26:30", preview: false },
        { title: "Gradient Boosting & XGBoost", dur: "32:00", preview: false },
        { title: "Support Vector Machines", dur: "24:20", preview: false },
      ]},
      { name: "Unsupervised Learning", lectures: [
        { title: "K-Means Clustering", dur: "20:45", preview: false },
        { title: "DBSCAN & Hierarchical Clustering", dur: "18:30", preview: false },
        { title: "Principal Component Analysis", dur: "22:10", preview: false },
      ]},
      { name: "Model Evaluation & MLOps", lectures: [
        { title: "Cross-Validation & Hyperparameter Tuning", dur: "26:00", preview: false },
        { title: "MLflow for Experiment Tracking", dur: "20:30", preview: false },
        { title: "Deploying Models with FastAPI", dur: "24:15", preview: false },
      ]},
    ],
  },
  {
    title: "Deep Learning & Neural Networks with PyTorch",
    catIndex: 2, instructorIndex: 9, price: 3999, level: "Advanced", lang: "English",
    tags: ["Deep Learning","PyTorch","Neural Networks","CNN","Transformers"],
    short: "Build state-of-the-art deep learning models with PyTorch for vision, NLP, and generation tasks.",
    full: "This advanced course teaches modern deep learning with PyTorch. You will implement neural networks from scratch, master CNNs for image classification and object detection, build sequence models with RNNs and LSTMs, implement Transformer architecture from scratch, fine-tune BERT and GPT models, and explore generative models including VAEs and GANs. Each module includes paper implementations of landmark models like ResNet, YOLO, and Attention is All You Need.",
    outcomes: "Build neural networks from scratch|Master CNNs & vision models|Implement Transformer architecture|Fine-tune pre-trained models|Deploy DL models to production",
    instructions: "Python proficiency required|Calculus & linear algebra|Basic ML knowledge|GPU access recommended",
    sections: [
      { name: "PyTorch Fundamentals", lectures: [
        { title: "Tensors & Autograd", dur: "22:30", preview: true },
        { title: "Building Neural Networks with nn.Module", dur: "26:15", preview: false },
        { title: "Training Loop & Optimizers", dur: "20:40", preview: false },
        { title: "GPU Training & CUDA", dur: "15:20", preview: false },
      ]},
      { name: "Convolutional Neural Networks", lectures: [
        { title: "CNN Architecture Deep Dive", dur: "28:50", preview: false },
        { title: "Transfer Learning with ResNet", dur: "32:10", preview: false },
        { title: "Object Detection with YOLO", dur: "38:30", preview: false },
        { title: "Image Segmentation with U-Net", dur: "34:00", preview: false },
      ]},
      { name: "Sequence Models & NLP", lectures: [
        { title: "RNN & LSTM Architecture", dur: "25:20", preview: false },
        { title: "Attention Mechanism Explained", dur: "30:00", preview: false },
        { title: "Transformer from Scratch", dur: "45:30", preview: false },
      ]},
      { name: "Generative Models", lectures: [
        { title: "Variational Autoencoders (VAE)", dur: "28:40", preview: false },
        { title: "GAN Training & Stability", dur: "35:20", preview: false },
        { title: "Stable Diffusion Architecture", dur: "40:10", preview: false },
      ]},
      { name: "Fine-tuning LLMs", lectures: [
        { title: "BERT Fine-tuning for Classification", dur: "32:15", preview: false },
        { title: "GPT-2 Fine-tuning with LoRA", dur: "36:40", preview: false },
        { title: "Deploying LLMs with FastAPI", dur: "24:00", preview: false },
      ]},
    ],
  },
  {
    title: "Generative AI & LLMs with LangChain",
    catIndex: 2, instructorIndex: 17, price: 3299, level: "Advanced", lang: "English",
    tags: ["LLMs","LangChain","RAG","Prompt Engineering","GenAI"],
    short: "Build production AI applications using LangChain, RAG pipelines, and open-source LLMs.",
    full: "Generative AI is transforming software development. This course teaches you to build real AI-powered applications using LangChain, LlamaIndex, and open-source models. Topics include prompt engineering, retrieval-augmented generation (RAG), vector databases (Pinecone, Chroma), agents and tool use, memory systems, evaluation frameworks, and production deployment with LangServe. Build a document Q&A system, an AI coding assistant, and a customer support bot.",
    outcomes: "Build RAG-powered AI apps|Master prompt engineering|Create autonomous AI agents|Integrate vector databases|Deploy LLM apps to production",
    instructions: "Python required|Basic ML knowledge helpful|OpenAI API key or local LLM",
    sections: [
      { name: "LLM Fundamentals", lectures: [
        { title: "How LLMs Work", dur: "18:30", preview: true },
        { title: "Prompt Engineering Techniques", dur: "24:00", preview: false },
        { title: "LangChain Setup & Basics", dur: "16:20", preview: false },
        { title: "Chains & Pipelines", dur: "22:40", preview: false },
      ]},
      { name: "RAG Systems", lectures: [
        { title: "Document Loading & Chunking", dur: "20:10", preview: false },
        { title: "Embeddings & Vector Stores", dur: "25:30", preview: false },
        { title: "Retrieval Strategies", dur: "22:00", preview: false },
        { title: "Building a Q&A System", dur: "35:20", preview: false },
      ]},
      { name: "AI Agents", lectures: [
        { title: "Agent Architecture & Tools", dur: "26:40", preview: false },
        { title: "ReAct & Reflection Agents", dur: "30:10", preview: false },
        { title: "Multi-Agent Systems with CrewAI", dur: "34:30", preview: false },
      ]},
    ],
  },

  // ── DATA SCIENCE (cat 3) ────────────────────────────────
  {
    title: "Data Science with Python: Pandas to Production",
    catIndex: 3, instructorIndex: 1, price: 2999, level: "Intermediate", lang: "English",
    tags: ["Data Science","Pandas","Python","Visualization","EDA"],
    short: "Master data analysis, visualization, and storytelling with Python, Pandas, and Plotly.",
    full: "This course teaches the complete data science workflow: collecting and cleaning data with Pandas, exploratory data analysis, statistical testing, and building stunning interactive visualizations with Matplotlib, Seaborn, and Plotly. You will work on 5 real datasets including Netflix content data, housing prices, COVID trends, and financial market data. By the end you will be able to tell compelling data stories and prepare data for ML pipelines.",
    outcomes: "Master Pandas for data manipulation|Perform statistical EDA|Build interactive dashboards|Present data stories effectively|Prepare datasets for ML",
    instructions: "Basic Python knowledge|High school statistics|Jupyter Notebook installed",
    sections: [
      { name: "Data Acquisition & Cleaning", lectures: [
        { title: "Reading Data - CSV, Excel, JSON, SQL", dur: "18:20", preview: true },
        { title: "Handling Missing Values & Outliers", dur: "22:40", preview: false },
        { title: "Data Type Conversion & Parsing", dur: "16:30", preview: false },
        { title: "Merging, Joining & Groupby", dur: "28:10", preview: false },
      ]},
      { name: "Exploratory Data Analysis", lectures: [
        { title: "Descriptive Statistics in Pandas", dur: "19:50", preview: false },
        { title: "Correlation & Covariance Analysis", dur: "21:20", preview: false },
        { title: "Hypothesis Testing with SciPy", dur: "25:30", preview: false },
      ]},
      { name: "Data Visualization", lectures: [
        { title: "Matplotlib Deep Dive", dur: "24:00", preview: true },
        { title: "Seaborn for Statistical Plots", dur: "20:45", preview: false },
        { title: "Interactive Charts with Plotly", dur: "26:30", preview: false },
        { title: "Building a Dash Dashboard", dur: "35:00", preview: false },
      ]},
      { name: "Real-World Projects", lectures: [
        { title: "Netflix Content Analysis", dur: "40:20", preview: false },
        { title: "Housing Price EDA & Report", dur: "38:10", preview: false },
      ]},
    ],
  },
  {
    title: "SQL & Database Design Mastery",
    catIndex: 10, instructorIndex: 10, price: 2199, level: "Beginner", lang: "English",
    tags: ["SQL","PostgreSQL","Database Design","Normalization","Indexing"],
    short: "Master SQL from basics to advanced: joins, window functions, CTEs, and database design.",
    full: "SQL remains the most important skill for data professionals. This course covers SQL from the very beginning to advanced topics used by senior engineers and data scientists. You will learn SELECT queries, filtering and sorting, all JOIN types, subqueries, aggregate functions, window functions, CTEs, stored procedures, triggers, indexing strategies, query execution plans, and normalization. All examples use PostgreSQL with real-world datasets.",
    outcomes: "Write complex SQL queries|Master window functions & CTEs|Design normalized databases|Optimize query performance|Use PostgreSQL advanced features",
    instructions: "No prior SQL experience needed|Basic computer skills",
    sections: [
      { name: "SQL Fundamentals", lectures: [
        { title: "SELECT, FROM, WHERE Basics", dur: "18:00", preview: true },
        { title: "Filtering, Sorting & LIMIT", dur: "14:30", preview: false },
        { title: "Aggregate Functions & GROUP BY", dur: "20:10", preview: false },
      ]},
      { name: "Joining Tables", lectures: [
        { title: "INNER, LEFT, RIGHT, FULL JOINs", dur: "25:20", preview: true },
        { title: "Self Joins & Cross Joins", dur: "16:40", preview: false },
        { title: "Subqueries & Correlated Queries", dur: "22:30", preview: false },
      ]},
      { name: "Advanced SQL", lectures: [
        { title: "Window Functions: ROW_NUMBER, RANK, LAG", dur: "30:00", preview: false },
        { title: "Common Table Expressions (CTEs)", dur: "22:00", preview: false },
        { title: "Recursive CTEs", dur: "18:20", preview: false },
      ]},
      { name: "Database Design & Performance", lectures: [
        { title: "Normalization: 1NF, 2NF, 3NF", dur: "28:10", preview: false },
        { title: "Indexing Strategies", dur: "24:30", preview: false },
        { title: "Query Execution Plans with EXPLAIN", dur: "20:45", preview: false },
        { title: "Transactions & ACID Properties", dur: "19:00", preview: false },
      ]},
    ],
  },

  // ── CYBERSECURITY (cat 4) ───────────────────────────────
  {
    title: "Ethical Hacking & Penetration Testing",
    catIndex: 4, instructorIndex: 4, price: 3299, level: "Intermediate", lang: "English",
    tags: ["Ethical Hacking","Penetration Testing","Kali Linux","OWASP","Security"],
    short: "Master ethical hacking, penetration testing, and vulnerability assessment with Kali Linux.",
    full: "This comprehensive penetration testing course prepares you for CEH and OSCP certifications. You will set up a legal hacking lab with Kali Linux and Metasploitable, learn network reconnaissance with Nmap and Shodan, exploit vulnerabilities with Metasploit, perform web application attacks (SQL injection, XSS, CSRF, IDOR), crack passwords with Hashcat and John the Ripper, and perform privilege escalation on Windows and Linux systems. All techniques are taught in legal lab environments.",
    outcomes: "Set up a professional hacking lab|Perform network reconnaissance|Exploit web vulnerabilities|Crack hashed passwords|Write professional pentest reports",
    instructions: "Basic Linux command line|Networking fundamentals (TCP/IP)|VirtualBox or VMware installed",
    sections: [
      { name: "Hacking Lab Setup", lectures: [
        { title: "Installing Kali Linux on VirtualBox", dur: "20:00", preview: true },
        { title: "Setting Up Vulnerable VMs", dur: "16:30", preview: false },
        { title: "Essential Kali Tools Tour", dur: "22:10", preview: false },
      ]},
      { name: "Network Reconnaissance", lectures: [
        { title: "Passive Recon with OSINT", dur: "24:20", preview: false },
        { title: "Active Scanning with Nmap", dur: "28:40", preview: false },
        { title: "Vulnerability Scanning with OpenVAS", dur: "20:00", preview: false },
      ]},
      { name: "Exploitation", lectures: [
        { title: "Metasploit Framework Mastery", dur: "35:20", preview: false },
        { title: "Buffer Overflow Exploitation", dur: "40:00", preview: false },
        { title: "Post-Exploitation Techniques", dur: "30:10", preview: false },
      ]},
      { name: "Web Application Attacks", lectures: [
        { title: "OWASP Top 10 Deep Dive", dur: "32:00", preview: false },
        { title: "SQL Injection Lab", dur: "28:30", preview: false },
        { title: "XSS, CSRF & SSRF Attacks", dur: "25:40", preview: false },
        { title: "IDOR & Broken Access Control", dur: "22:00", preview: false },
      ]},
      { name: "Reporting", lectures: [
        { title: "Writing Professional Pentest Reports", dur: "20:30", preview: false },
        { title: "CVSS Scoring & Risk Rating", dur: "15:40", preview: false },
      ]},
    ],
  },
  {
    title: "Web Application Security for Developers",
    catIndex: 4, instructorIndex: 4, price: 2499, level: "Intermediate", lang: "English",
    tags: ["Web Security","OWASP","Node.js Security","Authentication","Secure Coding"],
    short: "Secure your web applications against OWASP Top 10 vulnerabilities with hands-on coding labs.",
    full: "Every developer needs to understand application security. This practical course teaches you to identify and fix security vulnerabilities in your code. Topics include OWASP Top 10, secure authentication implementation, session management, input validation, SQL injection prevention, XSS mitigation, CSRF protection, security headers, dependency vulnerability scanning, and secure deployment practices. All labs use real vulnerable Node.js applications you fix hands-on.",
    outcomes: "Understand OWASP Top 10|Implement secure authentication|Prevent injection attacks|Add proper security headers|Conduct code security reviews",
    instructions: "Web development experience|Node.js & JavaScript knowledge",
    sections: [
      { name: "Security Mindset", lectures: [
        { title: "Threat Modeling for Developers", dur: "18:20", preview: true },
        { title: "OWASP Top 10 Overview", dur: "22:00", preview: false },
        { title: "Secure Development Lifecycle", dur: "16:10", preview: false },
      ]},
      { name: "Authentication Security", lectures: [
        { title: "Password Hashing Best Practices", dur: "14:30", preview: false },
        { title: "JWT Security Pitfalls", dur: "20:40", preview: false },
        { title: "OAuth 2.0 & PKCE Flow", dur: "26:00", preview: false },
        { title: "Multi-Factor Authentication", dur: "22:30", preview: false },
      ]},
      { name: "Injection Prevention", lectures: [
        { title: "SQL Injection Fix in Node.js", dur: "24:10", preview: false },
        { title: "XSS Prevention & CSP Headers", dur: "20:00", preview: false },
        { title: "NoSQL Injection in MongoDB", dur: "18:30", preview: false },
      ]},
    ],
  },

  // ── DEVOPS (cat 5) ──────────────────────────────────────
  {
    title: "Docker & Kubernetes: Container Orchestration",
    catIndex: 5, instructorIndex: 2, price: 3199, level: "Intermediate", lang: "English",
    tags: ["Docker","Kubernetes","DevOps","Containers","CI/CD"],
    short: "Master Docker containerization and Kubernetes orchestration for production deployments.",
    full: "Containers are the backbone of modern cloud infrastructure. This course covers Docker from fundamentals to advanced patterns: building optimized images, multi-stage builds, Docker Compose for local development, Docker networking and volumes, and container security. The second half focuses on Kubernetes: Pods, Deployments, Services, Ingress, ConfigMaps, Secrets, Helm charts, HPA, and production cluster management on GKE and EKS.",
    outcomes: "Build optimized Docker images|Manage multi-container apps with Compose|Deploy to Kubernetes clusters|Configure Helm charts|Implement zero-downtime deployments",
    instructions: "Linux command line basics|Basic networking concepts|Cloud account (GCP or AWS)",
    sections: [
      { name: "Docker Deep Dive", lectures: [
        { title: "Container vs VM Architecture", dur: "16:20", preview: true },
        { title: "Dockerfile Best Practices", dur: "22:40", preview: false },
        { title: "Multi-stage Builds", dur: "18:30", preview: false },
        { title: "Docker Compose for Dev Environments", dur: "25:00", preview: false },
        { title: "Docker Networking Explained", dur: "20:10", preview: false },
      ]},
      { name: "Kubernetes Fundamentals", lectures: [
        { title: "Kubernetes Architecture Overview", dur: "24:00", preview: true },
        { title: "Pods, ReplicaSets & Deployments", dur: "28:30", preview: false },
        { title: "Services: ClusterIP, NodePort, LoadBalancer", dur: "22:20", preview: false },
        { title: "Ingress & TLS Termination", dur: "26:10", preview: false },
        { title: "ConfigMaps & Secrets", dur: "18:40", preview: false },
      ]},
      { name: "Production Kubernetes", lectures: [
        { title: "Helm Charts for Deployment", dur: "30:00", preview: false },
        { title: "Horizontal Pod Autoscaler", dur: "20:30", preview: false },
        { title: "Rolling Updates & Rollbacks", dur: "18:00", preview: false },
        { title: "Kubernetes RBAC", dur: "22:10", preview: false },
      ]},
    ],
  },
  {
    title: "CI/CD Pipelines with GitHub Actions",
    catIndex: 5, instructorIndex: 2, price: 1999, level: "Intermediate", lang: "English",
    tags: ["GitHub Actions","CI/CD","DevOps","Automation","Testing"],
    short: "Build automated CI/CD pipelines using GitHub Actions for any application stack.",
    full: "Modern development requires automated build, test, and deployment pipelines. This course teaches you to build production-grade CI/CD with GitHub Actions. Topics include workflow syntax, triggers and events, matrix builds, secrets management, reusable workflows, environment protection rules, deployment to AWS/GCP/Azure/Vercel, container scanning, automated testing gates, PR-based deployments, and monitoring deployment health.",
    outcomes: "Build GitHub Actions workflows|Implement matrix build strategies|Deploy to major cloud providers|Automate security scanning|Create reusable action libraries",
    instructions: "Git proficiency required|Basic Linux command line|GitHub account",
    sections: [
      { name: "GitHub Actions Basics", lectures: [
        { title: "Workflow Syntax & Triggers", dur: "16:20", preview: true },
        { title: "Jobs, Steps & Runners", dur: "18:40", preview: false },
        { title: "Caching Dependencies", dur: "14:30", preview: false },
      ]},
      { name: "Testing Automation", lectures: [
        { title: "Running Unit & Integration Tests", dur: "20:10", preview: false },
        { title: "Code Coverage Reports", dur: "15:30", preview: false },
        { title: "Security Scanning with CodeQL", dur: "18:00", preview: false },
      ]},
      { name: "Deployment Pipelines", lectures: [
        { title: "Deploy to AWS EC2 & ECS", dur: "26:40", preview: false },
        { title: "Deploy to Vercel & Netlify", dur: "16:20", preview: false },
        { title: "Kubernetes Deployment Strategy", dur: "24:30", preview: false },
        { title: "Blue-Green & Canary Deployments", dur: "22:00", preview: false },
      ]},
    ],
  },

  // ── CLOUD COMPUTING (cat 6) ─────────────────────────────
  {
    title: "AWS Solutions Architect Associate",
    catIndex: 6, instructorIndex: 2, price: 3499, level: "Intermediate", lang: "English",
    tags: ["AWS","Cloud","Solutions Architect","EC2","S3","Lambda"],
    short: "Prepare for and pass the AWS Solutions Architect Associate certification exam with hands-on labs.",
    full: "This comprehensive AWS certification course covers every service tested in the SAA-C03 exam: IAM, EC2, S3, RDS, DynamoDB, Lambda, API Gateway, CloudFront, Route 53, VPC, ELB, Auto Scaling, ECS, EKS, SQS, SNS, Kinesis, CloudWatch, CloudTrail, and much more. Each service is taught with architecture diagrams and hands-on labs in real AWS accounts. The course includes 6 full-length practice exams with 65 questions each.",
    outcomes: "Pass AWS SAA-C03 exam|Design cloud architectures|Implement AWS security best practices|Build serverless applications|Design highly available systems",
    instructions: "Basic networking knowledge|AWS free tier account|No prior AWS experience needed",
    sections: [
      { name: "IAM & AWS Foundations", lectures: [
        { title: "AWS Global Infrastructure", dur: "14:20", preview: true },
        { title: "IAM Users, Groups & Policies", dur: "22:30", preview: false },
        { title: "IAM Roles & Service Policies", dur: "18:10", preview: false },
        { title: "AWS CLI & SDK Setup", dur: "12:40", preview: false },
      ]},
      { name: "Compute Services", lectures: [
        { title: "EC2 Instance Types & Pricing", dur: "24:00", preview: false },
        { title: "AMIs, User Data & Metadata", dur: "18:30", preview: false },
        { title: "Auto Scaling Groups & Launch Templates", dur: "26:10", preview: false },
        { title: "Lambda Serverless Deep Dive", dur: "30:40", preview: false },
      ]},
      { name: "Storage & Databases", lectures: [
        { title: "S3 Buckets, Versioning & Lifecycle", dur: "28:20", preview: false },
        { title: "RDS Multi-AZ & Read Replicas", dur: "24:30", preview: false },
        { title: "DynamoDB Design Patterns", dur: "32:00", preview: false },
        { title: "ElastiCache for Caching", dur: "20:10", preview: false },
      ]},
      { name: "Networking & Security", lectures: [
        { title: "VPC, Subnets & Route Tables", dur: "28:00", preview: false },
        { title: "Security Groups vs NACLs", dur: "20:30", preview: false },
        { title: "CloudFront CDN Architecture", dur: "22:40", preview: false },
        { title: "Route 53 DNS & Health Checks", dur: "18:20", preview: false },
      ]},
      { name: "Architecture & Best Practices", lectures: [
        { title: "Well-Architected Framework", dur: "22:00", preview: false },
        { title: "High Availability Design Patterns", dur: "26:30", preview: false },
        { title: "Cost Optimization Strategies", dur: "18:40", preview: false },
      ]},
    ],
  },

  // ── UI/UX DESIGN (cat 7) ────────────────────────────────
  {
    title: "UI/UX Design Mastery with Figma",
    catIndex: 7, instructorIndex: 3, price: 2499, level: "Beginner", lang: "English",
    tags: ["Figma","UI Design","UX","Design Systems","Prototyping"],
    short: "Master UI/UX design, Figma, design systems, and user research from scratch.",
    full: "This comprehensive UI/UX design course takes you from design fundamentals to building complete design systems in Figma. You will learn design principles, typography and color theory, layout grids, component-based design, auto-layout, interactive prototyping, usability testing, and how to present designs to stakeholders. You will design a complete mobile banking app, a SaaS dashboard, and a landing page, all with professional-grade detail.",
    outcomes: "Master Figma tools & features|Design with a component system|Create interactive prototypes|Conduct user research|Build design handoff documentation",
    instructions: "No design experience required|Figma account (free)|Creative mindset",
    sections: [
      { name: "Design Fundamentals", lectures: [
        { title: "Visual Design Principles", dur: "20:00", preview: true },
        { title: "Typography & Type Hierarchy", dur: "18:30", preview: false },
        { title: "Color Theory & Palettes", dur: "22:10", preview: false },
        { title: "Layout & Grid Systems", dur: "19:40", preview: false },
      ]},
      { name: "Figma Deep Dive", lectures: [
        { title: "Figma Interface Tour", dur: "14:20", preview: true },
        { title: "Frames, Groups & Auto Layout", dur: "24:30", preview: false },
        { title: "Components & Variants", dur: "28:00", preview: false },
        { title: "Styles & Design Tokens", dur: "20:10", preview: false },
      ]},
      { name: "User Experience Design", lectures: [
        { title: "User Research Methods", dur: "22:40", preview: false },
        { title: "User Flows & Information Architecture", dur: "20:00", preview: false },
        { title: "Wireframing & Low-Fi Prototypes", dur: "24:30", preview: false },
        { title: "Usability Testing", dur: "18:20", preview: false },
      ]},
      { name: "Design Projects", lectures: [
        { title: "Mobile Banking App Design", dur: "50:00", preview: false },
        { title: "SaaS Dashboard Design", dur: "45:20", preview: false },
        { title: "Design Handoff to Developers", dur: "16:30", preview: false },
      ]},
    ],
  },

  // ── BLOCKCHAIN (cat 8) ──────────────────────────────────
  {
    title: "Ethereum & Solidity Smart Contract Development",
    catIndex: 8, instructorIndex: 5, price: 3499, level: "Intermediate", lang: "English",
    tags: ["Solidity","Ethereum","Smart Contracts","DeFi","Web3"],
    short: "Build and deploy secure Ethereum smart contracts and DeFi applications with Solidity.",
    full: "This course teaches Ethereum smart contract development from the ground up. You will learn Solidity syntax, contract patterns, security best practices, DeFi protocols (ERC-20, ERC-721, ERC-1155), testing with Hardhat and Foundry, deployment to mainnet and testnets, and building frontend dApps with ethers.js and wagmi. Projects include a token launchpad, an NFT marketplace, and a DeFi lending protocol.",
    outcomes: "Write secure Solidity contracts|Implement ERC-20 & ERC-721 tokens|Build DeFi protocols|Test contracts with Hardhat|Deploy to Ethereum mainnet",
    instructions: "JavaScript knowledge required|Basic understanding of blockchain|MetaMask wallet",
    sections: [
      { name: "Blockchain Fundamentals", lectures: [
        { title: "How Ethereum Works", dur: "22:30", preview: true },
        { title: "Wallets, Keys & Transactions", dur: "18:10", preview: false },
        { title: "Gas & EVM Explained", dur: "20:40", preview: false },
      ]},
      { name: "Solidity Programming", lectures: [
        { title: "Solidity Syntax & Types", dur: "24:00", preview: false },
        { title: "Functions, Modifiers & Events", dur: "26:30", preview: false },
        { title: "Mappings, Arrays & Structs", dur: "22:10", preview: false },
        { title: "Inheritance & Interfaces", dur: "20:00", preview: false },
        { title: "Security Patterns & Reentrancy", dur: "30:20", preview: false },
      ]},
      { name: "Token Standards", lectures: [
        { title: "Building an ERC-20 Token", dur: "28:40", preview: false },
        { title: "NFTs with ERC-721", dur: "32:10", preview: false },
        { title: "ERC-1155 Multi-Token Standard", dur: "24:00", preview: false },
      ]},
      { name: "DeFi Development", lectures: [
        { title: "AMM & Liquidity Pool Mechanics", dur: "35:20", preview: false },
        { title: "Lending Protocol Architecture", dur: "38:00", preview: false },
        { title: "Flash Loans & Arbitrage", dur: "30:10", preview: false },
      ]},
    ],
  },

  // ── DIGITAL MARKETING (cat 9) ───────────────────────────
  {
    title: "Complete Digital Marketing Bootcamp",
    catIndex: 9, instructorIndex: 7, price: 2199, level: "Beginner", lang: "English",
    tags: ["SEO","Google Ads","Social Media","Email Marketing","Analytics"],
    short: "Master SEO, Google Ads, social media, email marketing, and analytics from zero to expert.",
    full: "Digital marketing is the most in-demand skill for businesses of all sizes. This bootcamp covers every major digital marketing channel: on-page and off-page SEO, Google Ads (Search, Display, Shopping), Meta Ads, LinkedIn Advertising, email marketing with Mailchimp, content marketing strategy, influencer marketing, conversion rate optimization, and Google Analytics 4. You will manage a real advertising budget and see real campaign results.",
    outcomes: "Run profitable Google Ads campaigns|Achieve first-page SEO rankings|Build email marketing funnels|Analyze campaigns in GA4|Create a full digital marketing strategy",
    instructions: "No marketing experience needed|Google account|Willingness to learn",
    sections: [
      { name: "SEO Foundations", lectures: [
        { title: "How Search Engines Work", dur: "15:20", preview: true },
        { title: "Keyword Research with Ahrefs", dur: "24:30", preview: false },
        { title: "On-Page SEO Optimization", dur: "22:00", preview: false },
        { title: "Link Building Strategies", dur: "26:10", preview: false },
      ]},
      { name: "Google Ads", lectures: [
        { title: "Google Ads Account Structure", dur: "18:40", preview: true },
        { title: "Search Campaign Setup", dur: "28:00", preview: false },
        { title: "Display & Remarketing Ads", dur: "24:20", preview: false },
        { title: "Conversion Tracking Setup", dur: "16:30", preview: false },
      ]},
      { name: "Social Media Marketing", lectures: [
        { title: "Meta Ads Manager Deep Dive", dur: "30:00", preview: false },
        { title: "Content Strategy for Instagram", dur: "22:10", preview: false },
        { title: "LinkedIn B2B Advertising", dur: "24:00", preview: false },
      ]},
      { name: "Email & Analytics", lectures: [
        { title: "Email List Building Strategies", dur: "20:30", preview: false },
        { title: "Mailchimp Automation Sequences", dur: "24:00", preview: false },
        { title: "Google Analytics 4 Mastery", dur: "32:10", preview: false },
        { title: "Conversion Rate Optimization", dur: "26:40", preview: false },
      ]},
    ],
  },

  // ── DATABASE ENGINEERING (cat 10) ───────────────────────
  {
    title: "MongoDB - The Complete Developer's Guide",
    catIndex: 10, instructorIndex: 10, price: 2499, level: "Intermediate", lang: "English",
    tags: ["MongoDB","NoSQL","Aggregation","Atlas","Mongoose"],
    short: "Master MongoDB from basics to advanced aggregation, indexing, and Atlas cloud database.",
    full: "MongoDB is the world's most popular NoSQL database. This course covers everything from document modeling and CRUD operations to advanced aggregation pipelines, text search, geospatial queries, time-series collections, Atlas Search, and production scaling strategies. You will build a complete Airbnb-style booking platform database layer with realistic data and performance benchmarks.",
    outcomes: "Design MongoDB data models|Write complex aggregation pipelines|Implement full-text search|Optimize with indexes|Deploy on MongoDB Atlas",
    instructions: "Basic programming knowledge|JSON familiarity|MongoDB Atlas account (free)",
    sections: [
      { name: "MongoDB Fundamentals", lectures: [
        { title: "Document Model vs Relational", dur: "16:30", preview: true },
        { title: "CRUD Operations in Detail", dur: "24:00", preview: false },
        { title: "Data Modeling Patterns", dur: "28:20", preview: false },
      ]},
      { name: "Aggregation Framework", lectures: [
        { title: "Aggregation Pipeline Stages", dur: "26:40", preview: true },
        { title: "$lookup & $unwind", dur: "22:10", preview: false },
        { title: "$facet & Complex Pipelines", dur: "30:30", preview: false },
      ]},
      { name: "Performance & Indexing", lectures: [
        { title: "Index Types & When to Use Them", dur: "24:00", preview: false },
        { title: "Compound Indexes & ESR Rule", dur: "20:30", preview: false },
        { title: "Explain Plans & Optimization", dur: "22:10", preview: false },
      ]},
      { name: "Atlas & Production", lectures: [
        { title: "Atlas Cluster Setup & Tiers", dur: "18:20", preview: false },
        { title: "Atlas Search with Lucene", dur: "26:40", preview: false },
        { title: "Backup, Monitoring & Alerts", dur: "20:00", preview: false },
      ]},
    ],
  },

  // ── GAME DEVELOPMENT (cat 11) ───────────────────────────
  {
    title: "Unity Game Development: 2D & 3D",
    catIndex: 11, instructorIndex: 11, price: 3199, level: "Beginner", lang: "English",
    tags: ["Unity","C#","Game Development","2D","3D"],
    short: "Build 2D and 3D games with Unity and C# from beginner to publishing on Steam and mobile.",
    full: "Unity is the world's most popular game engine. This course teaches you to build professional 2D and 3D games using Unity and C#. Topics include the Unity editor, physics system, animation with Animator and Timeline, particle effects, audio, UI design with Unity UI Toolkit, AI with NavMesh, multiplayer with Photon PUN, shader graphs, and publishing to PC, mobile, and consoles. Build a platformer, an FPS prototype, and a mobile casual game.",
    outcomes: "Master Unity Editor & C#|Build 2D & 3D game mechanics|Implement game physics & AI|Create stunning visual effects|Publish games to multiple platforms",
    instructions: "No game dev experience needed|Basic programming helpful|Windows or Mac",
    sections: [
      { name: "Unity Fundamentals", lectures: [
        { title: "Unity Editor Tour", dur: "18:00", preview: true },
        { title: "GameObjects, Components & Transforms", dur: "22:30", preview: false },
        { title: "C# Scripting Basics", dur: "26:40", preview: false },
        { title: "Physics & Colliders", dur: "24:10", preview: false },
      ]},
      { name: "2D Game Development", lectures: [
        { title: "Sprite Rendering & Animation", dur: "22:00", preview: false },
        { title: "Tilemap System", dur: "18:30", preview: false },
        { title: "2D Platformer Controller", dur: "30:20", preview: false },
        { title: "Enemy AI & Pathfinding", dur: "28:10", preview: false },
      ]},
      { name: "3D Game Development", lectures: [
        { title: "3D Assets & Materials", dur: "20:40", preview: false },
        { title: "Character Controller", dur: "26:00", preview: false },
        { title: "NavMesh AI Navigation", dur: "24:30", preview: false },
        { title: "Lighting & Post Processing", dur: "22:00", preview: false },
      ]},
      { name: "Publishing & Monetization", lectures: [
        { title: "Game Optimization Techniques", dur: "22:10", preview: false },
        { title: "Building for PC, Android & iOS", dur: "20:30", preview: false },
        { title: "Steam Publishing Walkthrough", dur: "18:40", preview: false },
      ]},
    ],
  },

  // ── PROGRAMMING LANGUAGES (cat 12) ──────────────────────
  {
    title: "Python Masterclass: From Beginner to Pro",
    catIndex: 12, instructorIndex: 8, price: 1999, level: "Beginner", lang: "English",
    tags: ["Python","Programming","Automation","OOP","Web Scraping"],
    short: "Master Python programming from scratch with projects in automation, web scraping, and APIs.",
    full: "Python is the most versatile programming language in the world. This masterclass covers everything: syntax and data types, control flow, functions and closures, OOP with classes and decorators, file I/O, error handling, modules and packages, virtual environments, and the standard library. You will build real projects including a web scraper, a REST API, a GUI desktop app, and an automation script suite. The course includes Python 3.12 features.",
    outcomes: "Master Python syntax & data structures|Write OOP code confidently|Build web scrapers with BeautifulSoup|Create REST APIs with FastAPI|Automate repetitive tasks",
    instructions: "No programming experience needed|Computer with internet access|Enthusiasm to learn",
    sections: [
      { name: "Python Foundations", lectures: [
        { title: "Python Setup & Hello World", dur: "10:30", preview: true },
        { title: "Variables, Data Types & Operators", dur: "20:00", preview: false },
        { title: "Control Flow: if/else & Loops", dur: "18:40", preview: false },
        { title: "Functions & Scope", dur: "22:30", preview: false },
      ]},
      { name: "Data Structures", lectures: [
        { title: "Lists & Tuples In Depth", dur: "24:10", preview: true },
        { title: "Dictionaries & Sets", dur: "20:30", preview: false },
        { title: "List Comprehensions & Generators", dur: "22:00", preview: false },
      ]},
      { name: "Object-Oriented Programming", lectures: [
        { title: "Classes, Objects & __init__", dur: "24:40", preview: false },
        { title: "Inheritance & Polymorphism", dur: "22:10", preview: false },
        { title: "Decorators & Magic Methods", dur: "26:30", preview: false },
        { title: "Abstract Classes & Protocols", dur: "20:00", preview: false },
      ]},
      { name: "Real-World Projects", lectures: [
        { title: "Web Scraper with BeautifulSoup", dur: "36:20", preview: false },
        { title: "REST API with FastAPI", dur: "40:10", preview: false },
        { title: "Desktop GUI with Tkinter", dur: "32:30", preview: false },
        { title: "Task Automation Suite", dur: "28:00", preview: false },
      ]},
    ],
  },
  {
    title: "Go (Golang) for Backend Development",
    catIndex: 12, instructorIndex: 18, price: 2699, level: "Intermediate", lang: "English",
    tags: ["Go","Golang","Backend","Concurrency","Microservices"],
    short: "Build high-performance backend services and microservices with Go and its concurrency model.",
    full: "Go is Google's systems programming language known for exceptional performance and built-in concurrency. This course teaches Go from the ground up: syntax and types, goroutines and channels, the standard library, error handling patterns, testing, HTTP servers with Chi/Gin/Fiber, gRPC, PostgreSQL integration, Redis caching, JWT authentication, Prometheus metrics, and Docker deployment. Build a production microservices backend.",
    outcomes: "Write idiomatic Go code|Master goroutines & channels|Build REST & gRPC APIs|Implement clean architecture|Deploy Go services to production",
    instructions: "Any programming language experience|Basic understanding of concurrency helpful",
    sections: [
      { name: "Go Fundamentals", lectures: [
        { title: "Go Syntax & Types", dur: "20:10", preview: true },
        { title: "Arrays, Slices & Maps", dur: "18:40", preview: false },
        { title: "Structs & Interfaces", dur: "22:30", preview: false },
        { title: "Error Handling in Go", dur: "16:50", preview: false },
      ]},
      { name: "Concurrency", lectures: [
        { title: "Goroutines & the Go Scheduler", dur: "24:20", preview: true },
        { title: "Channels & Select Statement", dur: "26:10", preview: false },
        { title: "Mutexes & WaitGroups", dur: "20:00", preview: false },
        { title: "Worker Pool Pattern", dur: "22:40", preview: false },
      ]},
      { name: "Building APIs", lectures: [
        { title: "HTTP Server with net/http", dur: "18:30", preview: false },
        { title: "REST API with Chi Router", dur: "26:00", preview: false },
        { title: "gRPC & Protocol Buffers", dur: "30:20", preview: false },
        { title: "JWT Auth Middleware", dur: "20:10", preview: false },
      ]},
      { name: "Production Patterns", lectures: [
        { title: "Postgres with pgx Driver", dur: "24:40", preview: false },
        { title: "Redis Caching Layer", dur: "18:20", preview: false },
        { title: "Prometheus & Grafana Monitoring", dur: "22:00", preview: false },
        { title: "Docker Multi-Stage Build for Go", dur: "16:30", preview: false },
      ]},
    ],
  },

  // ── ADDITIONAL COURSES ───────────────────────────────────
  {
    title: "Advanced CSS: Animations & Modern Layouts",
    catIndex: 0, instructorIndex: 16, price: 1799, level: "Intermediate", lang: "English",
    tags: ["CSS","Animations","Grid","Flexbox","CSS Variables"],
    short: "Master modern CSS: Grid, Flexbox, custom properties, animations, and advanced visual techniques.",
    full: "CSS is more powerful than most developers realize. This advanced course covers CSS Grid mastery, Flexbox deep dive, custom properties (CSS variables), scroll-driven animations, container queries, CSS layers, view transitions, 3D transforms, SVG animations, and building a complete design system with only CSS. You will also learn CSS architecture patterns like BEM, utility classes, and when to use each.",
    outcomes: "Master CSS Grid & Flexbox|Create smooth animations|Use CSS custom properties|Implement container queries|Build a pure CSS design system",
    instructions: "Basic HTML & CSS knowledge|Modern browser installed",
    sections: [
      { name: "Modern Layout Systems", lectures: [
        { title: "CSS Grid Complete Guide", dur: "32:00", preview: true },
        { title: "Flexbox Mastery", dur: "26:20", preview: false },
        { title: "Container Queries", dur: "20:10", preview: false },
        { title: "Subgrid & Advanced Grid", dur: "24:30", preview: false },
      ]},
      { name: "CSS Animations", lectures: [
        { title: "Transitions & Keyframe Animations", dur: "22:40", preview: true },
        { title: "Scroll-Driven Animations", dur: "26:00", preview: false },
        { title: "View Transition API", dur: "18:30", preview: false },
        { title: "3D Transforms & Perspective", dur: "24:10", preview: false },
      ]},
      { name: "CSS Architecture", lectures: [
        { title: "BEM Methodology", dur: "16:20", preview: false },
        { title: "CSS Custom Properties System", dur: "22:00", preview: false },
        { title: "CSS Layers & Cascade Control", dur: "18:40", preview: false },
      ]},
    ],
  },
  {
    title: "Redis: Caching, Pub/Sub & Real-Time Systems",
    catIndex: 10, instructorIndex: 10, price: 2299, level: "Advanced", lang: "English",
    tags: ["Redis","Caching","Pub/Sub","Real-time","Queues"],
    short: "Master Redis for caching, session management, pub/sub messaging, and real-time applications.",
    full: "Redis is the most popular in-memory data store used by companies like Twitter, GitHub, and Stack Overflow. This course covers Redis data structures in depth (strings, hashes, sets, sorted sets, lists, streams), caching strategies (cache-aside, write-through, write-behind), TTL management, Lua scripting, pub/sub messaging, Redis Streams for event sourcing, Redlock distributed locking, Redis Cluster for horizontal scaling, and integration with Node.js and Python.",
    outcomes: "Implement caching strategies|Use all Redis data structures|Build pub/sub systems|Implement distributed locking|Set up Redis Cluster",
    instructions: "Node.js or Python experience|Basic understanding of caching",
    sections: [
      { name: "Redis Data Structures", lectures: [
        { title: "Strings & Atomic Operations", dur: "18:20", preview: true },
        { title: "Lists, Hashes & Sets", dur: "24:00", preview: false },
        { title: "Sorted Sets & Leaderboards", dur: "22:30", preview: false },
        { title: "Streams for Event Sourcing", dur: "28:10", preview: false },
      ]},
      { name: "Caching Patterns", lectures: [
        { title: "Cache-Aside & Write-Through", dur: "20:40", preview: false },
        { title: "Cache Invalidation Strategies", dur: "18:30", preview: false },
        { title: "Session Management with Redis", dur: "16:20", preview: false },
      ]},
      { name: "Advanced Redis", lectures: [
        { title: "Pub/Sub Messaging System", dur: "22:10", preview: false },
        { title: "Redlock Distributed Locking", dur: "20:00", preview: false },
        { title: "Redis Cluster & Sentinel", dur: "26:30", preview: false },
        { title: "Lua Scripting in Redis", dur: "18:40", preview: false },
      ]},
    ],
  },
  {
    title: "Apache Kafka: Event-Driven Architecture",
    catIndex: 5, instructorIndex: 15, price: 2999, level: "Advanced", lang: "English",
    tags: ["Kafka","Event-Driven","Microservices","Streaming","Data Engineering"],
    short: "Build scalable event-driven systems and data streaming pipelines with Apache Kafka.",
    full: "Apache Kafka powers real-time data pipelines at Netflix, LinkedIn, and Uber. This course teaches Kafka architecture: brokers, topics, partitions, producers and consumers, consumer groups, exactly-once semantics, Schema Registry with Avro, Kafka Streams for stream processing, Kafka Connect for data integration, and Confluent Cloud deployment. You will build a real-time order processing system and a change data capture pipeline.",
    outcomes: "Design event-driven architectures|Build Kafka producers & consumers|Implement Kafka Streams processing|Use Schema Registry & Avro|Deploy Kafka on Confluent Cloud",
    instructions: "Java or Python experience|Basic understanding of messaging systems|Docker installed",
    sections: [
      { name: "Kafka Architecture", lectures: [
        { title: "Kafka Core Concepts", dur: "22:00", preview: true },
        { title: "Topics, Partitions & Replication", dur: "26:30", preview: false },
        { title: "Producer Internals & Configs", dur: "24:10", preview: false },
        { title: "Consumer Groups & Offsets", dur: "28:40", preview: false },
      ]},
      { name: "Advanced Producer/Consumer", lectures: [
        { title: "Exactly-Once Semantics", dur: "24:00", preview: false },
        { title: "Schema Registry & Avro", dur: "22:30", preview: false },
        { title: "Kafka Security - TLS & SASL", dur: "20:10", preview: false },
      ]},
      { name: "Stream Processing", lectures: [
        { title: "Kafka Streams API", dur: "30:20", preview: false },
        { title: "KTable & KStream Operations", dur: "26:40", preview: false },
        { title: "Kafka Connect for ETL", dur: "24:00", preview: false },
      ]},
    ],
  },
  {
    title: "DevOps Engineering: From Zero to SRE",
    catIndex: 5, instructorIndex: 19, price: 3699, level: "Advanced", lang: "English",
    tags: ["DevOps","SRE","Terraform","Ansible","Monitoring"],
    short: "Master the complete DevOps and SRE toolkit: Terraform, Ansible, Prometheus, and incident management.",
    full: "Site Reliability Engineering is the highest-paid specialization in tech. This comprehensive course covers the complete DevOps and SRE stack: Linux system administration, shell scripting, Ansible for configuration management, Terraform for infrastructure-as-code, Prometheus and Grafana for monitoring, ELK stack for log management, incident management and postmortems, SLI/SLO/SLA design, capacity planning, and chaos engineering. Build a complete production infrastructure from scratch.",
    outcomes: "Provision infrastructure with Terraform|Manage configs with Ansible|Build observability stack|Implement SLOs & error budgets|Conduct chaos engineering experiments",
    instructions: "Linux command line proficiency|Basic networking|Cloud provider account",
    sections: [
      { name: "Linux & Shell Scripting", lectures: [
        { title: "Linux System Administration", dur: "28:00", preview: true },
        { title: "Bash Scripting Masterclass", dur: "32:20", preview: false },
        { title: "Networking Tools: nc, curl, tcpdump", dur: "20:40", preview: false },
      ]},
      { name: "Infrastructure as Code", lectures: [
        { title: "Terraform Fundamentals", dur: "26:30", preview: false },
        { title: "Terraform Modules & State", dur: "30:00", preview: false },
        { title: "Ansible Playbooks & Roles", dur: "28:10", preview: false },
        { title: "GitOps with ArgoCD", dur: "24:20", preview: false },
      ]},
      { name: "Observability", lectures: [
        { title: "Prometheus Metrics & Alerting", dur: "26:00", preview: false },
        { title: "Grafana Dashboard Design", dur: "22:30", preview: false },
        { title: "ELK Stack for Log Analysis", dur: "28:40", preview: false },
        { title: "Distributed Tracing with Jaeger", dur: "24:10", preview: false },
      ]},
      { name: "SRE Practices", lectures: [
        { title: "SLIs, SLOs & Error Budgets", dur: "22:00", preview: false },
        { title: "Incident Response & Runbooks", dur: "24:30", preview: false },
        { title: "Chaos Engineering with Chaos Monkey", dur: "26:00", preview: false },
      ]},
    ],
  },
  {
    title: "Data Engineering with Apache Spark & Airflow",
    catIndex: 3, instructorIndex: 15, price: 3299, level: "Advanced", lang: "English",
    tags: ["Apache Spark","Airflow","Data Engineering","ETL","Big Data"],
    short: "Build large-scale data pipelines and ETL workflows with Apache Spark, Airflow, and dbt.",
    full: "Data Engineering is the backbone of every data-driven company. This course teaches you to build robust data pipelines at scale. You will learn Apache Spark for batch and streaming processing, Apache Airflow for workflow orchestration, dbt for data transformation, Delta Lake for ACID transactions on data lakes, Kafka for real-time ingestion, and cloud data warehouses like BigQuery and Snowflake. Build a complete modern data stack for a fictional e-commerce company.",
    outcomes: "Build Spark batch & streaming jobs|Orchestrate pipelines with Airflow|Transform data with dbt|Design data lake architectures|Implement CDC with Debezium",
    instructions: "Python proficiency|SQL knowledge|Basic Linux/CLI",
    sections: [
      { name: "Apache Spark", lectures: [
        { title: "Spark Architecture & RDDs", dur: "24:30", preview: true },
        { title: "DataFrame API & Spark SQL", dur: "28:00", preview: false },
        { title: "Structured Streaming", dur: "26:20", preview: false },
        { title: "Spark Performance Tuning", dur: "30:40", preview: false },
      ]},
      { name: "Airflow Orchestration", lectures: [
        { title: "Airflow Architecture & Setup", dur: "18:40", preview: true },
        { title: "DAGs, Tasks & Operators", dur: "24:00", preview: false },
        { title: "XComs, Sensors & Hooks", dur: "20:30", preview: false },
        { title: "Airflow on Kubernetes", dur: "26:10", preview: false },
      ]},
      { name: "Modern Data Stack", lectures: [
        { title: "dbt for SQL Transformations", dur: "28:20", preview: false },
        { title: "Delta Lake & Lakehouse Architecture", dur: "24:40", preview: false },
        { title: "BigQuery for Data Warehousing", dur: "26:00", preview: false },
      ]},
    ],
  },
  {
    title: "Microservices with Node.js & Docker",
    catIndex: 5, instructorIndex: 0, price: 3299, level: "Advanced", lang: "English",
    tags: ["Microservices","Node.js","Docker","API Gateway","Event-Driven"],
    short: "Design and build production microservices with Node.js, Docker, API Gateway, and event-driven communication.",
    full: "Microservices architecture enables teams to build, deploy, and scale services independently. This course teaches you to decompose a monolith into microservices, implement inter-service communication with REST and message queues, build an API Gateway with Kong, implement service discovery, distributed tracing, saga pattern for distributed transactions, and resilience patterns (circuit breakers, retries, bulkheads). Build a complete e-commerce microservices platform.",
    outcomes: "Design microservice boundaries|Implement async communication|Build API Gateway layer|Apply resilience patterns|Monitor distributed systems",
    instructions: "Node.js & Docker experience|Understanding of REST APIs|Basic Kubernetes helpful",
    sections: [
      { name: "Microservices Design", lectures: [
        { title: "Monolith to Microservices", dur: "24:00", preview: true },
        { title: "Domain-Driven Design Basics", dur: "28:30", preview: false },
        { title: "Service Communication Patterns", dur: "22:10", preview: false },
      ]},
      { name: "Implementation", lectures: [
        { title: "Building User Service", dur: "36:20", preview: false },
        { title: "Building Order Service", dur: "38:10", preview: false },
        { title: "Building Product Service", dur: "34:40", preview: false },
        { title: "API Gateway with Kong", dur: "26:00", preview: false },
      ]},
      { name: "Resilience & Observability", lectures: [
        { title: "Circuit Breaker with Opossum", dur: "20:30", preview: false },
        { title: "Saga Pattern for Transactions", dur: "28:00", preview: false },
        { title: "Distributed Tracing with OpenTelemetry", dur: "24:20", preview: false },
      ]},
    ],
  },
  {
    title: "Rust Programming: Systems & WebAssembly",
    catIndex: 12, instructorIndex: 18, price: 2999, level: "Advanced", lang: "English",
    tags: ["Rust","Systems Programming","WebAssembly","WASM","Performance"],
    short: "Learn Rust programming from the ground up and compile to WebAssembly for high-performance web apps.",
    full: "Rust is the most loved programming language for 8 consecutive years. This course teaches Rust from the fundamentals: ownership and borrowing, lifetimes, traits, generics, error handling with Result and Option, concurrency with threads and async/await, building CLI tools, writing FFI bindings, and compiling to WebAssembly for use in web browsers. You will also build a simple OS kernel module and a high-performance web server with Axum.",
    outcomes: "Master Rust ownership & borrowing|Write safe concurrent code|Build CLI & system tools|Compile Rust to WebAssembly|Build web servers with Axum",
    instructions: "Systems programming experience helpful|C/C++ knowledge useful but not required",
    sections: [
      { name: "Rust Fundamentals", lectures: [
        { title: "Ownership & Borrowing Explained", dur: "30:00", preview: true },
        { title: "Structs, Enums & Pattern Matching", dur: "26:20", preview: false },
        { title: "Traits & Generics", dur: "28:40", preview: false },
        { title: "Error Handling: Result & Option", dur: "22:30", preview: false },
      ]},
      { name: "Rust in Practice", lectures: [
        { title: "Building CLI Tools with Clap", dur: "24:10", preview: false },
        { title: "Async/await with Tokio", dur: "30:20", preview: false },
        { title: "Web Server with Axum", dur: "28:00", preview: false },
      ]},
      { name: "WebAssembly with Rust", lectures: [
        { title: "Rust to WASM Compilation", dur: "22:40", preview: false },
        { title: "wasm-bindgen & JavaScript Interop", dur: "26:00", preview: false },
        { title: "WASM Performance Optimization", dur: "20:10", preview: false },
      ]},
    ],
  },
  {
    title: "Java Spring Boot: Enterprise REST APIs",
    catIndex: 12, instructorIndex: 14, price: 2799, level: "Intermediate", lang: "English",
    tags: ["Java","Spring Boot","REST API","JPA","Microservices"],
    short: "Build enterprise-grade REST APIs with Spring Boot, Spring Security, JPA, and Spring Cloud.",
    full: "Spring Boot powers the majority of enterprise Java applications worldwide. This course teaches you to build production-grade APIs: Spring MVC REST controllers, Spring Data JPA with Hibernate, Spring Security with JWT, global exception handling, validation, caching with Spring Cache and Redis, async processing with Spring Events and @Async, Spring Batch for ETL, Spring Cloud Gateway, and deployment on AWS with RDS and ElastiCache. Build a complete banking API system.",
    outcomes: "Build REST APIs with Spring Boot|Implement Spring Security & JWT|Master Spring Data JPA|Use Spring Cloud components|Deploy Java apps to AWS",
    instructions: "Java OOP knowledge required|Maven or Gradle familiarity|Basic SQL",
    sections: [
      { name: "Spring Boot Foundations", lectures: [
        { title: "Spring Boot Auto-Configuration", dur: "20:00", preview: true },
        { title: "REST Controllers & Request Mapping", dur: "24:30", preview: false },
        { title: "Dependency Injection & Bean Scopes", dur: "22:10", preview: false },
        { title: "Application Properties & Profiles", dur: "16:40", preview: false },
      ]},
      { name: "Data Access Layer", lectures: [
        { title: "Spring Data JPA & Repositories", dur: "26:00", preview: false },
        { title: "JPQL & Native Queries", dur: "22:30", preview: false },
        { title: "Database Migrations with Flyway", dur: "18:20", preview: false },
        { title: "QueryDSL for Dynamic Queries", dur: "24:40", preview: false },
      ]},
      { name: "Security & Production", lectures: [
        { title: "Spring Security Architecture", dur: "26:00", preview: false },
        { title: "JWT Auth Filter Chain", dur: "28:30", preview: false },
        { title: "Method-Level Security", dur: "20:00", preview: false },
        { title: "Production Monitoring with Actuator", dur: "18:30", preview: false },
      ]},
    ],
  },
];

// ─── Review templates ─────────────────────────────────────────
const reviewTemplates = [
  { rating: 5, texts: [
    "Absolutely phenomenal course! The instructor explains complex concepts with such clarity that I was able to build my first production app within a week of completing it.",
    "This course completely transformed my career. I went from a junior developer to landing a senior role. Worth every rupee!",
    "Best course I've ever taken on this platform. The projects are real-world and the instructor answers questions promptly. Highly recommended!",
    "Outstanding content quality. The instructor's depth of knowledge is impressive and the pacing is perfect. I learned more here than in 6 months of self-study.",
    "This is hands-down the best structured course available. Clear explanations, practical examples, and the code quality is production-ready.",
    "Exceeded all my expectations. The project-based approach makes learning stick. I've already applied these skills in my job.",
  ]},
  { rating: 4, texts: [
    "Really solid course with great content. The hands-on labs are excellent. Knocked off one star because a few videos could use updating, but still highly recommend.",
    "Very well-structured curriculum. The instructor is knowledgeable and engaging. Minor issue: some code demos could be cleaner. Overall great value.",
    "Loved the depth of content and real-world examples. A few sections felt rushed but the majority of the course is excellent. Would definitely recommend.",
    "Great course for intermediate learners. The projects are challenging enough to push you. Documentation could be better but the video quality is top-notch.",
    "Good pacing, clear explanations, and interesting projects. One or two topics needed more depth but the fundamentals are covered very well.",
  ]},
  { rating: 3, texts: [
    "Decent course overall. Some topics are explained well but others feel too surface-level. The projects are useful but I wished there was more code review.",
    "Average course. The fundamentals are fine but advanced sections feel rushed. Expected more hands-on projects for the price.",
    "Okay course for beginners. The instructor knows the subject but the production quality varies. Some sections are excellent while others need improvement.",
  ]},
];

// ============================================================
// MAIN SEED FUNCTION
// ============================================================

async function seed() {
  console.log("\n🌱  StudyNotion Seed Script Starting...\n");
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("✅  Connected to MongoDB\n");

  // ── Wipe collections ────────────────────────────────────
  console.log("🗑️   Clearing existing data...");
  await Promise.all([
    Profile.deleteMany({}),
    User.deleteMany({}),
    Category.deleteMany({}),
    Course.deleteMany({}),
    Section.deleteMany({}),
    SubSection.deleteMany({}),
    RatingAndReview.deleteMany({}),
    CourseProgress.deleteMany({}),
  ]);
  console.log("✅  Collections cleared\n");

  // ─── HASH PASSWORD ───────────────────────────────────────
  const defaultPassword = await bcrypt.hash("StudyNotion@2025", 10);

  // ─── CREATE PROFILES & USERS (Admins) ───────────────────
  console.log("👤  Seeding Admins...");
  const adminUsers = [];
  for (const a of adminPool) {
    const profile = await Profile.create({
      gender: "Male",
      dateOfBirth: "1985-01-15",
      about: a.bio,
      contactNumber: 9000000000 + Math.floor(Math.random() * 999999),
    });
    const user = await User.create({
      firstName: a.firstName,
      lastName: a.lastName,
      email: `${slug(a.firstName + " " + a.lastName)}@studynotion.dev`,
      password: defaultPassword,
      accountType: "Admin",
      additionalDetails: profile._id,
      courses: [],
      image: avatar(`${a.firstName} ${a.lastName}`),
      courseProgress: [],
    });
    adminUsers.push(user);
  }
  console.log(`   ✅  ${adminUsers.length} Admins created`);

  // ─── CREATE PROFILES & USERS (Instructors) ──────────────
  console.log("👨‍🏫  Seeding Instructors...");
  const instructorUsers = [];
  for (const inst of instructorPool) {
    const profile = await Profile.create({
      gender: pick(["Male", "Female", "Prefer not to say"]),
      dateOfBirth: randomDate(new Date("1980-01-01"), new Date("1995-01-01"))
        .toISOString().split("T")[0],
      about: inst.bio,
      contactNumber: 9100000000 + Math.floor(Math.random() * 899999999),
    });
    const user = await User.create({
      firstName: inst.firstName,
      lastName: inst.lastName,
      email: `${slug(inst.firstName + "." + inst.lastName)}@studynotion.dev`,
      password: defaultPassword,
      accountType: "Instructor",
      additionalDetails: profile._id,
      courses: [],
      image: avatar(`${inst.firstName} ${inst.lastName}`),
      courseProgress: [],
    });
    instructorUsers.push(user);
  }
  console.log(`   ✅  ${instructorUsers.length} Instructors created`);

  // ─── CREATE PROFILES & USERS (Students) ─────────────────
  console.log("🎓  Seeding Students...");
  const studentUsers = [];
  for (const s of studentPool) {
    const profile = await Profile.create({
      gender: s.gender,
      dateOfBirth: s.dob,
      about: `Passionate learner and aspiring developer. Currently upskilling in tech through online courses.`,
      contactNumber: 9200000000 + Math.floor(Math.random() * 799999999),
    });
    const user = await User.create({
      firstName: s.firstName,
      lastName: s.lastName,
      email: `${slug(s.firstName + "." + s.lastName)}@student.studynotion.dev`,
      password: defaultPassword,
      accountType: "Student",
      additionalDetails: profile._id,
      courses: [],
      image: avatar(`${s.firstName} ${s.lastName}`),
      courseProgress: [],
    });
    studentUsers.push(user);
  }
  console.log(`   ✅  ${studentUsers.length} Students created`);

  // ─── CREATE CATEGORIES ────────────────────────────────────
  console.log("🏷️   Seeding Categories...");
  const categoryDocs = await Category.insertMany(
    categoryDefs.map((c) => ({ name: c.name, description: c.description, courses: [] }))
  );
  console.log(`   ✅  ${categoryDocs.length} Categories created`);

  // ─── CREATE COURSES + SECTIONS + SUBSECTIONS ─────────────
  console.log("📚  Seeding Courses, Sections & SubSections...");
  const courseDocs = [];

  for (let ci = 0; ci < courseDefs.length; ci++) {
    const def = courseDefs[ci];
    const instructor = instructorUsers[def.instructorIndex];
    const category   = categoryDocs[def.catIndex];
    const courseSlug = slug(def.title);

    // Build Sections + SubSections
    const sectionIds = [];
    for (const sec of def.sections) {
      const secSlug = slug(sec.name);
      const subSectionIds = [];

      for (const lec of sec.lectures) {
        const lecSlug = slug(lec.title);
        // Storage-provider-independent videoPublicId
        const videoPublicId = `${courseSlug}/${secSlug}/${lecSlug}`;

        const subSec = await SubSection.create({
          title: lec.title,
          timeDuration: lec.dur,
          description: `In this lecture, we cover: ${lec.title}. This lesson is designed to give you a clear understanding of the concepts with practical demonstrations and hands-on exercises.`,
          videoUrl: videoPublicId,  // stored as videoPublicId path - CDN agnostic
        });
        subSectionIds.push(subSec._id);
      }

      const section = await Section.create({
        sectionName: sec.name,
        subSection: subSectionIds,
      });
      sectionIds.push(section._id);
    }

    // Enroll 5-20 random students per course for realism
    const enrollCount = range(5, 20);
    const shuffledStudents = [...studentUsers].sort(() => Math.random() - 0.5);
    const enrolledStudents = shuffledStudents.slice(0, enrollCount).map((s) => s._id);

    const course = await Course.create({
      courseName: def.title,
      courseDescription: def.short,
      instructor: instructor._id,
      whatYouWillLearn: def.outcomes,
      courseContent: sectionIds,
      ratingAndReviews: [],
      price: def.price,
      thumbnail: thumbnail(def.title, ci),
      tag: def.tags,
      category: category._id,
      studentsEnrolled: enrolledStudents,
      instructions: def.instructions.split("|"),
      status: "Published",
    });
    courseDocs.push(course);

    // Update Category with this course
    await Category.findByIdAndUpdate(category._id, {
      $push: { courses: course._id },
    });

    // Update instructor's courses array
    await User.findByIdAndUpdate(instructor._id, {
      $push: { courses: course._id },
    });

    // Update enrolled students' courses array
    for (const sid of enrolledStudents) {
      await User.findByIdAndUpdate(sid, {
        $push: { courses: course._id },
      });
    }

    process.stdout.write(`   📖  [${ci + 1}/${courseDefs.length}] ${def.title}\n`);
  }
  console.log(`\n   ✅  ${courseDocs.length} Courses created with full section/lecture structure`);

  // ─── RATINGS & REVIEWS (100 reviews) ─────────────────────
  console.log("\n⭐  Seeding Ratings & Reviews...");
  const reviewDocs = [];
  const usedReviewPairs = new Set(); // studentId-courseId to avoid duplicates

  let reviewCount = 0;
  while (reviewCount < 100) {
    const student = pick(studentUsers);
    const course  = pick(courseDocs);
    const pairKey = `${student._id}-${course._id}`;
    if (usedReviewPairs.has(pairKey)) continue;
    usedReviewPairs.add(pairKey);

    const ratingBucket = pick(reviewTemplates);
    const reviewText   = pick(ratingBucket.texts);

    const review = await RatingAndReview.create({
      user:   student._id,
      rating: ratingBucket.rating,
      review: reviewText,
      course: course._id,
    });
    reviewDocs.push(review);

    // Attach to course
    await Course.findByIdAndUpdate(course._id, {
      $push: { ratingAndReviews: review._id },
    });

    reviewCount++;
  }
  console.log(`   ✅  ${reviewDocs.length} Reviews created`);

  // ─── COURSE PROGRESS ──────────────────────────────────────
  console.log("\n📈  Seeding Course Progress...");
  const progressDocs = [];

  for (const student of studentUsers) {
    // Reload student to get updated courses array
    const freshStudent = await User.findById(student._id);
    const enrolledCourseIds = freshStudent.courses;

    for (const courseId of enrolledCourseIds) {
      // Fetch all subsections for this course
      const course = await Course.findById(courseId).populate({
        path: "courseContent",
        populate: { path: "subSection" },
      });
      if (!course) continue;

      const allSubSections = course.courseContent.flatMap(
        (sec) => sec.subSection.map((ss) => ss._id)
      );
      if (allSubSections.length === 0) continue;

      // Student has completed 0 to 100% of the lectures
      const progressPercent = range(0, 100);
      const completedCount  = Math.floor((progressPercent / 100) * allSubSections.length);
      const shuffled = [...allSubSections].sort(() => Math.random() - 0.5);
      const completedVideos = shuffled.slice(0, completedCount);

      const cp = await CourseProgress.create({
        courseID: courseId,
        userId:   student._id,
        completedVideos,
      });
      progressDocs.push(cp);

      // Link progress to user
      await User.findByIdAndUpdate(student._id, {
        $push: { courseProgress: cp._id },
      });
    }
  }
  console.log(`   ✅  ${progressDocs.length} Course Progress records created`);

  // ─── FINAL SUMMARY ────────────────────────────────────────
  console.log("\n" + "═".repeat(55));
  console.log("🎉  StudyNotion Seed Complete!");
  console.log("═".repeat(55));
  console.log(`  👤  Admins:          ${adminUsers.length}`);
  console.log(`  👨‍🏫  Instructors:     ${instructorUsers.length}`);
  console.log(`  🎓  Students:        ${studentUsers.length}`);
  console.log(`  🏷️   Categories:      ${categoryDocs.length}`);
  console.log(`  📚  Courses:         ${courseDocs.length}`);
  console.log(`  ⭐  Reviews:         ${reviewDocs.length}`);
  console.log(`  📈  Progress Recs:   ${progressDocs.length}`);
  console.log("═".repeat(55) + "\n");

  await mongoose.disconnect();
  console.log("✅  Disconnected from MongoDB. Seed complete!\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
