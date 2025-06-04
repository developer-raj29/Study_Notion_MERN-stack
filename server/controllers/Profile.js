const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const { convertSecondsToDuration } = require("../utils/secToDuration");
require("dotenv").config();
const CourseProgress = require("../models/CourseProgess");

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    // get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    // get userId
    const id = req.user.id;

    // validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // find Profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;

    const profileDetails = await Profile.findById(profileId);

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();

    // return res
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully 👍",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating profile",
      error: error.message,
    });
  }
};

// Explore:-> How can we schedule delete operations
// DELETE PROFILE ACCOUNT

exports.deleteAccount = async (req, res) => {
  try {
    // get id
    const id = req.user.id;

    const userDetails = await User.findById(id);

    // validation
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User Details Not Found",
      });
    }

    // delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    // TODOL HW unenrolled user from all enrolled courses

    // delete user
    await User.findByIdAndDelete({ _id: id });

    // return success message
    return res.status(200).json({
      success: true,
      message: "Profile Account deleted🗑️ successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting profile account",
      error: error.message,
    });
  }
};

// GET ALL USER DETAILS
exports.getAllUserDetails = async (req, res) => {
  try {
    // get user id
    const id = req.user.id;

    // validation and get user details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "User Details Fetched Successfully ��‍��",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching user details",
      error: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    let userDetails = await User.findOne({ _id: userId })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    userDetails = userDetails.toObject();

    for (let i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      let subsectionLength = 0;

      const course = userDetails.courses[i];

      for (let j = 0; j < course.courseContent.length; j++) {
        const subSections = course.courseContent[j].subSection;

        totalDurationInSeconds += subSections.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration || "0", 10),
          0
        );

        subsectionLength += subSections.length;
      }

      course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);

      const courseProgress = await CourseProgress.findOne({
        courseID: course._id,
        userId: userId,
      });

      const completedCount = courseProgress?.completedVideos.length || 0;

      course.progressPercentage =
        subsectionLength === 0
          ? 100
          : Math.round((completedCount / subsectionLength) * 10000) / 100; // 2 decimal places
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      //create an new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
      return courseDataWithStats;
    });

    res.status(200).json({ courses: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
