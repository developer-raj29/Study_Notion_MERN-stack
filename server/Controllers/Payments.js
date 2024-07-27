const { instance } = require("../Config/razorpay");
const Course = require("../Models/Course");
const User = require("../Models/User");
const mailSender = require("../Utils/MailSender");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");

const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");

// capture the payment and initiate the Razory order
exports.capturePayment = async (req, res) => {
  try {
    // get payment details
    const { course_Id } = req.body;
    const userId = req.user.id;

    // validation
    // validate course_Id

    if (!course_Id) {
      return res.json({
        success: false,
        message: "Please provide a valid course Id",
      });
    }
    // valid courseDetails
    let course;
    try {
      course = await Course.findById(course_Id);
      if (!course) {
        return res.json({
          success: false,
          message: "Course not find the course",
        });
      }

      // user already pay for the same course
      const uid = new mongoose.Types.ObjectId(userId);

      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "User has already enrolled in this course",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    // order create
    const amount = course.price;
    const currency = "INR";
    // const notes = `Course Enrollment: ${course.title}`;

    const options = {
      amount: amount * 100,
      currency: currency,
      // notes: notes,
      receipt: Math.random(Date.now().toString()),
      notes: {
        courseId: course_Id,
        userId,
      },
    };

    try {
      // initiate the payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log("Payment response: ", paymentResponse);

      //   return response
      return res.statu(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (error) {
      console.error("Error occurred while creating order: ", error);
      return res.json({
        success: true,
        message: "Could not initiate order",
        error: error.message,
      });
    }

    // return response
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while capturing payment" });
  }
};

// Verify Signature of Razorpay payment and Server
exports.verifySignature = async (req, res) => {
  const webhookSecret = "12345678";
  const signature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment Authorized");

    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      // fullfill the action

      // find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        console.error("Course not found: ", error);
        return res.status(500).json({
          success: false,
          message: "Course not found",
          error: error.message,
        });
      }

      console.log(enrolledCourse);

      //   find the student added the course to their last enrolled courses me
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { course: courseId } },
        { new: true }
      );

      console.log(enrolledStudent);

      // mail send krdo confirmation wala
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulations, From CodHelp",
        "Congratulations, your Course Enrollment Confirmation Successfully Completed"
      );

      console.log(emailResponse);

      return res.status(200).json({
        success: true,
        message:
          "Payment Successful, Signature Verification Successfully Completed",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating course and user data",
        error: error.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid Signature",
      error: "Invalid Signature",
    });
  }
};
