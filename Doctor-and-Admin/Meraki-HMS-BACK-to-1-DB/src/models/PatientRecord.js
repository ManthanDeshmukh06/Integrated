const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  medicine_name: { type: String, required: true },
  dosage: { type: String, required: true },     // e.g., "500mg"
  frequency: { type: String, required: true },  // e.g., "Twice a day"
  duration: { type: String, required: true }    // e.g., "5 days"
});

const PatientRecordSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
  hospital_id: { type: String, ref: "Hospital", required: true },

  visit_date: { type: Date, default: Date.now },
  symptoms: [{ type: String }],
  diagnosis: { type: String },

  prescription: [PrescriptionSchema],

  // ✅ New field for recommended tests
  recommended_tests: [{ type: String }], // e.g., ["Blood Test", "MRI", "X-Ray"]

  notes: { type: String },

  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PatientRecord", PatientRecordSchema);
