"use client";
import { useSearchParams } from "next/navigation";
import BillingPage from "@/components/Billing/BillingPage";

export default function BillingPageRoute() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  return (
   <div className="min-h-screen bg-gray-100 p-6 text-gray-900"> {/* ✅ Global black text */}
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Billing
      </h1>

      {appointmentId ? (
        <BillingPage appointmentId={appointmentId} />
      ) : (
        <p className="text-gray-600 text-center">No appointment selected.</p>
      )}
    </div>
  );
}
