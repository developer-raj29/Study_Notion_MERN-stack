const Tag = require("../Models/Tags");

// create a Tag ka handler

exports.createTag = async (req, res) => {
  try {
    //  fetch data from server
    const { name, description } = req.body;

    // validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // create entry in DB and return
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });

    console.log(tagDetails);

    // retrun response
    return res.status(200).json({
      success: true,
      message: "Tag created successfully",
      tagDetails: tagDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating tag",
      error: error.message,
    });
  }
};

// get all tags ka handler
exports.showAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });

    return res.status(200).json({
      success: true,
      message: "All tags fetched successfully",
      allTags: allTags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching tags",
      error: error.message,
    });
  }
};
