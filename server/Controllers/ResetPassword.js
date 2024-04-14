const User = require("../Models/User");
const MailSender = require("../Utils/MailSender");
const bcrypt = require("bcrypt");

// reset Password
exports.ResetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const email = req.body.email;

    // check uesr for this email , email address
    const user = await Uses.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Your Email is not resgisterd with us",
      });
    }

    // generate token
    const token = crypto.randomUUID();

    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );

    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    // send email containing the url
    await MailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );

    // return Response
    return res.status(200).json({
      success: true,
      message: "Successfully Password reset link has been sent to your email",
      token: token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while reset your password",
    });
  }
};

// reset Password
exports.ResetPassword = async (req, res) => {
  try {
    // data fetched
    const { password, confrimPassword, token } = req.body;

    // validation
    if (password !== confrimPassword) {
      return res.status(401).json({
        success: false,
        message: "Passwords not matching",
      });
    }
    // get uesr details form DB using token
    const userDetails = await User.findOne({ token: token });

    // if no entry found - invaild token
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "Token is Invaild",
      });
    }

    // token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired, please regenerate your token",
      });
    }

    // hash pwd
    const hashedPassword = await bcrypt.hash(password, 10);

    //   password update
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    // return Response
    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reset your password",
      error: error.message,
    });
  }
};
