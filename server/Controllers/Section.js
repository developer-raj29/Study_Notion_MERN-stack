const Section = require("../Models/Section");
const Course = require("../Models/Course");

// CREATE SECTION
exports.createSection = async (req, res) => {
  try {
    // fetch data from request body
    const { sectionName, courseId } = req.body;

    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // create Section
    const newSection = await Section.create({
      name: sectionName,
    });

    // update course with section objectID
    const UpdatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //  Return response
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      UpdatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create Section, please try again",
      error: error.message,
    });
  }
};

// UPDATE SECTION

exports.updateSection = async (req, res) => {
  try {
    // data input
    const { sectionName, sectionId } = req.body;

    // data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    // return response updated data
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      section,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update Section, please try again",
      error: error.message,
    });
  }
};

// DELETE SECTION

exports.deleteSection = async (req, res) => {
  try {
    //  get Section Id - assuming that we are sending Id in params
    const { sectionId } = req.params;

    // data delete section
    await Section.findByIdAndDelete(sectionId);

    // TODO {testing}: Do we need to delete the entry from the course Schema?

    // return response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete Section, please try again",
      error: error.message,
    });
  }
};
