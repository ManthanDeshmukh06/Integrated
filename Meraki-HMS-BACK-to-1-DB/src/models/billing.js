const mongoose = require("mongoose");

const BillingSchema = new mongoose.Schema(
  {
    // 🔗 Reference IDs for better data linking
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    hospital_id: { type: String, ref: "Hospital", required: true },

    // 🧾 Patient and Doctor Info
    patientName: { type: String, required: true },
    contact: { type: String },
    gender: { type: String },
    age: { type: String },
    doctorName: { type: String },

    // 💉 Services List
    services: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],

    // 💰 Billing Details
    totalAmount: { type: Number, required: true },
    paymentMode: { type: String, enum: ["Online", "Cash"], default: "Cash" },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },

    // 📅 Metadata
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Billing", BillingSchema);