const User = require("../Models/User");
const OTP = require("../Models/OTP");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const JWT = require("jsonwebtoken");
const mailSender = require("../Utils/MailSender");
const { passwordUpdate } = require("../mail/templates/passwordUpdate");
const Profile = require("../Models/Profile");

require("dotenv").config();

// Send OTP For Email Verification
// exports.sendOTP = async (req, res) => {
//   try {
//     // fetch email from req body
//     const { email } = req.body.email;

//     //   check if email is already exist
//     const checkUserPresent = await User.findOne({ email });

//     //   if user already exists, then return a response
//     if (checkUserPresent) {
//       return res.status(400).json({
//         success: false,
//         message: "User already registered",
//       });
//     }

//     //   generate otp
//     var otp = otpGenerator.generate(6, {
//       upperCaseAlphabet: false,
//       lowerCaseAlphabet: false,
//       specialChars: false,
//     });

//     console.log("OTP generated : ", otp);

//     // check unique otp or not
//     const result = await User.findOne({ otp: otp });

//     while (result) {
//       otp = otpGenerator.generate(6, {
//         upperCaseAlphabet: false,
//         lowerCaseAlphabet: false,
//         specialChars: false,
//       });
//       result = await User.findOne({ otp: otp });
//     }

//     // save otp in database
//     const otpPayload = { email, otp };

//     // create an entry for otp
//     const otpBody = await OTP.create(otpPayload);
//     console.log(otpBody);

//     res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//       otp: otp,
//     });
//   } catch (error) {
//     console.error("Error occured while sending mails: ", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

exports.sendOTP = async (req, res) => {
  try {
    // ✅ Extract email correctly
    const { email } = req.body;

    // ✅ Check if user is already registered
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    // ✅ Generate a 6-digit numeric OTP
    let otp = otpGenerator.generate(6, {
      digits: true, // ✅ Only numbers
      upperCaseAlphabets: false, // ❌ No uppercase letters
      lowerCaseAlphabets: false, // ❌ No lowercase letters
      specialChars: false, // ❌ No special characters
    });

    console.log("Generated OTP:", otp); // Should be a 6-digit number

    // ✅ Ensure OTP is unique
    let isUniqueOTP = await OTP.findOne({ otp });
    while (isUniqueOTP) {
      otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      isUniqueOTP = await OTP.findOne({ otp });
    }

    console.log("isUniqueOTP: ", isUniqueOTP);

    // ✅ Add expiry time (e.g., 5 minutes)
    const otpPayload = {
      email,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // OTP valid for 5 mins
    };

    // ✅ Save OTP in the database
    await OTP.create(otpPayload);

    // ✅ Send Response (REMOVE `otp` from response in production)
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp, // ⚠️ Remove this in production for security reasons!
    });
  } catch (error) {
    console.error("Error while sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Signup Controller for Registration

exports.signup = async (req, res) => {
  try {
    // data fetch from req ki body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate kro
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !contactNumber ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Please Fill All fields are required",
      });
    }

    // 2 pass confrim pass same hai ki nhi
    if (password !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message:
          "Password and ConfirmPassword Value does not match, Please try again",
      });
    }

    // check user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "User is already registered",
      });
    }

    // find most recent otp stored for the user
    const recentOTP = await OTP.findOne({ email })
      .sort({ createAt: -1 })
      .limit(1);

    console.log("Recent OTP : ", recentOTP);

    // validate otp
    if (recentOTP.length == 0) {
      // OTP Not Found
      return res.status(400).json({
        success: false,
        message: "OTP is not found",
      });
    } else if (otp !== recentOTP.otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // entry create in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // entry create in DB
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    });

    // return res
    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error in Sign up: ", error);
    res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again",
      error: error.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    // get data from req body
    const { email, password } = req.body;
    // valdation data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Please Fill All fields are required, Please try again",
      });
    }

    // user check exist or not
    const user = await User.findOne({ email }).populate("additionalDetail");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, Please Sigup First",
      });
    }

    // generate JWT, after password matching
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      const token = JWT.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        message: "Logged In Successful",
        token: token,
        user,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.error("Login Password : ", error);
    res.status(500).json({
      success: false,
      message: "Login Failure, Please try agin",
      error: error.message,
    });
  }
};

// change password
exports.changePassword = async (req, res) => {
  // get data from req body
  const { oldpassword, newpassword, confirmPassword } = req.body;

  // get old password, new password , confrim new password
  //  validation
  if (!oldpassword || !newpassword || !confirmPassword) {
    return res.status(403).json({
      success: false,
      message: "Please Fill All fields are required, Please try again",
    });
  }

  // update password in DB
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { password: req.user.password },
    { new: true }
  );

  user.save();

  // send mail - password updated

  // return res
};
