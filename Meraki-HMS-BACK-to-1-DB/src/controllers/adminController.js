// src/controllers/adminController.js
const Admin = require("../models/Admin");
const Hospital = require("../models/Hospital");
const generateToken = require("../utils/generateToken"); // uses your existing util
const jwt = require("jsonwebtoken");
const { sendAdminCredentialsEmail } = require("../utils/email");
const Otp = require("../models/Otp");

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, mobile, password, hospital_id, role, isSuperAdmin } = req.body;

    if (!name || !email || !password || !hospital_id) {
      return res.status(400).json({ message: "name, email, password and hospital_id are required" });
    }

    const hospital = await Hospital.findOne({ hospital_id });
    if (!hospital) {
      return res.status(400).json({ message: "Invalid hospital_id, hospital not found" });
    }

    const existing = await Admin.findOne({
      $or: [{ email }, { mobile }],
    });
    if (existing) {
      return res.status(400).json({ message: "Admin with this email or mobile already exists" });
    }

    const admin = new Admin({
      name,
      email,
      mobile,
      password,
      hospital_id,
      role: role || "admin",
      isSuperAdmin: !!isSuperAdmin,
      permissions: req.body.permissions || {},
    });

    await admin.save();

    // ✅ Send credentials email
    await sendAdminCredentialsEmail(
      email,
      name,
      email,
      password,
      hospital.name,
      hospital_id
    );

    const token = generateToken(admin._id, "admin");

    res.status(201).json({
      message: "Admin registered successfully. Credentials have been emailed.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        hospital_id: admin.hospital_id,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    console.error("registerAdmin error:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.loginAdmin = async (req, res) => {
  try {
    const { emailOrMobile, password, hospital_id } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({ message: "emailOrMobile and password required" });
    }

    const query = emailOrMobile.includes("@") ? { email: emailOrMobile } : { mobile: emailOrMobile };
    const admin = await Admin.findOne(query);

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // If hospital_id provided, verify it matches (same pattern used elsewhere). :contentReference[oaicite:5]{index=5}
    if (hospital_id && admin.hospital_id !== hospital_id && !admin.isSuperAdmin) {
      return res.status(400).json({ message: "Admin does not belong to provided hospital" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // update lastLogin
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id, "admin");

    res.status(200).json({ message: "Logged in successfully",id: admin._id, token });
  } catch (error) {
    console.error("loginAdmin error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔁 Reset Admin Password (fixed)
exports.resetAdminPassword = async (req, res) => {
  try {
    const { mobile, otp, newPassword } = req.body;

    if (!mobile || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

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

    const admin = await Admin.findOne({ mobile });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // ✅ Force hash by marking password as modified
    admin.password = newPassword;
    admin.markModified("password"); // 👈 important line
    await admin.save();

    await Otp.deleteOne({ mobile });

    return res.status(200).json({
      success: true,
      message: "Admin password reset successful",
    });
  } catch (error) {
    console.error("Reset Admin Password Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
