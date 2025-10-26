const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Hospital = require("../models/Hospital");
const Patient = require("../models/Patient");
const ReceptionistPatient = require("../models/receptionist_patient");

//1️⃣ Get all appointments for a doctor
exports.getDoctorAppointmentsById = async (req, res) => {
  try {
    const { hospitalId, doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    if (doctor.hospital_id !== hospitalId)
      return res
        .status(400)
        .json({ message: "Doctor does not belong to this hospital" });

    const appointments = await Appointment.find({
      doctorId,
      hospitalId,
      status: { $ne: "Cancelled" },
      is_prescription: { $ne: true },
    }).sort({ date: 1, slotStart: 1 });

    res.json({
      doctorId,
      hospitalId,
      total: appointments.length,
      appointments,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// exports.getDoctorAppointmentsById = async (req, res) => {
//   try {
//     const { hospitalId, doctorId } = req.params;

//     // Find the doctor
//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });
//     if (doctor.hospital_id !== hospitalId)
//       return res.status(400).json({ message: "Doctor does not belong to this hospital" });

//     // Find appointments and populate patient details
//     const appointments = await Appointment.find({ doctorId, hospitalId })
//       .sort({ date: 1, slotStart: 1 })
//       .populate({
//         path: "patientId", // field in Appointment schema
//         select: "name email phone gender age", // pick only needed fields
//       });

//     // Map appointments to directly include patient details at top level
//     const mappedAppointments = appointments.map((app) => ({
//       _id: app._id,
//       hospitalId: app.hospitalId,
//       doctorId: app.doctorId,
//       patientId: app.patientId?._id || app.patientId,
//       patientName: app.patientId?.name || app.patientName || "Unknown",
//       patientEmail: app.patientId?.email || app.patientEmail || "N/A",
//       patientPhone: app.patientId?.phone || app.patientPhone || "N/A",
//       patientGender: app.patientId?.gender || app.patientGender || "N/A",
//       patientAge: app.patientId?.age || app.patientAge || null,
//       date: app.date,
//       slotStart: app.slotStart,
//       slotEnd: app.slotEnd,
//       status: app.status,
//       department: app.department,
//       appointmentType: app.appointmentType,
//       sessionType: app.sessionType,
//       reason: app.reason,
//       slotDuration: app.slotDuration,
//       createdAt: app.createdAt,
//       __v: app.__v,
//       is_prescription: app.is_prescription,
//     }));

//     res.json({
//       doctorId,
//       hospitalId,
//       total: mappedAppointments.length,
//       appointments: mappedAppointments,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// 2️⃣ Get appointments for a doctor by doctorId + date
exports.getDoctorAppointmentsByDate = async (req, res) => {
  try {
    const { hospitalId, doctorId } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ message: "Date is required" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    if (doctor.hospital_id !== hospitalId)
      return res
        .status(400)
        .json({ message: "Doctor does not belong to this hospital" });

    const appointments = await Appointment.find({
      doctorId,
      hospitalId,
      date,
    }).sort({ slotStart: 1 });
    res.json({
      doctorId,
      hospitalId,
      date,
      total: appointments.length,
      appointments,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/doctors/:hospitalId/:doctorId/history?date=YYYY-MM-DD
 * Returns completed + cancelled appointments grouped by day/week/month
 */
exports.getDoctorAppointmentHistory = async (req, res) => {
  try {
    const { hospitalId, doctorId: doctorParam } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "date is required (YYYY-MM-DD)" });
    }

    // 🟡 Handle doctorId: ObjectId vs doctor_id (numeric)
    let doctor = null;
    if (/^[0-9a-fA-F]{24}$/.test(doctorParam)) {
      doctor = await Doctor.findById(doctorParam);
    } else {
      doctor = await Doctor.findOne({ doctor_id: Number(doctorParam) });
    }

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    if (doctor.hospital_id !== hospitalId) {
      return res
        .status(400)
        .json({ message: "Doctor does not belong to this hospital" });
    }

    const targetDate = new Date(date);

    // Helper to format date to YYYY-MM-DD
    const toYMD = (d) => d.toISOString().split("T")[0];

    // DAY range
    const dayStart = date;
    const dayEnd = date;

    // WEEK range (Mon → Given Date)
    const dayOfWeek = targetDate.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(targetDate);
    monday.setDate(targetDate.getDate() - diffToMonday);
    const weekStart = toYMD(monday);
    const weekEnd = toYMD(targetDate); // ✅ this is the fix

    // MONTH range
    const firstDay = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      2
    );
    const monthStart = toYMD(firstDay);
    const monthEnd = toYMD(targetDate); // ✅ end = given date, not month end

    const doctorObjectId = doctor._id;

    // 🟢 Single query to fetch all relevant history, then filter in-memory
    const allAppointments = await Appointment.find({
      doctorId: doctorObjectId,
      hospitalId,
      date: { $gte: monthStart, $lte: monthEnd }, // cover entire month
      status: { $in: ["Completed", "Cancelled"] },
    }).sort({ date: 1, slotStart: 1 });

    // Group into day/week/month
    const dayAppointments = allAppointments.filter(
      (ap) => ap.date >= dayStart && ap.date <= dayEnd
    );
    const weekAppointments = allAppointments.filter(
      (ap) => ap.date >= weekStart && ap.date <= weekEnd
    );
    const monthAppointments = allAppointments; // already limited

    res.json({
      doctorId: doctorObjectId,
      hospitalId,
      date,
      history: {
        day: {
          startDate: dayStart,
          endDate: dayEnd,
          count: dayAppointments.length,
          appointments: dayAppointments,
        },
        week: {
          startDate: weekStart,
          endDate: weekEnd,
          count: weekAppointments.length,
          appointments: weekAppointments,
        },
        month: {
          startDate: monthStart,
          endDate: monthEnd,
          count: monthAppointments.length,
          appointments: monthAppointments,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET /api/doctors/appointments/:appointmentId/details
exports.getAppointmentWithPatientDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // 1️⃣ Find appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 2️⃣ Helper to calculate age
    const calculateAge = (dob) => {
      if (!dob) return null;
      const diffMs = Date.now() - new Date(dob).getTime();
      const ageDt = new Date(diffMs);
      return Math.abs(ageDt.getUTCFullYear() - 1970);
    };

    let normalizedPatient = null;

    // 3️⃣ Try finding in Patient collection first
    let patient = await Patient.findById(appointment.patientId).select(
      "-password"
    );

    if (patient) {
      normalizedPatient = {
        patientId: patient._id,
        patientName: patient.name || null,
        email: patient.email || null,
        dob: patient.dob || null,
        age: calculateAge(patient.dob),
        contact: patient.mobile || patient.contact || null,
        hospitalId: appointment.hospitalId || null,
        type: "Patient",
      };
    } else {
      // 4️⃣ If not found in Patient, try in ReceptionistPatient
      const rPatient = await ReceptionistPatient.findById(
        appointment.patientId
      );
      if (rPatient) {
        normalizedPatient = {
          patientId: rPatient._id,
          patientName: `${rPatient.firstName || ""} ${
            rPatient.lastName || ""
          }`.trim(),
          email: rPatient.email || null,
          dob: rPatient.dob || null,
          age: calculateAge(rPatient.dob),
          contact: rPatient.phone || null,
          hospitalId: rPatient.hospitalId || appointment.hospitalId || null,
          type: "ReceptionistPatient",
        };
      }
    }

    if (!normalizedPatient) {
      return res.status(404).json({
        message: "Patient details not found for this appointment",
      });
    }

    // ✅ Return combined data
    return res.json({
      appointment,
      patient: normalizedPatient,
    });
  } catch (err) {
    console.error("Error fetching appointment details:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Doctor marks prescription as given
// ✅ Mark an appointment as prescription given (with hospitalId check)
exports.markPrescriptionGiven = async (req, res) => {
  try {
    const { appointmentId, hospitalId } = req.params;

    // 1️⃣ Validate hospital exists
    const hospital = await Hospital.findOne({ hospital_id: hospitalId });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // 2️⃣ Find appointment with hospitalId check
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      hospitalId: hospitalId,
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ message: "Appointment not found for this hospital" });
    }

    // 3️⃣ Mark prescription as given
    appointment.is_prescription = true;
    await appointment.save();

    res.json({
      message: "Prescription marked as given successfully",
      appointment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
