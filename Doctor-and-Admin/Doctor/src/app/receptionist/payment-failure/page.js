"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function PaymentFailurePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center px-6">
      <h1 className="text-4xl font-bold text-red-700 mb-4">
        ❌ Payment Failed
      </h1>
      <p className="text-gray-700 text-lg mb-6">
        Something went wrong with your payment. Please try again.
      </p>

      <button
        onClick={() => router.push("/billing")}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
      >
        Back to Billing
      </button>
    </div>
  );
}
