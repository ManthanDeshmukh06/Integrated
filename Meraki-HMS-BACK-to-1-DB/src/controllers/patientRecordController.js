const PatientRecord = require("../models/PatientRecord");

// ✅ Create a new patient record
exports.createPatientRecord = async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      appointment_id,
      hospital_id,
      symptoms,
      diagnosis,
      prescription,
      recommended_tests,
      notes
    } = req.body;

    // ✅ Validate required fields
    if (!patient_id || !doctor_id || !appointment_id || !hospital_id) {
      return res.status(400).json({ 
        message: "Patient, Doctor, Appointment, and Hospital ID are required" 
      });
    }

    const record = new PatientRecord({
      patient_id,
      doctor_id,
      appointment_id,
      hospital_id,
      symptoms,
      diagnosis,
      prescription,
      recommended_tests,
      notes
    });

    await record.save();

    res.status(201).json({
      message: "Patient record created successfully",
      record
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get all records for a patient
exports.getPatientRecords = async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await PatientRecord.find({ patient_id: patientId })
      .populate("doctor_id", "name specialization")
      .populate("patient_id", "name email");

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single record
exports.getSingleRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await PatientRecord.findById(id)
      .populate("doctor_id", "name specialization")
      .populate("patient_id", "name email");

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update patient record
exports.updatePatientRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      symptoms,
      diagnosis,
      prescription,
      recommended_tests,
      notes
    } = req.body;

    const updateData = {
      symptoms,
      diagnosis,
      prescription,
      recommended_tests,
      notes
    };

    const record = await PatientRecord.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({
      message: "Record updated successfully",
      record
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Delete record
exports.deletePatientRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await PatientRecord.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get patient record by appointment ID and patient ID
exports.getRecordByAppointment = async (req, res) => {
  try {
    const { patientId, appointmentId } = req.params;

    if (!patientId || !appointmentId) {
      return res.status(400).json({ message: "Patient ID and Appointment ID are required" });
    }

    const record = await PatientRecord.findOne({
      patient_id: patientId,
      appointment_id: appointmentId
    })
      .populate("doctor_id", "name specialization")
      .populate("patient_id", "name email");

    if (!record) {
      return res.status(404).json({ message: "No record found for this appointment" });
    }

    res.status(200).json({
      message: "Record fetched successfully",
      record
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all records for a specific patient and doctor
exports.getRecordsByPatientAndDoctor = async (req, res) => {
  try {
    const { patientId, doctorId } = req.params;

    if (!patientId || !doctorId) {
      return res.status(400).json({ message: "Patient ID and Doctor ID are required" });
    }

    const records = await PatientRecord.find({
      patient_id: patientId,
      doctor_id: doctorId
    })
      .populate("doctor_id", "name specialization")
      .populate("patient_id", "name email")
      .sort({ createdAt: -1 }); // show recent first

    if (records.length === 0) {
      return res.status(404).json({ message: "No records found for this patient-doctor pair" });
    }

    res.status(200).json({
      message: `Found ${records.length} records for patient ${patientId} with doctor ${doctorId}`,
      records
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};