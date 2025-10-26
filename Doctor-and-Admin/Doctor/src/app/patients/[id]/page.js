"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";

export default function PatientProfile() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams?.get("mode") || "view";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [patient, setPatient] = useState(null);
  const [editMode, setEditMode] = useState(modeParam === "edit");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("patients")) || [];
    const found = stored.find((p) => p.id === id);
    if (found) {
      const copy = { ...found };
      if (!copy.firstName && copy.name) {
        const parts = copy.name.trim().split(" ");
        copy.firstName = parts.shift() || "";
        copy.lastName = parts.join(" ") || "";
      }
      if ((copy.age === undefined || copy.age === "") && copy.dob) {
        const today = new Date();
        const bd = new Date(copy.dob);
        let age = today.getFullYear() - bd.getFullYear();
        const m = today.getMonth() - bd.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
        copy.age = age;
      }
      setPatient(copy);
    }
  }, [id]);

  const persistPatient = (updatedPatient) => {
    const stored = JSON.parse(localStorage.getItem("patients")) || [];
    const updated = stored.map((p) => (p.id === id ? updatedPatient : p));
    localStorage.setItem("patients", JSON.stringify(updated));
    window.dispatchEvent(new Event("patientsUpdated"));
    setPatient(updatedPatient);
  };

  const validate = (p) => {
    if (!p.firstName?.trim()) return "First name required";
    if (!p.lastName?.trim()) return "Last name required";
    if (!p.phone || !/^\d{7,15}$/.test(p.phone.trim())) return "Valid phone required";
    if (!p.dob) return "DOB required";
    if (!p.gender) return "Gender required";
    return null;
  };

  const handleSave = () => {
    const err = validate(patient);
    if (err) {
      alert(err);
      return;
    }
    persistPatient(patient);
    alert("Patient updated successfully!");
    setEditMode(false);
  };

  const handleRemove = () => {
    if (!confirm("Are you sure you want to permanently remove this patient? This action cannot be undone.")) return;
    
    const stored = JSON.parse(localStorage.getItem("patients")) || [];
    const updated = stored.filter((p) => p.id !== id);
    localStorage.setItem("patients", JSON.stringify(updated));
    window.dispatchEvent(new Event("patientsUpdated"));
    alert("Patient removed successfully!");
    router.push("/patients");
  };

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
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-gray-600">Patient not found.</p>
          </div>
        </main>
      </div>
    );
  }

  const fullName = `${patient.firstName || ""}${patient.lastName ? " " + patient.lastName : ""}`;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push("/patients")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Patient Profile</h1>
                <p className="text-sm text-gray-600">Manage patient information and details</p>
              </div>
            </div>

            <div className="flex gap-2">
              {!editMode && (
                <button 
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              )}
              <button 
                onClick={handleRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove Patient
              </button>
            </div>
          </div>
        </div>

        {/* Patient Profile */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                      {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{fullName}</h2>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        <span>ID: {patient.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{patient.gender}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{patient.age} years</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Personal Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                      {editMode ? (
                        <div className="space-y-2">
                          <input 
                            value={patient.firstName || ""} 
                            onChange={(e) => setPatient((s) => ({ ...s, firstName: e.target.value }))}
                            placeholder="First Name"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          />
                          <input 
                            value={patient.lastName || ""} 
                            onChange={(e) => setPatient((s) => ({ ...s, lastName: e.target.value }))}
                            placeholder="Last Name"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-900 font-medium">{fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                      {editMode ? (
                        <input 
                          type="date"
                          value={patient.dob || ""}
                          onChange={(e) => handleDobChange(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{patient.dob || "—"}</p>
                      )}
                      {patient.age !== undefined && (
                        <p className="text-sm text-gray-600 mt-1">Age: {patient.age} years</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                      {editMode ? (
                        <select 
                          value={patient.gender || ""}
                          onChange={(e) => setPatient((s) => ({ ...s, gender: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{patient.gender || "—"}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Contact Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                      {editMode ? (
                        <input 
                          value={patient.phone || ""}
                          onChange={(e) => setPatient((s) => ({ ...s, phone: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{patient.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                      {editMode ? (
                        <input 
                          type="email"
                          value={patient.email || ""}
                          onChange={(e) => setPatient((s) => ({ ...s, email: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{patient.email || "—"}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                      {editMode ? (
                        <textarea 
                          value={patient.address || ""}
                          onChange={(e) => setPatient((s) => ({ ...s, address: e.target.value }))}
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 whitespace-pre-wrap">{patient.address || "—"}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {editMode && (
                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                    <button 
                      onClick={() => setEditMode(false)}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}