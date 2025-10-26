const mongoose = require("mongoose");

const PatientUploadSchema = new mongoose.Schema({
  patient_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Patient", 
    required: true 
  },
  hospital_id: { 
    type: String,  
    required: true 
  },
  diagnosis: { type: String, required: true },
  doctor_name: { type: String },
  date: { type: Date, default: Date.now },

  files: [
    {
      file_url: { type: String, required: true },
      file_type: { type: String, enum: ["image", "pdf"], required: true },
      public_id: { type: String, required: true }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PatientUpload", PatientUploadSchema);
