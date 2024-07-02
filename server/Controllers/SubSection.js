const SubSection = require("../Models/SubSection");
const Section = require("../Models/Section");
const { uploadImageToCloudinary } = require("../Utils/ImageUploader");

// CREATE SUBSECTION
exports.createSubSection = async (req, res) => {
  try {
    // fetch data from req.body
    const { title, timeduration, description, sectionId } = req.body;

    // extract file / video
    const video = req.files.videoFile;

    // data validate
    if (!sectionId || !timeduration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // upload video to cloudinay
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // create a new SubSection
    const subSectionDetails = await SubSection.create({
      title: title,
      timeduration: timeduration, //`${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // push section with this subsection objectID
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subsections: subSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    // HW :  Log Updated Section Here, after adding populate query

    // Return Response
    res.status(200).json({
      success: true,
      message: "Subsection Created Successfully",
      data: updatedSection,
    });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error, when create subsection",
      error: error.message,
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    // data fetch from req body

    const { title, description, subSectionId, sectionId } = req.body;

    // find Subsection Id
    const subSection = await SubSection.findByIdAndUpdate(subSectionId);

    // validate
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    // update section

    // return response
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error, when update subsection",
      error: error.message,
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error, when delete subsection",
      error: error.message,
    });
  }
};
