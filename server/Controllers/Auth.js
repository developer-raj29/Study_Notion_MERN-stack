const User = require("../Models/User");
const OTP = require("../Models/OTP");

// send otp
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from req body
    const { email } = req.body.email;

    //   check if email is already exist
    const checkUserPresent = await User.findOne({ email });

    //   if user already exists, then return a response
    if (checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    //   generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabet: false,
      lowerCaseAlphabet: false,
      specialChars: false,
    });

    console.log("OTP generated : ", otp);

    // check unique otp or not
    const result = await User.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabet: false,
        lowerCaseAlphabet: false,
        specialChars: false,
      });
      result = await User.findOne({ otp: otp });
    }

    // save otp in database
    const otpPayload = { email, otp };

    // create an entry for otp
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp: otp,
    });
  } catch (error) {
    console.error("Error occured while sending mails: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Signup

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
        message: "User already registered",
      });
    }

    // find most recent otp stored for the user
    // const recentOTP = await OTP.

    // validate otp
  } catch (error) {}
};

// Login

// change password
