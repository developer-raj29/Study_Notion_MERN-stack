const Course = require("../Models/Course");
const Tag = require("../Models/Category");
const User = require("../Models/User");
const { uploadImageToCloudinary } = require("../Utils/ImageUploader");

// get all courses
exports.createCourse = async (req, res) => {
  try {
    // create courses
    // fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    //   get thumbnail
    const thumbnail = req.files.thumbnailImage;

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(403).json({
        success: false,
        message: "Please Fill All fields are required, Please try again",
      });
    }

    // check for Instructor
    const userId = req.user._id;

    const instructorDetails = await User.findById(userId);

    console.log("Instructor Details: ", instructorDetails);

    // TODO: check verify that userID and InstructorDetails ._id are same or different ?

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    // check given tag is vaild or not
    const tagDetails = await Tag.findById(tag);

    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag Not Found",
      });
    }

    // upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create entry for new Course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnailImage: thumbnailImage.secure_url,
      instructor: instructorDetails._id,
    });

    // add the new course to the user Schema of Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      {
        new: true,
      }
    );

    // update the TAG ka schema

    return res.status(200).json({
      success: true,
      message: "Course Created Successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating course",
      error: error.message,
    });
  }
};

// get all courses hanlder functions

exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "All Courses Data Fetched Successfully",
      courses: allCourses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching all courses data",
      error: error.message,
    });
  }
};
