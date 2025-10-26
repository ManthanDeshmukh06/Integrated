const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    // 🔗 Linked entities
    hospital_id: {
      type: String,
      ref: "Hospital",
      required: true,
    },
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    bill_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Billing",
      required: true,
    },

    // 💰 Transaction Details
    amount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "Online", "Insurance"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },

    // 🧾 Razorpay / Online Payment Integration (optional)
    razorpayOrderId: {
      type: String,
      default: "",
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },
    razorpaySignature: {
      type: String,
      default: "",
    },

    // 📝 Extra info
    remark: {
      type: String,
      default: "Transaction Initiated",
    },
    referenceNo: {
      type: String,
      unique: true,
      default: function () {
        return `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);