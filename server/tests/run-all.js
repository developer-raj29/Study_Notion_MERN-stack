const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const dbConnect = require("../config/database");

const { testRateLimit } = require("./rateLimit.test");
const { testDatabase } = require("./database.test");
const { testAIService } = require("./aiService.test");

async function runAll() {
  console.log("==========================================");
  console.log("       STARTING AI ROADMAP TEST SUITE      ");
  console.log("==========================================");

  try {
    // 1. Run Rate Limit test (independent of database)
    testRateLimit();
    console.log("------------------------------------------");

    // 2. Connect to Database for Mongo/Redis dependent tests
    console.log("Connecting to Database...");
    dbConnect();
    
    // Await mongoose connection open state
    await new Promise((resolve, reject) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
      } else {
        mongoose.connection.once("open", resolve);
        mongoose.connection.once("error", reject);
      }
    });
    
    // 3. Run Database & Repository CRUD tests
    await testDatabase();
    console.log("------------------------------------------");

    // 4. Run AI Service tests (calls Gemini)
    await testAIService();
    console.log("------------------------------------------");

    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
  } catch (error) {
    console.error("❌ TEST RUN FAILED:", error);
    process.exitCode = 1;
  } finally {
    console.log("Closing database connections...");
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    console.log("Database connections closed cleanly.");
    console.log("==========================================");
    process.exit(process.exitCode || 0);
  }
}

runAll();
