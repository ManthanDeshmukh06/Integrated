
"use client";

import { useEffect, useState, useContext } from "react";
import { DoctorModuleContext } from "../DoctorModuleContext";
import PrescriptionForm from "../../../components/doctor/prescriptions/PrescriptionForm";

export default function PrescriptionsPage() {
  const { prescriptionContext, setPrescriptionContext, setPrescriptionTab } =
    useContext(DoctorModuleContext);

  const [patient, setPatient] = useState(null);

  useEffect(() => {
    let savedPatient = prescriptionContext;

    if (!savedPatient && typeof window !== "undefined") {
      const stored = localStorage.getItem("prescriptionContext");
      if (stored) savedPatient = JSON.parse(stored);
    }

    if (savedPatient) {
      setPatient(savedPatient);
      setPrescriptionContext(savedPatient);
      setPrescriptionTab("new");
    }
  }, [prescriptionContext, setPrescriptionContext, setPrescriptionTab]);

  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen text-gray-900">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Prescriptions</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {patient?.patientEmail ? (
          <PrescriptionForm
            initialPatientData={patient}
            onSubmit={(data) =>
              console.log("New prescription submitted:", data)
            }
            onCancel={() => console.log("Prescription cancelled")}
          />
        ) : (
          <div className="text-center py-12 text-red-600">
            No patient selected. Start from appointment.
          </div>
        )}
      </div>
    </main>
  );
}
