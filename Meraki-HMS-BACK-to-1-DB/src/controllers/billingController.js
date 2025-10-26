const Billing = require("../models/billing");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const ReceptionistPatient = require("../models/receptionist_patient");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
//Hospital
function getAge(dob) {
  if (!dob) return "—";
  const diff = Date.now() - new Date(dob).getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}
// 🧾 Create new bill
exports.createBill = async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      appointment_id,
      hospital_id,
      patientName,
      contact,
      gender,
      age,
      doctorName,
      services,
      totalAmount,
      paymentMode,
      paymentStatus,
      date,
    } = req.body;

    // 🧩 Validation check
    if (!patient_id || !doctor_id || !appointment_id || !hospital_id) {
      return res.status(400).json({
        message: "Patient, Doctor, Appointment, and Hospital IDs are required",
      });
    }

    // 🧾 Create bill object
    const bill = new Billing({
      patient_id,
      doctor_id,
      appointment_id,
      hospital_id,
      patientName,
      contact,
      gender,
      age,
      doctorName,
      services,
      totalAmount,
      paymentMode,
      paymentStatus,
      date,
    });

    await bill.save();

    res.status(201).json({
      message: "Bill created successfully",
      bill,
    });
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(400).json({ message: error.message });
  }
};

// 📋 Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Billing.find()
      .populate("patient_id", "name")
      .populate("doctor_id", "name specialization")
      .sort({ date: -1 });

    res.json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Get bill by ID
exports.getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Billing.findById(id)
      .populate("patient_id", "name contact")
      .populate("doctor_id", "name specialization")
      .lean();

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // 🏥 Fetch hospital details using correct field name
    const hospital = await Hospital.findOne({
      hospital_id: bill.hospital_id,
    }).lean();

    const fullBill = {
      ...bill,
      hospital: hospital
        ? {
            name: hospital.name,
            address: hospital.address,
            contact: hospital.contact,
            email: hospital.email,
          }
        : null,
    };

    res.json(fullBill);
  } catch (error) {
    console.error("Error fetching bill by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📅 Get billing info from Appointment
// 📅 Get billing info from Appointment
exports.getBillingInfoByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // ✅ 1. Find billing by appointment ID
    const billing = await Billing.findOne({ appointment_id: appointmentId }).lean();

    if (!billing) {
      return res.status(404).json({ message: "Billing record not found" });
    }

    // ✅ 2. Fetch related appointment (to show slot, status, etc.)
    const appointment = await Appointment.findById(appointmentId).lean();

    // ✅ 3. Fetch doctor & patient (optional, in case you want to confirm info)
    const doctor = await Doctor.findById(billing.doctor_id).lean();
    const patient =
      (await Patient.findById(billing.patient_id).lean()) ||
      (await ReceptionistPatient.findById(billing.patient_id).lean());

    // ✅ 4. Compose response
    const billingInfo = {
      _id: billing._id,
      appointment_id: billing.appointment_id,
      hospital_id: billing.hospital_id,
      patient_id: billing.patient_id,
      doctor_id: billing.doctor_id,
      patientName:
        billing.patientName ||
        (patient ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() : "—"),
      doctorName: billing.doctorName || (doctor ? doctor.name : "—"),
      contact: billing.contact || (patient ? patient.mobile : "—"),
      gender: billing.gender || (patient ? patient.gender : "—"),
      age: billing.age || (patient?.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : "—"),
      services: billing.services || [],
      totalAmount: billing.totalAmount,
      paymentMode: billing.paymentMode,
      paymentStatus: billing.paymentStatus,
      date: billing.date,
      createdAt: billing.createdAt,
      updatedAt: billing.updatedAt,
      // extra from appointment
      appointmentStatus: appointment?.status || "—",
      slot: appointment ? `${appointment.slotStart} - ${appointment.slotEnd}` : "—",
      is_completed: appointment?.is_completed || false,
    };

    res.status(200).json({ success: true, billingInfo });
  } catch (error) {
    console.error("Billing info fetch error:", error);
    res.status(500).json({ message: error.message });
  }
};