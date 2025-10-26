// "use client";
// import React, { useContext, useState, useEffect } from "react";
// import { DoctorModuleContext } from "../../../app/doctor/DoctorModuleContext";
// import AppointmentDetailModal from "./AppointmentDetailModal";

// // Badge for appointment type
// const AppointmentTypeBadge = ({ type }) => {
//   const styles = {
//     virtual: "bg-blue-100 text-blue-700",
//     "walk-in": "bg-green-100 text-green-700",
//     offline: "bg-purple-100 text-purple-700",
//   };
//   return (
//     <span
//       className={`px-2 py-1 text-xs font-medium rounded-full ${
//         styles[type] || "bg-gray-100 text-gray-700"
//       }`}
//     >
//       {type?.replace("-", " ")}
//     </span>
//   );
// };

// // Badge for session type
// const SessionTypeBadge = ({ sessionType }) => {
//   const styles = {
//     Checkup: "bg-yellow-100 text-yellow-700",
//     "Follow-Up": "bg-pink-100 text-pink-700",
//     Therapy: "bg-indigo-100 text-indigo-700",
//     Consultation: "bg-orange-100 text-orange-700",
//   };
//   return (
//     <span
//       className={`px-2 py-1 text-xs font-medium rounded-full ${
//         styles[sessionType] || "bg-gray-100 text-gray-700"
//       }`}
//     >
//       {sessionType}
//     </span>
//   );
// };

// export default function UpcomingAppointments({ appointments = [], onHandwritten }) {
//   const context = useContext(DoctorModuleContext);
//   const handleNavigateToPrescription = context?.handleNavigateToPrescription;

//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [patientDocuments, setPatientDocuments] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   const activeAppointments = (appointments || []).filter(
//     (app) => app?.status?.toLowerCase() !== "cancelled"
//   );

//   // Prescription button handler (safe)
//   const handlePrescription = (app) => {
//     if (handleNavigateToPrescription) {
//       handleNavigateToPrescription({
//         patient_id: app.patientId,
//         appointment_id: app.id,
//         patientName: app.patientName,
//         patientEmail: app.patientEmail,
//         doctor_id: app.doctorId,
//         hospital_id: app.hospitalId,
//         date: app.date,
//         slotStart: app.slotStart,
//         slotEnd: app.slotEnd,
//         sessionType: app.sessionType,
//         status: app.status,
//       });
//     } else {
//       alert("Prescription navigation not available in this module.");
//     }
//   };

//   // View details + fetch patient documents
//   const handleViewDetails = async (app) => {
//     setSelectedAppointment(app);
//     setShowModal(true);

//     try {
//       const user = JSON.parse(localStorage.getItem("hmsUser"));
//       const token = user?.token;

//       if (!token) {
//         alert("Authentication expired. Please log in again.");
//         return;
//       }

//       const patient_id = app.patientId;
//       if (!patient_id) {
//         alert("Cannot fetch uploads — patient ID missing.");
//         return;
//       }

//       const res = await fetch(
//         `http://localhost:3000/patient-uploads/${patient_id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (!res.ok) {
//         console.warn("Patient uploads fetch failed:", res.status);
//         setPatientDocuments([]);
//         return;
//       }

//       const data = await res.json();
//       const allFiles = (data.uploads || []).flatMap((upload) =>
//         (upload.files || []).map((file) => ({
//           url: file.file_url,
//           type: file.file_type === "pdf" ? "application/pdf" : file.file_type || "",
//           name: upload.diagnosis || "Patient Document",
//         }))
//       );

//       setPatientDocuments(allFiles);
//     } catch (error) {
//       console.error("Failed to fetch patient documents:", error);
//       setPatientDocuments([]);
//     }
//   };

//   useEffect(() => {
//     if (appointments && appointments.length > 0) {
//       const uniquePatientIds = [
//         ...new Set(appointments.map((app) => app.patientId)),
//       ];
//       localStorage.setItem("patientIds", JSON.stringify(uniquePatientIds));
//     }
//   }, [appointments]);

//   return (
//     <div>
//       <h2 className="text-xl font-bold text-gray-800 mb-4">
//         Upcoming Appointments
//       </h2>

//       {activeAppointments.length > 0 ? (
//         <div className="space-y-4">
//           {activeAppointments.map((app) => (
//             <div
//               key={app.id}
//               className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
//             >
//               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
//                 {/* Left side */}
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 text-gray-500">
//                     <i className="bi bi-person text-2xl"></i>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-800">
//                       {app.patientName || "N/A"}
//                     </h3>
//                     <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
//                       <span className="flex items-center">
//                         <i className="bi bi-calendar3 mr-1.5"></i>
//                         {app.date
//                           ? new Date(app.date).toLocaleDateString("en-US", {
//                               year: "numeric",
//                               month: "long",
//                               day: "numeric",
//                             })
//                           : "N/A"}
//                       </span>
//                       <span className="flex items-center">
//                         <i className="bi bi-clock mr-1.5"></i>
//                         {app.time || "N/A"}
//                       </span>
//                     </div>
//                     <div className="mt-2 flex gap-2 flex-wrap">
//                       <AppointmentTypeBadge type={app.type} />
//                       <SessionTypeBadge sessionType={app.sessionType} />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right side buttons */}
//                 <div className="mt-4 sm:mt-0 flex-shrink-0 flex sm:flex-col items-center gap-2 self-end sm:self-start">
//                   <button
//                     onClick={() => handleViewDetails(app)}
//                     className="px-4 py-2 w-full border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
//                   >
//                     View Details
//                   </button>

//                   {handleNavigateToPrescription && (
//                     <button
//                       onClick={() => handlePrescription(app)}
//                       className="bg-green-600 text-white px-4 py-2 w-full rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
//                     >
//                       <i className="bi bi-file-earmark-medical"></i>
//                       Prescription
//                     </button>
//                   )}

//                   <button
//                     onClick={() => onHandwritten?.(app)}
//                     className="bg-yellow-500 text-white px-4 py-2 w-full rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
//                   >
//                     <i className="bi bi-pencil"></i>
//                     Handwritten Prescription
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <i className="bi bi-calendar-check text-4xl text-gray-300 mb-4"></i>
//           <h3 className="text-lg font-medium text-gray-500">
//             No Upcoming Appointments
//           </h3>
//           <p className="text-gray-400 mt-1">
//             All scheduled appointments will be displayed here.
//           </p>
//         </div>
//       )}

//       {showModal && selectedAppointment && (
//         <AppointmentDetailModal
//           appointment={selectedAppointment}
//           patientDocuments={patientDocuments}
//           onClose={() => setShowModal(false)}
//         />
//       )}
//     </div>
//   );
// }
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
      ? "bg-green-100 text-green-800"
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
                <th className="py-2 px-3 border-b">Reason</th>
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
                  <td className="py-2 px-3 border-b">{app.reason || "N/A"}</td>
                  <td className="py-2 px-3 border-b capitalize">{app.status || "Scheduled"}</td>
                  <td className="py-2 px-3 border-b text-center">
                    <button
                      onClick={() => handleStartAppointment(app)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow"
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
