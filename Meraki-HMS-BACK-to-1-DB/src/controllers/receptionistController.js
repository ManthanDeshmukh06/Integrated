const Receptionist = require("../models/Receptionist");
const generateToken = require("../utils/generateToken");
const Hospital = require("../models/Hospital");
const Otp = require("../models/Otp");
const Doctor = require("../models/Doctor");
const { sendReceptionistCredentialsEmail } = require("../utils/email");

// 📌 Register Receptionist
exports.registerReceptionist = async (req, res) => {
  try {
    const { name, email, mobile, password, hospital_id } = req.body;

    // Check existing receptionist in same hospital (optional enhancement)
    const existing = await Receptionist.findOne({ hospital_id, email });
    if (existing) {
      return res.status(400).json({ message: "Receptionist already exists in this hospital" });
    }

    // Validate hospital
    const hospital = await Hospital.findOne({ hospital_id });
    if (!hospital) {
      return res.status(400).json({ message: "Invalid hospital_id, hospital not found" });
    }

    // Create receptionist
    const receptionist = await Receptionist.create({
      name,
      email,
      mobile,
      password,
      hospital_id
    });

    // ✅ Send credentials email (without changing main logic)
    await sendReceptionistCredentialsEmail(
      email,
      name,
      email,
      password,
      hospital.name,
      hospital_id,
      mobile
    );

    res.status(201).json({
      message: "Receptionist registered successfully",
      receptionist: {
        id: receptionist._id,
        name: receptionist.name,
        email: receptionist.email,
        mobile: receptionist.mobile,
        hospital_id: receptionist.hospital_id
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering receptionist", error: error.message });
  }
};


// 📌 Login Receptionist
exports.loginReceptionist = async (req, res) => {
  try {
    const { email, password , hospital_id } = req.body;

    const receptionist = await Receptionist.findOne({ email });
    if (!receptionist) return res.status(400).json({ message: "Receptionist not found" });

    const hospital = await Hospital.findOne({ hospital_id });
    if (!hospital) {
      return res.status(400).json({ message: "Invalid hospital_id, hospital not found" });
    }

    const isMatch = await receptionist.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    const token = generateToken(receptionist._id, "receptionist");

    res.status(200).json({
        message: "Logged in successfully",
        token : token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// 🔁 Reset Receptionist Password
exports.resetPassword = async (req, res) => {
  try {
    const { mobile, otp, newPassword } = req.body;

    // 1️⃣ Validate input
    if (!mobile || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check OTP validity
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

    // 3️⃣ Find Receptionist by mobile number
    const receptionist = await Receptionist.findOne({ mobile });
    if (!receptionist) {
      return res.status(404).json({ message: "Receptionist not found" });
    }

    // 4️⃣ Update password (schema will hash automatically)
    receptionist.password = newPassword;
    await receptionist.save();

    // 5️⃣ Delete used OTP
    await Otp.deleteOne({ mobile });

    // 6️⃣ Response
    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// 📌 Get all doctors by hospital ID
exports.getDoctorsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    if (!hospitalId) {
      return res.status(400).json({ message: "hospitalId is required" });
    }

    const doctors = await Doctor.find({ hospital_id: hospitalId })
      .select("doctor_id name email specialization contact isAvailable");

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found for this hospital" });
    }

    res.status(200).json({
      success: true,
      hospitalId,
      total: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};