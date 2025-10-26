import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BillingSummary from "./BillingSummary";
import PdfGenerator from "./PdfGenerator";

export default function FinalBillPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { patient, services, totalAmount } = location.state || {};

  if (!patient || !services) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl text-red-600 font-semibold">
          ⚠️ No billing data found. Please generate a bill first.
        </h2>
        <button
          onClick={() => navigate("/billing")}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Back to Billing
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-8 w-[900px] mx-auto mt-8 border border-blue-200">
      <h1 className="text-2xl font-bold text-blue-700 text-center mb-4">
        🧾 Final Bill Summary
      </h1>

      <BillingSummary patient={patient} services={services} total={totalAmount} />

      <div className="flex justify-center mt-6">
        <PdfGenerator patient={patient} services={services} total={totalAmount} />
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/billing")}
          className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
        >
          ⬅ Back to Billing Page
        </button>
      </div>
    </div>
  );
}
