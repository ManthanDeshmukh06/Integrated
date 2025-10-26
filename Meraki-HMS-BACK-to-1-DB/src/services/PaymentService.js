const Razorpay = require("razorpay");
const crypto = require("crypto");
const Transaction = require("../models/Transaction");
const Billing = require("../models/billing");
const Hospital = require("../models/Hospital");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const ApiError = require("../utils/ApiError");
const Appointment = require("../models/Appointment");
// ✅ Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

class PaymentService {
  // 🧾 1️⃣ Create Razorpay order for a hospital bill
  static async createPaymentOrder(billId) {
    try {
      const bill = await Billing.findById(billId);
      if (!bill) throw new ApiError(404, "Bill not found");

      const hospital = await Hospital.findOne({
        hospitalCode: bill.hospital_id,
      });

      const patient = await Patient.findById(bill.patient_id);
      const doctor = await Doctor.findById(bill.doctor_id);

      // 🔹 Create transaction record
      const transaction = await Transaction.create({
        hospital_id: bill.hospital_id,
        patient_id: bill.patient_id,
        doctor_id: bill.doctor_id,
        bill_id: bill._id,
        amount: bill.totalAmount,
        paymentMode: "Online",
        paymentStatus: "Pending",
        remark: `Payment for Bill #${bill._id}`,
      });

      // 🔹 Create Razorpay Order
      const order = await razorpay.orders.create({
        amount: bill.totalAmount * 100, // Convert to paisa
        currency: "INR",
        receipt: transaction._id.toString(),
      });

      return {
        order_id: order.id,
        txn_id: transaction._id,
        amount: bill.totalAmount,
        hospitalName: hospital?.name || "Hospital",
        patientName: patient?.name,
        doctorName: doctor?.name,
      };
    } catch (err) {
      console.error("🔥 Payment order error details:", err); // log everything
      return {
        message: err.message || "Unknown Error",
        stack: err.stack,
      };
    }
  }

  // ✅ 2️⃣ Verify Razorpay payment signature
  static async verifyPayment(body, txn_id) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        body;

      const data = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(data)
        .digest("hex");

      const isValid = expectedSignature === razorpay_signature;

      if (!isValid) {
        console.log("Invalid payment signature!");
        await Transaction.findByIdAndUpdate(txn_id, {
          paymentStatus: "Failed",
          remark: "Signature verification failed",
        });
        return {
          url: `${process.env.FRONTEND_URI}/payment-failed`,
        };
      }

      // ✅ Update transaction
      const txn = await Transaction.findByIdAndUpdate(
        txn_id,
        {
          paymentStatus: "Completed",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          remark: "Payment Successful",
        },
        { new: true }
      );

      // ✅ Update related bill and fetch updated one
      const bill = await Billing.findByIdAndUpdate(
        txn.bill_id,
        {
          paymentStatus: "Paid",
          paymentMode: "Online",
        },
        { new: true }
      );

      // 🩺 ✅ If appointment exists, mark as completed
      if (bill?.appointment_id) {
        await Appointment.findByIdAndUpdate(bill.appointment_id, {
          is_completed: true,
          status: "Completed",
        });
        console.log(
          `✅ Appointment ${bill.appointment_id} marked as completed.`
        );
      }

      return {
        url: `${process.env.FRONTEND_URI}/payment-success?bill=${txn.bill_id}`,
      };
    } catch (err) {
      console.error("Payment verification error:", err);
      throw new ApiError(500, "Payment verification failed");
    }
  }

  // 💳 3️⃣ Get patient transaction history
  static async getTransactionsByPatient(patient_id) {
    try {
      const txns = await Transaction.find({ patient_id })
        .populate("bill_id", "totalAmount paymentStatus date")
        .sort({ createdAt: -1 });
      return txns;
    } catch (err) {
      throw new ApiError(500, "Error fetching transactions");
    }
  }
}

module.exports = PaymentService;