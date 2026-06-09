require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

// Routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const aiRoadmapRoutes = require("./routes/AIRoadmap");
const DB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");

// middleware
app.use(express.json());
// cookies configuration
app.use(cookieParser());

app.use(cors());

// file upload middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// DB connection
DB();

//cloudinary connectino
cloudinaryConnect();

//routes ko mounte kran
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/ai", aiRoadmapRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// default routes
app.get("/", (req, res) => {
  res.send("Hello Student! This is Study Notion");
});
