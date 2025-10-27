const Patient = require("../models/Patient");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const ReceptionistPatient = require("../models/receptionist_patient"); // new import



// Multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Generate JWT token
const generateToken = require("../utils/generateToken");

// @desc    Register a new patient
// @route   POST /api/patients/register
// @access  Public
// @desc    Register a new patient
// @route   POST /api/patients/register
// @access  Public
exports.registerPatient = async (req, res) => {
  try {
    const { name, email, mobile, password, hospital_id, dob, gender, contact, address } = req.body;

    // Check if patient exists (by email or mobile)
    const existing = await Patient.findOne({ $or: [{ email }, { mobile }] });
    if (existing) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    const patient = new Patient({
      name,
      email,
      mobile,
      password,
      hospital_id,
      dob,
      gender,
      contact,
      address
    });

    await patient.save();

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      token: generateToken(patient._id),
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        mobile: patient.mobile,
        hospital_id: patient.hospital_id,
        dob: patient.dob
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Login patient
// @route   POST /api/patients/login
// @access  Public
exports.loginPatient = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    const patient = await Patient.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }]
    });

    if (!patient) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await patient.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Logged in successfully",
      patientid : patient._id,
      token: generateToken(patient._id , "patient")
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient profile
// @route   GET /api/patients/profile
// @access  Private
exports.getPatientProfile = async (req, res) => {
  const patient = await Patient.findById(req.patient.id);
  if (patient) {
    res.json({
      _id: patient._id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      hospitals: patient.hospitals,
    });
  } else {
    res.status(404).json({ message: "Patient not found" });
  }
};


exports.resetPassword = async (req, res) => {
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

    const patient = await Patient.findOne({ mobile });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // ✅ Assign plain password and let schema handle hashing
    patient.password = newPassword;
    await patient.save();

    await Otp.deleteOne({ mobile }); // clear OTP after reset

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update patient profile (Profile completion)
// @route   PUT /api/patients/profile/:id
// @access  Private
exports.updatePatientProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Destructure body for clarity (so we can easily debug missing fields)
    const {
      first_name,
      last_name,
      gender,
      dob,
      blood_group,
      marital_status,
      height,
      weight,
      contact,
      email,
      location,
      allergies,
      current_medications,
      past_medications,
      chronic_diseases,
      injuries,
      surgeries,
      smoking_habits,
      alcohol_consumption,
      activity_level,
      food_preference,
      occupation,
      emergency_contact,
      address,
    } = req.body;

    // Find the patient
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // ✅ Update fields only if provided (preserve existing data)
    if (first_name) patient.first_name = first_name;
    if (last_name) patient.last_name = last_name;
    if (gender) patient.gender = gender;
    if (dob) patient.dob = dob;
    if (blood_group) patient.blood_group = blood_group;
    if (marital_status) patient.marital_status = marital_status;
    if (height) patient.height = height;
    if (weight) patient.weight = weight;
    if (contact) patient.contact = contact;
    if (email) patient.email = email;
    if (address) patient.address = address;

    if (location) {
      patient.location = {
        city: location.city || patient.location?.city,
        address_line: location.address_line || patient.location?.address_line
      };
    }

    if (allergies) patient.allergies = allergies;
    if (current_medications) patient.current_medications = current_medications;
    if (past_medications) patient.past_medications = past_medications;
    if (chronic_diseases) patient.chronic_diseases = chronic_diseases;
    if (injuries) patient.injuries = injuries;
    if (surgeries) patient.surgeries = surgeries;

    if (smoking_habits) patient.smoking_habits = smoking_habits;
    if (alcohol_consumption) patient.alcohol_consumption = alcohol_consumption;
    if (activity_level) patient.activity_level = activity_level;
    if (food_preference) patient.food_preference = food_preference;
    if (occupation) patient.occupation = occupation;

    if (emergency_contact) {
      patient.emergency_contact = {
        first_name: emergency_contact.first_name || patient.emergency_contact?.first_name,
        last_name: emergency_contact.last_name || patient.emergency_contact?.last_name,
        relationship: emergency_contact.relationship || patient.emergency_contact?.relationship,
        phone: emergency_contact.phone || patient.emergency_contact?.phone,
        email: emergency_contact.email || patient.emergency_contact?.email,
        city: emergency_contact.city || patient.emergency_contact?.city,
        address: emergency_contact.address || patient.emergency_contact?.address
      };
    }

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedProfile: patient
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Upload profile image for patient
exports.uploadProfileImage = [
  upload.single("image"), // key name = image
  async (req, res) => {
    try {
      const { patient_id } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      // Upload to Cloudinary
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "patient_profile_images",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      const result = await uploadPromise;

      // Update patient's profile image in DB
      const patient = await Patient.findByIdAndUpdate(
        patient_id,
        { profileImage: result.secure_url },
        { new: true }
      );

      if (!patient)
        return res.status(404).json({ message: "Patient not found" });

      res.status(200).json({
        message: "Profile image uploaded successfully",
        profile_url: result.secure_url,
        patient,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

exports.getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;

    // 1️⃣ Try to find in 'patients' collection first
    let patient = await Patient.findById(patientId);

    // 2️⃣ If not found, try 'receptionist_patients' collection
    if (!patient) {
      patient = await ReceptionistPatient.findById(patientId);
    }

    // 3️⃣ If still not found, return 404
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found in any collection" });
    }

    // 4️⃣ If found, return success
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error("Error fetching patient details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};