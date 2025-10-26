"use client";
import { useState, useContext, useMemo } from "react";
import { DoctorModuleContext } from "../../../app/doctor/DoctorModuleContext";

export default function PatientQueue() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const context = useContext(DoctorModuleContext);
  const appointments = context?.appointments || [];

  // Build a simple queue from today's scheduled appointments
  const today = new Date().toISOString().split("T")[0];
  const patientQueue = useMemo(() => {
    const todays = appointments
      .filter((a) => a.status === "scheduled" && a.date === today)
      .slice();
    todays.sort((a, b) => {
      const at = a.slotStart || a.time || "";
      const bt = b.slotStart || b.time || "";
      return at.localeCompare(bt);
    });
    return todays.map((a) => ({
      id: a.id,
      name: a.patientName,
      age: a.patientDetails?.age || "",
      gender: a.patientDetails?.gender || "",
      condition: a.sessionType || "Consultation",
      bloodPressure: "—",
      temperature: "—",
      waitingTime: "—",
      priority: "medium",
      status: "waiting",
      patientId: a.patientDetails?.patientId || a.id,
    }));
  }, [appointments, today]);

  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-4 lg:p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
            Patient Queue
          </h2>
          <p className="text-sm text-gray-500">Live waiting list</p>
        </div>
        <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live
        </span>
      </div>

      {/* Patient List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {patientQueue.map((patient) => (
          <div
            key={patient.id}
            className={`p-3 rounded-xl border transition-all duration-200 group hover:shadow-md cursor-pointer ${
              patient.status === "in-consultation"
                ? "border-green-200 bg-green-50/50"
                : "border-gray-200 bg-white/60"
            } ${
              selectedPatient?.id === patient.id ? "ring-2 ring-green-500" : ""
            }`}
            onClick={() => viewPatientDetails(patient)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    patient.priority === "urgent"
                      ? "bg-red-100 text-red-600"
                      : patient.priority === "high"
                      ? "bg-orange-100 text-orange-600"
                      : patient.priority === "medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <i className="bi bi-person text-lg"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {patient.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {patient.age}y • {patient.gender} • {patient.condition}
                  </p>
                </div>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <i className="bi bi-droplet text-red-500"></i>
                BP: {patient.bloodPressure}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <i className="bi bi-thermometer text-orange-500"></i>
                Temp: {patient.temperature}
              </div>
            </div>

            {/* Waiting Time */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-500">
                <i className="bi bi-clock"></i>
                {patient.waitingTime}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200/60">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-800">
              {patientQueue.filter((p) => p.status === "waiting").length}
            </div>
            <div className="text-xs text-gray-500">Waiting</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">4.2</div>
            <div className="text-xs text-gray-500">Avg Wait (min)</div>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Patient Details
              </h3>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                  <i className="bi bi-person text-2xl text-green-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {selectedPatient.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {selectedPatient.age}y • {selectedPatient.gender} • ID:{" "}
                    {selectedPatient.patientId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Blood Pressure</div>
                  <div className="font-semibold text-gray-800">
                    {selectedPatient.bloodPressure}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500">Temperature</div>
                  <div className="font-semibold text-gray-800">
                    {selectedPatient.temperature}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Condition
                </div>
                <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm">
                  {selectedPatient.condition}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
