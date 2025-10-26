"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BillingSummary from "@/components/Billing/BillingSummary";
import PdfGenerator from "@/components/Billing/PdfGenerator";

export default function FinalBillPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const billId = searchParams.get("billId");
  const name = searchParams.get("name");
  const total = searchParams.get("total");

  const [bill, setBill] = useState(null);

  useEffect(() => {
    if (billId) fetchBillData();
  }, [billId]);

  const fetchBillData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/billing/${billId}`);
      const data = await res.json();
      setBill(data);
    } catch (err) {
      console.error("Error fetching bill:", err);
    }
  };

  if (!bill) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl text-gray-700 font-semibold">
          Loading bill details...
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-8 w-[900px] mx-auto mt-8 border border-blue-200">
      <h1 className="text-2xl font-bold text-blue-700 text-center mb-4">
        🧾 Final Bill Summary
      </h1>

      <BillingSummary
        billId={billId}
        patient={{
          name: bill.patientName,
          contact: bill.contact,
          gender: bill.gender,
          age: bill.age,
          doctorName: bill.doctorName,
        }}
        services={bill.services}
        total={bill.totalAmount}
        hospital={{
          name: bill.hospital?.name,
          address: bill.hospital?.address,
          contact: bill.hospital?.contact,
          email: bill.hospital?.email,
        }}
      />
      <div className="flex justify-center mt-6">
        <PdfGenerator
          patient={{
            name: bill.patientName,
            contact: bill.contact,
            gender: bill.gender,
            age: bill.age,
            doctorName: bill.doctorName,
          }}
          services={bill.services}
          total={bill.totalAmount}
        />
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => router.push("/billing")}
          className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
        >
          ⬅ Back to Billing Page
        </button>
      </div>
    </div>
  );
}
