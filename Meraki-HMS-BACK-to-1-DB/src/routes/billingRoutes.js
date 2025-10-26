const express = require("express");
const router = express.Router();
const {
  createBill,
  getAllBills,
  getBillById,
  getBillingInfoByAppointment,
} = require("../controllers/billingController");

router.post("/createbill", createBill);
// 🧾 New API: Fetch billing info by appointment ID
router.get("/appointment/:appointmentId", getBillingInfoByAppointment);
router.get("/", getAllBills);
router.get("/:id", getBillById);

module.exports = router;