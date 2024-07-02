const Profile = require("../Models/Profile");
const User = require("../Models/User");

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
