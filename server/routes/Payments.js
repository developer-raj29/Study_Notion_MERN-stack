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
