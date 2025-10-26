"use client";
import React, { useEffect } from "react";

export default function BillingSummary({
  patient,
  services,
  total,
  hospital,
  billId,
}) {
  // 🧠 Load Razorpay SDK dynamically when the component mounts
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 🗓️ Today's Date
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // 💳 Handle Online Payment
  const handlePayOnline = async () => {
    try {
      console.log("🧾 Bill ID being sent to backend:", billId);

      // 🧩 Ensure Razorpay SDK is loaded
      if (!window.Razorpay) {
        alert(
          "Razorpay SDK not loaded yet. Please wait a moment and try again."
        );
        return;
      }

      // 1️⃣ Create order from backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/payments/create-order/${billId}`,
        { method: "POST" }
      );

      const data = await response.json();
      console.log("📦 Payment Order Response:", data);

      if (!data?.order_id) {
        alert(
          `Failed to create payment order: ${data?.message || "Unknown error"}`
        );
        return;
      }

      // 2️⃣ Configure Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount * 100, // Convert to paisa
        currency: "INR",
        name: hospital?.name || "Hospital Payment",
        description: `Payment for Bill ID: ${billId}`,
        order_id: data.order_id,
        handler: async function (response) {
          try {
            console.log("💳 Razorpay Payment Success:", response);

            // 3️⃣ Verify payment with backend
            const verifyRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE}/payments/verify/${data.txn_id}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              }
            );

            const result = await verifyRes.json();
            console.log("✅ Payment Verification Result:", result);

            // 4️⃣ Redirect to success/failure page
            if (result.url) {
              window.location.href = result.url;
            } else {
              alert("Unable to verify payment. Please contact support.");
            }
          } catch (err) {
            console.error("Verification Error:", err);
            alert("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: patient?.name || "",
          email: hospital?.email || "",
          contact: patient?.contact || "",
        },
        notes: {
          bill_id: billId,
          patient_name: patient?.name,
        },
        theme: {
          color: "#2563eb", // Tailwind blue-600
        },
      };

      // 5️⃣ Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

      // Optional: handle failures
      rzp.on("payment.failed", function (response) {
        console.error("❌ Payment Failed:", response.error);
        alert("Payment Failed. Please try again.");
      });
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Error initializing payment. Please check your connection.");
    }
  };

  // 🧾 Billing UI
  return (
    <div className="mt-6 bg-blue-50 border border-blue-300 rounded-lg p-6 shadow-lg text-black">
      {/* 🏥 Hospital Header */}
      <div className="text-center mb-6 border-b border-blue-300 pb-3">
        <h1 className="text-2xl font-bold text-blue-800 uppercase">
          {hospital?.name || "Hospital Name"}
        </h1>
        <p className="text-gray-800">
          {hospital?.address || "Address not available"} | Contact:{" "}
          {hospital?.contact || "—"} | Email: {hospital?.email || "—"}
        </p>
      </div>

      {/* 🧍‍♂️ Bill Heading */}
      <h2 className="text-xl font-semibold text-blue-700 text-center mb-4 underline">
        Patient Billing Summary
      </h2>

      {/* 👤 Patient Details */}
      <div className="mb-4 grid grid-cols-2 gap-4 text-black">
        <p>
          <b>Patient Name:</b> {patient?.name || "—"}
        </p>
        <p>
          <b>Contact:</b> {patient?.contact || "—"}
        </p>
        <p>
          <b>Gender:</b> {patient?.gender || "—"}
        </p>
        <p>
          <b>Age:</b> {patient?.age || "—"}
        </p>
        <p>
          <b>Doctor Name:</b> {patient?.doctorName || "—"}
        </p>
        <p>
          <b>Date:</b> {today}
        </p>
      </div>

      {/* 💰 Services Table */}
      <table className="w-full border border-blue-300 mb-4 text-black">
        <thead className="bg-blue-200">
          <tr>
            <th className="border p-2 text-left">Service</th>
            <th className="border p-2 text-right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {services?.length > 0 ? (
            services.map((s, i) => (
              <tr key={i}>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2 text-right">{s.price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="border p-2 text-center text-gray-500">
                No services found
              </td>
            </tr>
          )}

          {/* Total Row */}
          <tr className="bg-blue-100 font-semibold">
            <td className="border p-2 text-right">Total Amount:</td>
            <td className="border p-2 text-right text-blue-800">₹{total}</td>
          </tr>
        </tbody>
      </table>

      {/* 💳 Payment Buttons */}
      <div className="mt-5 flex justify-center gap-4">
        <button
          onClick={handlePayOnline}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          Pay Online
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow">
          Pay Cash
        </button>
      </div>
    </div>
  );
}
