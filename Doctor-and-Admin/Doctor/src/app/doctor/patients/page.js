"use client";
import { useEffect, useMemo, useState, useContext } from "react";
import { DoctorModuleContext } from "../DoctorModuleContext";

export default function PatientsPage() {
  const context = useContext(DoctorModuleContext);
  const appointments = context?.appointments || [];

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [view, setView] = useState("grid"); // grid, list

  // Derive unique patients from appointments
  const derivedPatients = useMemo(() => {
    const map = new Map();
    for (const appt of appointments) {
      const key =
        appt.patientDetails?.patientId || appt.patientEmail || appt.patientName;
      if (!key) continue;
      const existing = map.get(key);
      const next = {
        id: key,
        patientEmail: appt.patientDetails?.email || appt.patientEmail || "",
        name: appt.patientName || "Unknown",
        age: appt.patientDetails?.age || "",
        gender: appt.patientDetails?.gender || "",
        phone: appt.patientDetails?.contact || "",
        email: appt.patientDetails?.email || appt.patientEmail || "",
        lastVisit: appt.date,
        nextAppointment:
          appt.status === "scheduled"
            ? appt.date
            : existing?.nextAppointment || null,
        status: appt.status === "cancelled" ? "inactive" : "active",
        conditions: Array.from(
          new Set(
            [
              existing?.conditions,
              appt.sessionType || appt.reason || "Consultation",
            ]
              .flat()
              .filter(Boolean)
          )
        ),
        priority: "medium",
        bloodGroup: existing?.bloodGroup || "",
        allergies: existing?.allergies || [],
      };
      map.set(key, existing ? { ...existing, ...next } : next);
    }
    return Array.from(map.values());
  }, [appointments]);

  useEffect(() => {
    setPatients(derivedPatients);
    setFilteredPatients(derivedPatients);
  }, [derivedPatients]);

  // Filter patients based on search and filters
  useEffect(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (patient.patientEmail &&
            patient.patientEmail
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          patient.conditions.some((condition) =>
            condition.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((patient) => patient.status === statusFilter);
    }

    setFilteredPatients(filtered);
  }, [searchTerm, statusFilter, patients]);

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    // In real app: router.push(`/doctor/patients/${patient.id}`);
  };

  const handleStartConsultation = (patientId) => {
    console.log(`Starting consultation for patient ${patientId}`);
    // Redirect to consultation page
    // router.push(`/doctor/consultation/${patientId}`);
  };

  const handleAddPrescription = (patientId) => {
    console.log(`Adding prescription for patient ${patientId}`);
    // NOTE: This logic might need adjustment depending on how you handle cross-module state
    // For now, it remains as is, but router.push would be better in the final version.
    // setActiveModule("prescriptions");
    // router.push(`/doctor/prescriptions?patient=${patientId}`);
  };

  // NOTE: Loading and auth checks are removed as they are handled by the layout.

  return (
    <>
      <main className="flex-1 p-4 lg:p-6 overflow-auto">
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                My Patients
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and view all your patient records and medical history
              </p>
            </div>
            {/*  <button className="mt-4 lg:mt-0 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
                <i className="bi bi-plus-lg"></i>
                Add New Patient
              </button> */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-800">
              {patients.length}
            </div>
            <div className="text-sm text-gray-500">Total Patients</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {patients.filter((p) => p.status === "active").length}
            </div>
            <div className="text-sm text-gray-500">Active Patients</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {patients.filter((p) => p.nextAppointment).length}
            </div>
            <div className="text-sm text-gray-500">Upcoming Appointments</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {
                patients.filter(
                  (p) => p.priority === "high" || p.priority === "urgent"
                ).length
              }
            </div>
            <div className="text-sm text-gray-500">High Priority</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search patients by name, ID, or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <i className="bi bi-search absolute left-3 top-3.5 text-gray-400"></i>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    view === "grid"
                      ? "bg-white shadow-sm text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <i className="bi bi-grid"></i>
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-md transition-colors ${
                    view === "list"
                      ? "bg-white shadow-sm text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <i className="bi bi-list"></i>
                </button>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients Grid/List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onView={handleViewPatient}
                  onConsult={handleStartConsultation}
                  onPrescribe={handleAddPrescription}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conditions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <PatientRow
                      key={patient.id}
                      patient={patient}
                      onView={handleViewPatient}
                      onConsult={handleStartConsultation}
                      onPrescribe={handleAddPrescription}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <i className="bi bi-people text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-500">
                No patients found
              </h3>
              <p className="text-gray-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onConsult={handleStartConsultation}
          onPrescribe={handleAddPrescription}
        />
      )}
    </>
  );
}

// Patient Card Component for Grid View
function PatientCard({ patient, onView, onConsult, onPrescribe }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <i className="bi bi-person text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{patient.name}</h3>
              <p className="text-sm text-gray-900">
                Email:{" "}
                {patient.patientEmail ? (
                  <a
                    href={`mailto:${patient.patientEmail}`}
                    className="underline-offset-2 hover:underline"
                  >
                    {patient.patientEmail}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              patient.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {patient.status}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            {patient.age}y • {patient.gender}
          </span>
          <span className="flex items-center gap-1">
            <i className="bi bi-droplet"></i>
            {patient.bloodGroup}
          </span>
        </div>
      </div>

      {/* Conditions */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-1">
          {patient.conditions.map((condition, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
            >
              {condition}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex gap-2">
          <button
            onClick={() => onView(patient)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            View
          </button>
          <button
            onClick={() => onConsult(patient.id)}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Consult
          </button>
          <button
            onClick={() => onPrescribe(patient.id)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Add Prescription"
          >
            <i className="bi bi-file-medical"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

// Patient Row Component for List View
function PatientRow({ patient, onView, onConsult, onPrescribe }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <i className="bi bi-person text-green-600"></i>
          </div>
          <div>
            <div className="font-medium text-gray-900">{patient.name}</div>
            <div className="text-sm text-gray-900">
              Email:{" "}
              {patient.patientEmail ? (
                <a
                  href={`mailto:${patient.patientEmail}`}
                  className="underline-offset-2 hover:underline"
                >
                  {patient.patientEmail}
                </a>
              ) : (
                "N/A"
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {patient.phone ? (
            <a
              href={`tel:${patient.phone}`}
              className="underline-offset-2 hover:underline"
            >
              {patient.phone}
            </a>
          ) : (
            "N/A"
          )}
        </div>
        <div className="text-sm text-gray-900">
          {patient.email ? (
            <a
              href={`mailto:${patient.email}`}
              className="underline-offset-2 hover:underline"
            >
              {patient.email}
            </a>
          ) : (
            "N/A"
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            patient.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {patient.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1 max-w-xs">
          {patient.conditions.map((condition, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
            >
              {condition}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(patient)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="View Details"
          >
            <i className="bi bi-eye"></i>
          </button>
          <button
            onClick={() => onConsult(patient.id)}
            className="text-green-600 hover:text-green-800 transition-colors"
            title="Start Consultation"
          >
            <i className="bi bi-chat-dots"></i>
          </button>
          <button
            onClick={() => onPrescribe(patient.id)}
            className="text-purple-600 hover:text-purple-800 transition-colors"
            title="Add Prescription"
          >
            <i className="bi bi-file-medical"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}

// Patient Detail Modal Component
function PatientDetailModal({ patient, onClose, onConsult, onPrescribe }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Patient Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="bi bi-x-lg text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="bi bi-person text-green-600 text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {patient.name}
                </h3>
                <p className="text-gray-500">
                  Patient email: {patient.patientEmail}
                </p>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Age:</span>
                    <span className="font-medium">{patient.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gender:</span>
                    <span className="font-medium">{patient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Blood Group:</span>
                    <span className="font-medium">{patient.bloodGroup}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Details */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium text-gray-800">
                        {patient.phone}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium text-gray-800">
                        {patient.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Conditions */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Medical Conditions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {patient.conditions.map((condition, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Allergies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="bg-red-100 text-red-800 px-3 py-2 rounded-lg font-medium"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Appointment Info */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Appointment Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Last Visit</div>
                      <div className="font-medium text-gray-800">
                        {new Date(patient.lastVisit).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">
                        Next Appointment
                      </div>
                      <div className="font-medium text-gray-800">
                        {patient.nextAppointment
                          ? new Date(
                              patient.nextAppointment
                            ).toLocaleDateString()
                          : "Not scheduled"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={() => onPrescribe(patient.id)}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
            >
              <i className="bi bi-file-medical"></i>
              Add Prescription
            </button>
            <button
              onClick={() => onConsult(patient.id)}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
            >
              <i className="bi bi-chat-dots"></i>
              Start Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
