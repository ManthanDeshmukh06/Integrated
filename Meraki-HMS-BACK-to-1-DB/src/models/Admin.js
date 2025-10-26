// src/models/Admin.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 150 },
  email: { type: String, required: true, unique: true, maxlength: 150 },
  mobile: { type: String, unique: true , maxlength: 15 },
  password: { type: String, required: true },
  hospital_id: { type: String, required: true, index: true }, // e.g., HOSP01
  role: { type: String, enum: ["admin"], default: "admin" },

  // Optional fine-grained permissions (example)
  permissions: {
    manageDoctors: { type: Boolean, default: false },
    manageReceptionists: { type: Boolean, default: false },
    manageAppointments: { type: Boolean, default: false },
    manageBilling: { type: Boolean, default: false },
  },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Update updatedAt on save
AdminSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Method to compare password
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
