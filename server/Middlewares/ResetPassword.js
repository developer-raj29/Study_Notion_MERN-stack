const User = require("../Models/User");
const mailSender = require("../Utils/MailSender");
const bcrypt = require("bcrypt");

// reset password token
exports.resetPasswordToken = async (req, res, next) => {
  try {
    // get email from req body
    const email = req.body.email;

    // check user for this email address, email validation
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Your email address is not registered with us",
      });
    }

    //   generate token
    const token = crypto.randomUUID();

    // update user by adding token and expiration time
    const updatedDetails = await User.findOne(
      { email: email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );

    //  create url
    const URL = `http://localhost:3000/update-password/${token}`;

    // send mail containing the url
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link : ${URL}`
    );

    // return respone
    return res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email",
      token: token,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while reset your password",
    });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    // get token from req body
    const { password, confrimPassword, token } = req.body;

    // validation
    if (password !== confrimPassword) {
      return res.status(401).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // get userdetails from DB using token
    const userDetails = await User.findOne({ token: token });

    // if no entry - invalid token
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "Token is Invaild",
      });
    }

    // token time checked
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Token is expired, please try again",
      });
    }

    // password hassed
    const hashedPassword = await bcrypt.hash(password, 10);

    // password updated
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    // return respone
    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while reset your password",
      error: error.message,
    });
  }
};
