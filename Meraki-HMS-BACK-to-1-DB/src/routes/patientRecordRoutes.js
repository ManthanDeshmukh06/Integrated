const express = require("express");
const router = express.Router();
const {
  createPatientRecord,
  getPatientRecords,
  getSingleRecord,
  updatePatientRecord,
  deletePatientRecord,
  getRecordByAppointment,
  getRecordsByPatientAndDoctor   
} = require("../controllers/patientRecordController");

const {isLoggedIn} = require("../middleware/authMiddleware");

// ✅ Create a new patient record
router.post("/", isLoggedIn , createPatientRecord);

// ✅ Get all records for a patient
router.get("/patient/:patientId", isLoggedIn, getPatientRecords);

// ✅ Get single record by record ID
router.get("/:id", isLoggedIn , getSingleRecord);

// ✅ Update a record
router.put("/:id", isLoggedIn , updatePatientRecord);

// Example: GET /api/patient-records/:patientId/appointment/:appointmentId
router.get("/:patientId/appointment/:appointmentId", isLoggedIn , getRecordByAppointment);

// ✅ Delete a record
router.delete("/:id", isLoggedIn , deletePatientRecord);

// ✅ Get all records for a specific patient with a specific doctor
// Example: GET /api/patient-records/patient/:patientId/doctor/:doctorId
router.get("/patient/:patientId/doctor/:doctorId", isLoggedIn, getRecordsByPatientAndDoctor);

module.exports = router;
