const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/MailSender");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();

const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");

const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");

const CourseProgress = require("../models/CourseProgess");

// capture the payment and initiate the Razory order
exports.capturePayment = async (req, res) => {
  try {
    // get payment details
    const { course_Id } = req.body;
    const userId = req.user.id;

    // validation
    // validate course_Id

    console.log("course_Id: ", course_Id);

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

    // const options = {
    //   amount: amount * 100,
    //   currency: currency,
    //   // notes: notes,
    //   receipt: Math.random(Date.now().toString()),
    //   notes: {
    //     courseId: course_Id,
    //     userId,
    //   },
    // };

    const options = {
      amount: amount * 100, // amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`, // ✅ FIXED
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
      return res.status(200).json({
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

exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.course_Id;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    //enroll karwao student ko
    await enrollStudents(courses, userId, res);
    //return res
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }
  return res.status(200).json({ success: "false", message: "Payment Failed" });
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide data for Courses or UserId",
    });
  }

  for (const courseId of courses) {
    try {
      //find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, message: "Course not Found" });
      }

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      //find the student and add the course to their list of enrolledCOurses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      ///bachhe ko mail send kardo
      const emailResponse = await mailSender(
        enrollStudents.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName}`
        )
      );
      console.log("Email Sent Successfully", emailResponse);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the fields" });
  }

  try {
    //student ko dhundo
    const enrolledStudent = await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      `Payment Recieved`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not send email" });
  }
};
