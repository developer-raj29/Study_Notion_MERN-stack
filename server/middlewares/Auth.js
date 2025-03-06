const JWT = require("jsonwebtoken");
require("dotenv").env;

const User = require("../models/User");

// auth
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ");

    //   if token is missing, then return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // verify the token
    try {
      const decoded = JWT.verify(token, process.env.JWT_SECRET);

      console.log(decoded);

      //   const user = await User.findById(decoded.id);
      req.user = decoded;
    } catch (err) {
      // varification issue message
      res.status(401).json({
        success: false,
        message: "Invalid Token",
        error: err.message,
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while verifying the token",
      error: err.message,
    });
  }
};

// IsStudent
exports.IsStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for students only",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Used role cannot be verified, please try again",
      error: err.message,
    });
  }
};

// is Instructor
exports.IsInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for instructors only",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Used role cannot be verified, please try again",
      error: err.message,
    });
  }
};

//Admin
exports.Admin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Used role cannot be verified, please try again",
      error: err.message,
    });
  }
};
