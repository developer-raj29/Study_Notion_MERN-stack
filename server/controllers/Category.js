// const Tag = require("../models/Category");

// // create a Tag ka handler

// exports.createTag = async (req, res) => {
//   try {
//     //  fetch data from server
//     const { name, description } = req.body;

//     // validation
//     if (!name || !description) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // create entry in DB and return
//     const tagDetails = await Tag.create({
//       name: name,
//       description: description,
//     });

//     console.log(tagDetails);

//     // retrun response
//     return res.status(200).json({
//       success: true,
//       message: "Tag created successfully",
//       tagDetails: tagDetails,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error while creating tag",
//       error: error.message,
//     });
//   }
// };

// // get all tags ka handler
// exports.showAllTags = async (req, res) => {
//   try {
//     const allTags = await Tag.find({}, { name: true, description: true });

//     return res.status(200).json({
//       success: true,
//       message: "All tags fetched successfully",
//       allTags: allTags,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error while fetching tags",
//       error: error.message,
//     });
//   }
// };

const mongoose = require("mongoose");
const Category = require("../models/Category");
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// create a Tag ka handler
exports.createCategory = async (req, res) => {
  try {
    //  fetch data from server
    const { name, description } = req.body;

    // validation
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // create entry in DB and return
    const CategorysDetails = await Category.create({
      name: name,
      description: description,
    });

    console.log(CategorysDetails);

    // retrun response
    return res.status(200).json({
      success: true,
      message: "Categorys Created Successfully",
      CategorysDetails: CategorysDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "Internal server error while creating tag",
      error: error.message,
    });
  }
};

// get all categories ka handler
exports.showAllCategories = async (req, res) => {
  try {
    // console.log("INSIDE SHOW ALL CATEGORIES");
    const allCategory = await Category.find(
      {},
      { name: true, description: true }
    );

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      allCategory: allCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching categories",
      error: error.message,
    });
  }
};

//categoryPageDetails
exports.categoryPageDetails = async (req, res) => {
  try {
    // get category Id
    const { categoryId } = req.body;

    console.log("PRINTING CATEGORY ID: ", categoryId);

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    console.log("SELECTED COURSE", selectedCategory);

    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.");

      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.");

      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();
    //console.log("Different COURSE", differentCategory)

    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();

    const allCourses = allCategories.flatMap((category) => category.courses);

    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);
    // console.log("mostSellingCourses COURSE", mostSellingCourses)

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
    s;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
