const RatingAndReview = require("../Models/RatingAndReviews");
const User = require("../Models/User");
const Course = require("../Models/Course");
const { default: mongoose } = require("mongoose");

// create Rating
exports.createRating = async (req, res) => {
  try {
    // get userId and
    const userId = req.user.id;

    // fetch data from request body and
    const { rating, review, courseId } = req.body;

    // check if user enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course",
      });
    }

    // check if user is already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      course: courseId,
      user: userId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "User has already reviewed this course",
      });
    }

    // create a rating and review
    const newRatingAndReview = await RatingAndReview.create({
      user: userId,
      course: courseId,
      rating: rating,
      review: review,
    });

    // update course with this rating and review
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: { ratingsAndReviews: newRatingAndReview._id },
      },
      { new: true }
    );

    console.log(updatedCourseDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "Rating and Review created successfully",
      ratingAndReview: newRatingAndReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Rating cannot be created. Please try again",
      error: error.message,
    });
  }
};

// get Average Rating
exports.getAverageRating = async (req, res) => {
  try {
    // get id
    const courseId = req.body.courseId;

    // calculate average rating
    const result = await RatingAndReview.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    // return response
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Average rating fetched successfully",
        averageRating: result[0].averageRating,
      });
    }

    // if no rating / Reviwew exist
    return res.status(200).json({
      success: true,
      message: "No rating / Review found for this course",
      averageRating: 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Average rating cannot be fetched. Please try again",
      error: error.message,
    });
  }
};

// get all Rating
exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "All Rating fetched successfully",
      data: allReviews,
    });
  } catch {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "All Rating cannot be fetched. Please try again",
      error: error.message,
    });
  }
};
