const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");

const { isLoggedIn } = require("../middleware/authMiddleware");

// Receptionist registers patient
router.post("/register-patient", isLoggedIn,appointmentsController.registerPatient);

// Get all patients registered by receptionist
router.get("/registerd-patients/:hospitalId", appointmentsController.getAllRegisteredPatients);

// DELETE patient by phone or email
router.delete("/registerd-patients/delete", appointmentsController.deletePatient);


// Receptionist sets doctor availability
router.post("/availability", isLoggedIn, appointmentsController.setDoctorAvailability);

// Fetch available slots for doctor by date
router.get("/availability/:doctorId/:date", isLoggedIn,appointmentsController.getAvailableSlots);

// Book an appointment (with new fields)
router.post("/book", isLoggedIn, appointmentsController.bookAppointment);

// Get all appointments by hospital
router.get("/hospital/:hospitalId", isLoggedIn,appointmentsController.getAppointmentsByHospital);

// Get doctor appointments by date
router.get("/doctor/:doctorId/:date", appointmentsController.getDoctorAppointmentsByDate);

// 🆕 New route to fetch departments by hospital custom id
router.get("/departments/:hospitalId", appointmentsController.getDepartmentsByHospital);
//Get doctors by department & hospitalId
router.get("/doctors", appointmentsController.getDoctorsByDepartment);
//Cancel Appointment
router.put("/:appointmentId/cancel", isLoggedIn, appointmentsController.cancelAppointment);
//Reschedule Appointment    
router.put("/:appointmentId/reschedule", isLoggedIn, appointmentsController.rescheduleAppointment);
// Get doctor availability (raw, as receptionist input)
router.get("/availability/raw/:doctorId/:date",isLoggedIn, appointmentsController.getDoctorAvailability);


// Receptionist: view appointments with prescriptions
router.get("/hospital/:hospitalId/prescription-true",isLoggedIn, appointmentsController.getAppointmentsByHospitalWithPrescription);
router.get("/hospital/:hospitalId/date/:date/prescription-true",isLoggedIn, appointmentsController.getAppointmentsByHospitalAndDateWithPrescription);
router.get("/hospital/:hospitalId/doctor/:doctorId/prescription-true",isLoggedIn, appointmentsController.getAppointmentsByHospitalAndDoctorWithPrescription);
router.get("/hospital/:hospitalId/doctor/:doctorId/date/:date/prescription-true",isLoggedIn, appointmentsController.getAppointmentsByHospitalDoctorAndDateWithPrescription);



// Protect with isLoggedIn (receptionist)
router.post("/availability/remove", appointmentsController.removeDoctorAvailabilitySlots);


module.exports = router;
