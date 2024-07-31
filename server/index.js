const express = require("express");
const app = express();

// Routes
const userRoutes = require("./Routes/User");
const profileRoutes = require("./Routes/Profile");
const paymentRoutes = require("./Routes/Payments");
const courseRoutes = require("./Routes/Course");
const DB = require("./Config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./Config/cloudinary");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 8000;

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// default routes
app.get("/", (req, res) => {
  res.send("Hello Student! This is Study Notion");
});
