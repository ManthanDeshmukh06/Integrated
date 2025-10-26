"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ServicesTable from "./ServicesTable";

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentIdFromURL = searchParams.get("appointmentId");

  const [loading, setLoading] = useState(false);

  const [patient, setPatient] = useState({
    name: "",
    contact: "",
    gender: "",
    age: "",
    doctorName: "",
    doctor_id: "",
    patient_id: "",
    appointment_id: "",
    hospital_id: "",
  });

  const [hospital, setHospital] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
  });

  const [services, setServices] = useState([]);

  // 🧩 Auto-fetch details if appointmentId comes from URL
  useEffect(() => {
    if (appointmentIdFromURL) {
      fetchPatientDetails(appointmentIdFromURL);
    }
  }, [appointmentIdFromURL]);

  // 📦 Fetch patient + doctor details by appointment ID
  const fetchPatientDetails = async (id) => {
    if (!id) return;
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/billing/appointment/${id}`
      );
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to fetch patient details");
        return;
      }

      // ✅ Auto-fill patient + doctor details
      setPatient({
        name: data.patient.name,
        contact: data.patient.contact,
        gender: data.patient.gender,
        age: data.patient.age,
        doctorName: data.doctorName,
        doctor_id: data.doctor_id,
        patient_id: data.patient_id,
        appointment_id: data.appointment_id,
        hospital_id: data.hospital_id,
      });

      // 🏥 Fetch hospital details
      if (data.hospital_id) {
        await fetchHospitalDetails(data.hospital_id);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch billing info");
    } finally {
      setLoading(false);
    }
  };

  // 🏥 Fetch Hospital details using hospital_id
  const fetchHospitalDetails = async (hospitalId) => {
    try {
      if (!hospitalId || hospitalId === "—") return;

      const res = await fetch(
        `http://localhost:5000/api/hospitals/${hospitalId}`
      );
      const data = await res.json();

      if (!res.ok) {
        alert("Failed to fetch hospital details");
        return;
      }

      setHospital({
        name: data.name || "",
        address: data.address || "",
        contact: data.contact || "",
        email: data.email || "",
      });
    } catch (err) {
      console.error("Error fetching hospital:", err);
    }
  };

  // 🧾 Generate Bill
  const handleGenerateBill = async () => {
    if (!patient.name || services.length === 0) {
      alert("Please fill patient details and add at least one service!");
      return;
    }

    const totalAmount = services.reduce(
      (sum, s) => sum + parseFloat(s.price || 0),
      0
    );

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/billing/createbill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patient.patient_id,
          doctor_id: patient.doctor_id,
          appointment_id: patient.appointment_id,
          hospital_id: patient.hospital_id,
          patientName: patient.name,
          contact: patient.contact,
          gender: patient.gender,
          age: patient.age,
          doctorName: patient.doctorName,
          services,
          totalAmount,
          paymentMode: "Cash",
          paymentStatus: "Paid",
          date: new Date(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to save bill!");
        return;
      }

      router.push(
        `/final-bill?billId=${data.bill._id}&name=${encodeURIComponent(
          patient.name
        )}&total=${totalAmount}`
      );
    } catch (error) {
      console.error("Error saving bill:", error);
      alert("Error creating bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-[900px] mx-auto mt-8">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
        🏥 Hospital Billing Module
      </h1>

      {/* Patient Info */}
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        👤 Patient Details
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Patient Name"
          value={patient.name}
          readOnly
          className="border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Contact"
          value={patient.contact}
          readOnly
          className="border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Gender"
          value={patient.gender}
          readOnly
          className="border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Age"
          value={patient.age}
          readOnly
          className="border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Doctor Name"
          value={patient.doctorName}
          readOnly
          className="border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Hospital Info */}
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        🏥 Hospital Details
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Hospital Name"
          value={hospital.name}
          readOnly
          className="border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Contact"
          value={hospital.contact}
          readOnly
          className="border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Email"
          value={hospital.email}
          readOnly
          className="border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Address"
          value={hospital.address}
          readOnly
          className="border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Services Table */}
      <ServicesTable services={services} setServices={setServices} />

      {/* Generate Bill */}
      <div className="mt-6 text-right">
        <button
          onClick={handleGenerateBill}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Bill"}
        </button>
      </div>
    </div>
  );
}
