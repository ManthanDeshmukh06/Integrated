"use client";
import React, { useContext, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DoctorModuleContext } from "../../../app/doctor/DoctorModuleContext";
import AppointmentDetailModal from "./AppointmentDetailModal";

export default function UpcomingAppointments({ appointments = [], onHandwritten }) {
  const context = useContext(DoctorModuleContext);
  const handleNavigateToPrescription = context?.handleNavigateToPrescription;
  const router = useRouter();

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientDocuments, setPatientDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Filter upcoming / active appointments
  const activeAppointments = useMemo(
    () =>
      (appointments || []).filter(
        (app) => app?.status?.toLowerCase() !== "cancelled"
      ),
    [appointments]
  );

  // Row colors based on status
  const getStatusColor = (status) =>
    status.toLowerCase() === "completed"
      ? "bg-blue-100 text-blue-800"
      : "bg-yellow-100 text-yellow-800";

  // View details + fetch patient documents
  const handleViewDetails = async (app) => {
    setSelectedAppointment(app);
    setShowModal(true);

    try {
      const user = JSON.parse(localStorage.getItem("hmsUser"));
      const token = user?.token;
      if (!token) return;

      const patient_id = app.patientId;
      if (!patient_id) return;

      const res = await fetch(`http://localhost:3000/patient-uploads/${patient_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setPatientDocuments([]);
        return;
      }

      const data = await res.json();
      const allFiles = (data.uploads || []).flatMap((upload) =>
        (upload.files || []).map((file) => ({
          url: file.file_url,
          type: file.file_type === "pdf" ? "application/pdf" : file.file_type || "",
          name: upload.diagnosis || "Patient Document",
        }))
      );

      setPatientDocuments(allFiles);
    } catch (error) {
      console.error(error);
      setPatientDocuments([]);
    }
  };

  // 🩺 Start Appointment → navigate to Complete Appointment page
  const handleStartAppointment = (app) => {
    // Save selected appointment in localStorage for access in complete page
    if (typeof window !== "undefined") {
      localStorage.setItem("activeAppointment", JSON.stringify(app));
    }
    router.push("/doctor/complete-appointments");
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Upcoming Appointments
      </h2>

      {activeAppointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-left text-gray-900">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 border-b">Start Time</th>
                <th className="py-2 px-3 border-b">End Time</th>
                <th className="py-2 px-3 border-b">Patient</th>
                <th className="py-2 px-3 border-b">Type</th>
                <th className="py-2 px-3 border-b">Session</th>
                {/* <th className="py-2 px-3 border-b">Reason</th> */}
                <th className="py-2 px-3 border-b">Status</th>
                <th className="py-2 px-3 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {activeAppointments.map((app, index) => (
                <tr
                  key={app._id || `appointment-${index}`}
                  className={`${getStatusColor(app.status)} hover:shadow transition-shadow`}
                >
                  <td className="py-2 px-3 border-b">{app.slotStart || "N/A"}</td>
                  <td className="py-2 px-3 border-b">{app.slotEnd || "N/A"}</td>
                  <td className="py-2 px-3 border-b">{app.patientName || "N/A"}</td>
                  <td className="py-2 px-3 border-b">{app.appointmentType || "Manual"}</td>
                  <td className="py-2 px-3 border-b">{app.sessionType || "N/A"}</td>
                  {/* <td className="py-2 px-3 border-b">{app.reason || "N/A"}</td> */}
                  <td className="py-2 px-3 border-b capitalize">{app.status || "Scheduled"}</td>
                  <td className="py-2 px-3 border-b text-center">
                    <button
                      onClick={() => handleStartAppointment(app)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow"
                    >
                      Start Appointment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <i className="bi bi-calendar-check text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-500">
            No Upcoming Appointments
          </h3>
          <p className="text-gray-400 mt-1">
            All scheduled appointments will be displayed here.
          </p>
        </div>
      )}

      {showModal && selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          patientDocuments={patientDocuments}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
