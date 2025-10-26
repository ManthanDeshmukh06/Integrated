"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const billId = searchParams.get("bill");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center px-6">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        ✅ Payment Successful!
      </h1>
      <p className="text-gray-700 text-lg mb-6">
        Your payment for Bill ID <b>{billId}</b> was completed successfully.
      </p>

      <button
        onClick={() => router.push("/appointments")}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
      >
        Go Back
      </button>
    </div>
  );
}
