const express = require("express");
const router = express.Router();

const { registerDoctor, loginDoctor , resetPassword} = require("../controllers/doctorController");
const {isLoggedIn}  = require("../middleware/authMiddleware");
const doctorController = require("../controllers/doctorAppointmentController");

// Doctor Register
router.post("/register", registerDoctor);

// Doctor Login
router.post("/login", loginDoctor);
// Reset Password
router.post("/reset-password", resetPassword);


// Get all appointments for a doctor
router.get("/:hospitalId/:doctorId/appointments", doctorController.getDoctorAppointmentsById);

// Get appointments for a doctor by date
router.get("/:hospitalId/:doctorId/appointments/by-date", doctorController.getDoctorAppointmentsByDate);

// Get appointment history (completed + cancelled)
router.get("/:hospitalId/:doctorId/history",  doctorController.getDoctorAppointmentHistory);

//Get appointment + patient details for view details tab
router.get("/appointments/:appointmentId/details", doctorController.getAppointmentWithPatientDetails);

router.put("/appointment/:hospitalId/:appointmentId/prescription",doctorController.markPrescriptionGiven);



// Example: Protected route (Doctor profile)
router.get("/profile", isLoggedIn, (req, res) => {
  res.json({
    message: "Doctor profile fetched successfully",
    doctor: req.user // 🩺 comes from isLoggedIn middleware
  });
});

module.exports = router;
