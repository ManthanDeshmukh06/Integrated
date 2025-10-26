"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";

export default function PatientProfile() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode") || "view"; // default view

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [patient, setPatient] = useState(null);
  const [editMode, setEditMode] = useState(modeParam === "edit");

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("patients")) || [];
    const found = stored.find((p) => p.id === id);
    if (found) setPatient(found);
  }, [id]);

  const persistPatient = (updatedPatient) => {
    const stored = JSON.parse(localStorage.getItem("patients")) || [];
    const updated = stored.map((p) => (p.id === id ? updatedPatient : p));
    localStorage.setItem("patients", JSON.stringify(updated));
    window.dispatchEvent(new Event("patientsUpdated"));
    setPatient(updatedPatient);
  };

  // Validation
  const validate = (p) => {
    if (!p.name || p.name.trim().length === 0) return "Name required";
    if (!p.phone || !/^\d{7,15}$/.test(p.phone.trim())) return "Valid phone required";
    if (!p.dob) return "DOB required";
    if (!p.gender) return "Gender required";
    return null;
  };

  // Save handler
  const handleSave = () => {
    const err = validate(patient);
    if (err) {
      alert(err);
      return;
    }
    persistPatient({ ...patient, active: true });
    alert("Patient updated successfully!");
    setEditMode(false);
  };

  // Remove handler (soft remove)
  const handleRemove = () => {
    if (!confirm("Remove this patient from active list? Data will still be saved.")) return;
    const updated = { ...patient, active: false };
    persistPatient(updated);
    alert("Patient removed.");
    router.push("/patients"); // back to list
  };

  // Age auto-calc
  const handleDobChange = (val) => {
    const today = new Date();
    const birthDate = new Date(val);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    setPatient((s) => ({ ...s, dob: val, age }));
  };

  if (!patient) {
    return (
      <div className="flex h-screen">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="flex-1 p-6">
          <p className="text-slate-600">Patient not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Patient Profile – {patient.name}
            </h2>
            <button
              onClick={() => router.push("/patients")}
              className="px-4 py-2 border rounded-md hover:bg-slate-50"
            >
              Back
            </button>
          </div>

          {/* Details */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              {editMode ? (
                <input
                  className="w-full border rounded px-3 py-2"
                  value={patient.name}
                  onChange={(e) => setPatient((s) => ({ ...s, name: e.target.value }))}
                />
              ) : (
                <p className="text-slate-900">{patient.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              {editMode ? (
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={patient.email}
                  onChange={(e) => setPatient((s) => ({ ...s, email: e.target.value }))}
                />
              ) : (
                <p className="text-slate-900">{patient.email || "—"}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium">Phone</label>
              {editMode ? (
                <input
                  className="w-full border rounded px-3 py-2"
                  value={patient.phone}
                  onChange={(e) => setPatient((s) => ({ ...s, phone: e.target.value }))}
                />
              ) : (
                <p className="text-slate-900">{patient.phone}</p>
              )}
            </div>

            {/* DOB + Age */}
            <div>
              <label className="block text-sm font-medium">Date of Birth</label>
              {editMode ? (
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={patient.dob}
                  onChange={(e) => handleDobChange(e.target.value)}
                />
              ) : (
                <p className="text-slate-900">{patient.dob}</p>
              )}
              {patient.age !== undefined && (
                <p className="text-slate-600 text-sm mt-1">Age: {patient.age}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium">Gender</label>
              {editMode ? (
                <select
                  className="w-full border rounded px-3 py-2"
                  value={patient.gender}
                  onChange={(e) => setPatient((s) => ({ ...s, gender: e.target.value }))}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              ) : (
                <p className="text-slate-900">{patient.gender}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium">Address</label>
              {editMode ? (
                <textarea
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  value={patient.address}
                  onChange={(e) => setPatient((s) => ({ ...s, address: e.target.value }))}
                />
              ) : (
                <p className="text-slate-900">{patient.address || "—"}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {patient.active && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                )}
                {patient.active && (
                  <button
                    onClick={handleRemove}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Remove
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
