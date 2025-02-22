// // Import the required modules
// const express = require("express")
// const router = express.Router()

// const { capturePayment, verifySignature } = require("../controllers/Payments")
// const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
// router.post("/capturePayment", auth, isStudent, capturePayment)
// router.post("/verifySignature", verifySignature)

// module.exports = router

// Import the required modules
const express = require("express");
const router = express.Router();

const {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
} = require("../controllers/Payments");
const {
  auth,
  isInstructor,
  IsStudent,
  isAdmin,
} = require("../middlewares/Auth");
router.post("/capturePayment", auth, IsStudent, capturePayment);
router.post("/verifyPayment", auth, IsStudent, verifyPayment);
router.post( "/sendPaymentSuccessEmail", auth, IsStudent, sendPaymentSuccessEmail );

module.exports = router;
