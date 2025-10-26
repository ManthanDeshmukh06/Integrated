const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// ✅ Emergency Contact Subschema
const EmergencyContactSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  relationship: { type: String },
  phone: { type: String },
  email: { type: String },
  city: { type: String },
  address: { type: String }
});

// ✅ Patient Schema
const PatientSchema = new mongoose.Schema({
  // 🔹 Existing fields (unchanged)
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: String,
  contact: String,
  address: String,
  admitted_on: { type: Date, default: Date.now },
  discharged_on: { type: Date },
  bed_id: { type: String, ref: "Bed" },
  is_discharged: { type: Boolean, default: false },

  // 🔹 New: Personal & Demographics
  first_name: { type: String },
  last_name: { type: String },
  profileImage: { type: String },
  blood_group: { type: String },
  marital_status: { type: String, enum: ["Single", "Married", "Divorced", "Widowed"], default: "Single" },
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  location: { 
    city: { type: String },
    address_line: { type: String }
  },

  // 🔹 Medical History
  allergies: [{ type: String }],
  current_medications: [{ type: String }],
  past_medications: [{ type: String }],
  chronic_diseases: [{ type: String }],
  injuries: [{ type: String }],
  surgeries: [{ type: String }],

  // 🔹 Lifestyle & Habits
  smoking_habits: { type: String, enum: ["Yes", "No", "Occasionally"], default: "No" },
  alcohol_consumption: { type: String, enum: ["Yes", "No", "Occasionally"], default: "No" },
  activity_level: { type: String, enum: ["Zero" ,"Low", "Moderate", "High"], default: "Moderate" },
  food_preference: { type: String, enum: ["Vegetarian", "Non-Vegetarian", "Vegan", "Other"], default: "Other" },
  occupation: { type: String },

  // 🔹 Emergency Contact
  emergency_contact: EmergencyContactSchema
});

// Hash password before saving
PatientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password during login
PatientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Patient", PatientSchema);
