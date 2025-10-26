const Doctor = require("../models/Doctor");
const bcrypt = require("bcrypt");
const Otp = require("../models/Otp");
const Hospital = require("../models/Hospital");
const generateToken = require("../utils/generateToken");
const { sendDoctorCredentialsEmail } = require("../utils/email"); 

// ✅ Register Doctor
exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, contact, password, hospital_id, specialization, workingHours, slotSize, breaks } = req.body;

    // 1. Check if hospital exists
    const hospital = await Hospital.findOne({ hospital_id });
    if (!hospital) {
      return res.status(400).json({ message: "Invalid hospital_id, hospital not found" });
    }

    // 2. ✅ Check if doctor with same email/contact exists in the same hospital
    const existingDoctor = await Doctor.findOne({
      hospital_id,
      $or: [{ email }],
    });

    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor with this email/contact already exists in this hospital" });
    }

    // 3. Create doctor
    const doctor = new Doctor({
      name,
      email,
      contact,
      password: password,
      hospital_id,
      specialization,
      workingHours,
      slotSize,
      breaks,
    });

    await doctor.save();

    // ✅ Send credentials email (without changing logic)
    await sendDoctorCredentialsEmail(
      email,
      name,
      email,
      password,
      hospital.name,
      hospital_id,
      specialization
    );

    res.status(201).json({
      message: "Doctor registered successfully",
      token: generateToken(doctor._id, "doctor"),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login Doctor
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password  , hospital_id} = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const hospital = await Hospital.findOne({ hospital_id });
    if (!hospital) {
      return res.status(400).json({ message: "Invalid hospital_id, hospital not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      doctorid : doctor._id,
      token: generateToken(doctor._id, "doctor"),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { mobile, otp, newPassword, hospital_id } = req.body;

    // 🔍 Validate input
    if (!mobile || !otp || !newPassword || !hospital_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Validate hospital
    const hospital = await Hospital.findOne({ hospital_id });
    if (!hospital) {
      return res.status(400).json({ message: "Invalid hospital_id, hospital not found" });
    }

    // ✅ Validate OTP
    const otpRecord = await Otp.findOne({ mobile });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ Find doctor by mobile
    const doctor = await Doctor.findOne({ contact: mobile });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // ✅ Assign new password (pre-save hook handles hashing)
    doctor.password = newPassword;
    await doctor.save();

    // ✅ Clear OTP after successful reset
    await Otp.deleteOne({ mobile });

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Doctor password reset error:", error);
    res.status(500).json({ message: "Server error" });
  }
};