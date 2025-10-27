const express = require("express");
const {
  registerPatient,
  loginPatient,
  getPatientProfile,
  updatePatientProfile,
  uploadProfileImage,
  getPatientById
} = require("../controllers/patinetController.js");
const { isLoggedIn } = require("../middleware/authMiddleware.js");
const { resetPassword } = require("../controllers/patinetController");
const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.get("/profile", isLoggedIn, getPatientProfile);
router.put("/profile/:id", isLoggedIn , updatePatientProfile);
router.post("/profile/upload-profile", uploadProfileImage);
router.post("/reset-password", resetPassword);
// ✅ New Route — get patient details by ID
router.get("/:patientId", isLoggedIn, getPatientById);
module.exports = router;
