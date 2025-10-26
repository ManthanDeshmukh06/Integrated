const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// 🧾 Create payment order
router.post("/create-order/:billId", paymentController.createPaymentOrder);

// 💳 Verify Razorpay payment
router.post("/verify/:txn_id", paymentController.verifyPayment);

// 🧾 Get all transactions by patient
router.get("/patient/:patient_id", paymentController.getPatientTransactions);

module.exports = router;