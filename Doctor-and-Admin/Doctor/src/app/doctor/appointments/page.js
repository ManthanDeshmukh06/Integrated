// "use client";
// import { useState, useContext, useEffect } from "react";
// import { DoctorModuleContext } from "../DoctorModuleContext";
// import UpcomingAppointments from "../../../components/doctor/appointments/UpcomingAppointments";
// import VirtualConsultation from "../../../components/doctor/appointments/VirtualConsultation";
// import History from "../../../components/doctor/appointments/History";
// import AppointmentDetailModal from "../../../components/doctor/appointments/AppointmentDetailModal";
// import {
//   getAppointmentWithPatientDetails,
//   markPrescriptionGiven,
// } from "../../../services/doctorAppointmentsApi";

// export default function AppointmentsPage() {
//   const [activeTab, setActiveTab] = useState("upcoming");
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [loadingDetailId, setLoadingDetailId] = useState(null);
//   const [historyDate, setHistoryDate] = useState(
//     () => new Date().toISOString().split("T")[0]
//   );
//   const [historyData, setHistoryData] = useState(null);

//   const context = useContext(DoctorModuleContext);

//   if (!context) {
//     return (
//       <div className="flex-1 p-6 flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   const { appointments, setAppointments, handleNavigateToPrescription } =
//     context;

//   const handlePrescription = async (appointmentId) => {
//     try {
//       const user =
//         typeof window !== "undefined"
//           ? JSON.parse(localStorage.getItem("hmsUser") || "{}")
//           : null;
//       await markPrescriptionGiven({
//         hospitalId: user?.hospitalId,
//         appointmentId,
//       });
//       setAppointments((prev) =>
//         prev.map((app) =>
//           app.id === appointmentId ? { ...app, status: "completed" } : app
//         )
//       );
//       const patientData = appointments.find((app) => app.id === appointmentId);
//       if (patientData) {
//         handleNavigateToPrescription(patientData);
//       }
//     } catch (e) {
//       alert("Failed to mark prescription as given");
//       console.error(e);
//     }
//   };

//   const handleHandwritten = (appointmentId) => {
//     setAppointments((prev) => {
//       const updated = prev.map((app) =>
//         app.id === appointmentId ? { ...app, status: "completed" } : app
//       );
//       if (typeof window !== "undefined") {
//         localStorage.setItem("appointments", JSON.stringify(updated));
//       }
//       return updated;
//     });
//   };

//   const now = new Date();

//   // Upcoming appointments: scheduled in future
//   const upcomingAppointments = appointments
//     .filter((a) => new Date(`${a.date}T${a.slotStart}`) > now)
//     .sort(
//       (a, b) =>
//         new Date(`${a.date}T${a.slotStart}`) - new Date(`${b.date}T${b.slotStart}`)
//     );

//   // Virtual consultation appointments: future only
//   const virtualAppointments = appointments.filter(
//     (a) => a.type === "virtual" && new Date(`${a.date}T${a.slotStart}`) > now
//   );

//   // History appointments: past appointments only
//   const historyAppointments = appointments.filter(
//     (a) => new Date(`${a.date}T${a.slotEnd}`) <= now
//   );

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const user =
//           typeof window !== "undefined"
//             ? JSON.parse(localStorage.getItem("hmsUser") || "{}")
//             : null;
//         if (!user?.hospitalId || !user?.doctorid) return;
//         const { getDoctorAppointmentHistory } = await import(
//           "../../../services/doctorAppointmentsApi"
//         );
//         const res = await getDoctorAppointmentHistory({
//           hospitalId: user.hospitalId,
//           doctorId: user.doctorid,
//           date: historyDate,
//         });
//         setHistoryData(res?.history || null);
//       } catch (e) {
//         setHistoryData(null);
//       }
//     };
//     if (activeTab === "history") fetchHistory();
//   }, [activeTab, historyDate]);

//   const handleViewDetails = async (app) => {
//     try {
//       setLoadingDetailId(app.id);
//       const res = await getAppointmentWithPatientDetails({
//         appointmentId: app.id,
//       });
//       const enriched = {
//         ...app,
//         patientDetails: {
//           age: res.patient?.age || app.patientDetails?.age || "",
//           gender: res.patient?.gender || app.patientDetails?.gender || "",
//           contact: res.patient?.contact || app.patientDetails?.contact || "",
//           email: res.patient?.email || app.patientDetails?.email || "",
//           sessionType: app.sessionType,
//           medicalHistoryFiles: app.patientDetails?.medicalHistoryFiles || [],
//         },
//       };
//       setSelectedAppointment(enriched);
//     } catch (e) {
//       console.error(e);
//       setSelectedAppointment(app);
//     } finally {
//       setLoadingDetailId(null);
//     }
//   };

//   return (
//     <>
//       <main className="flex-1 p-4 lg:p-6 bg-gray-50/70">
//         <div className="mb-6 lg:mb-8">
//           <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//             Appointments
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Manage your schedule and patient appointments
//           </p>
//         </div>
//         <div className="border-b border-gray-200 mb-6">
//           <nav className="flex space-x-4">
//             <button
//               onClick={() => setActiveTab("upcoming")}
//               className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${
//                 activeTab === "upcoming"
//                   ? "bg-white border-gray-200 border-t border-x text-green-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               <i className="bi bi-calendar-check mr-2"></i>Upcoming Appointments
//             </button>
//             <button
//               onClick={() => setActiveTab("virtual")}
//               className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${
//                 activeTab === "virtual"
//                   ? "bg-white border-gray-200 border-t border-x text-green-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               <i className="bi bi-camera-video mr-2"></i>Virtual Consultation
//             </button>
//             <button
//               onClick={() => setActiveTab("history")}
//               className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${
//                 activeTab === "history"
//                   ? "bg-white border-gray-200 border-t border-x text-green-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               <i className="bi bi-clock-history mr-2"></i>Appointment History
//             </button>
//           </nav>
//         </div>
//         <div className="bg-white p-6 rounded-b-2xl rounded-r-2xl shadow-sm border border-gray-200">
//           {activeTab === "upcoming" && (
//             <UpcomingAppointments
//               appointments={upcomingAppointments}
//               onViewDetails={handleViewDetails}
//               onComplete={handlePrescription}
//               onHandwritten={handleHandwritten}
//             />
//           )}
//           {activeTab === "virtual" && (
//             <VirtualConsultation appointments={virtualAppointments} />
//           )}
//           {activeTab === "history" && (
//             <History
//               appointments={historyAppointments}
//               onViewDetails={handleViewDetails}
//               historyDate={historyDate}
//               setHistoryDate={setHistoryDate}
//             />
//           )}
//         </div>
//       </main>
//       {selectedAppointment && (
//         <AppointmentDetailModal
//           appointment={selectedAppointment}
//           onClose={() => setSelectedAppointment(null)}
//         />
//       )}
//     </>
//   );
// }
"use client";
import { useState, useContext, useEffect } from "react";
import { DoctorModuleContext } from "../DoctorModuleContext";
import UpcomingAppointments from "../../../components/doctor/appointments/UpcomingAppointments";
import VirtualConsultation from "../../../components/doctor/appointments/VirtualConsultation";
import History from "../../../components/doctor/appointments/History";
import AppointmentDetailModal from "../../../components/doctor/appointments/AppointmentDetailModal";
import {
  getAppointmentWithPatientDetails,
  markPrescriptionGiven,
  getDoctorAppointmentHistory,
} from "../../../services/doctorAppointmentsApi";

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loadingDetailId, setLoadingDetailId] = useState(null);
  const [historyDate, setHistoryDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [historyData, setHistoryData] = useState(null);

  const context = useContext(DoctorModuleContext);

  if (!context) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { appointments, setAppointments, handleNavigateToPrescription } =
    context;

  // Mark prescription as completed
  const handlePrescription = async (appointmentId) => {
    try {
      const user =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("hmsUser") || "{}")
          : null;
      if (!user?.hospitalId) return;

      // Mark prescription as given
      await markPrescriptionGiven({
        hospitalId: user.hospitalId,
        appointmentId,
      });

      setAppointments((prev) => {
        const updated = prev.map((app) =>
          app.id === appointmentId ? { ...app, status: "completed" } : app
        );

        // Find the appointment and build a robust patientData object
        const app = updated.find((a) => a.id === appointmentId);
        if (app) {
          const patientData = {
            id: app.id,
            patientName: app.patientName || app.patient_name || "Unknown",
            patientEmail:
              app.patientEmail ||
              app.patientDetails?.email ||
              app.patientDetails?.contact || // fallback if email missing
              "unknown@example.com",
            date: app.date,
            slotStart: app.slotStart,
            slotEnd: app.slotEnd,
            sessionType: app.sessionType || "Consultation",
            status: app.status,
          };

          // Navigate to prescription page safely
          handleNavigateToPrescription(patientData);
        }

        return updated;
      });
    } catch (e) {
      alert("Failed to mark prescription as given");
      console.error(e);
    }
  };

  // Mark handwritten prescription as completed
  const handleHandwritten = (appointmentId) => {
    setAppointments((prev) => {
      const updated = prev.map((app) =>
        app.id === appointmentId ? { ...app, status: "completed" } : app
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("appointments", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const now = new Date();

  // Upcoming appointments: future
  const upcomingAppointments = appointments
    .filter((a) => {
      const start = new Date(`${a.date}T${a.slotStart}`);
      const end = new Date(`${a.date}T${a.slotEnd}`);
      return now < end; // include all future and ongoing appointments
    })
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.slotStart}`) -
        new Date(`${b.date}T${b.slotStart}`)
    );

  // Virtual appointments: future
  const virtualAppointments = appointments.filter(
    (a) => a.type === "virtual" && new Date(`${a.date}T${a.slotStart}`) > now
  );

  // History appointments: past
  const historyAppointments = appointments.filter(
    (a) => new Date(`${a.date}T${a.slotEnd}`) <= now
  );

  // Fetch history data for selected date
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user =
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("hmsUser") || "{}")
            : null;

        // Debug logging
        console.log("=== fetchHistory Debug ===");
        console.log("User from localStorage:", user);
        console.log("hospitalId:", user?.hospitalId);
        console.log("doctorid:", user?.doctorid);
        console.log("historyDate:", historyDate);

        if (!user?.hospitalId || !user?.doctorid) {
          console.error("Missing required user data for history fetch:", {
            hospitalId: user?.hospitalId,
            doctorid: user?.doctorid,
            hasHospitalId: !!user?.hospitalId,
            hasDoctorId: !!user?.doctorid,
          });
          return;
        }

        const res = await getDoctorAppointmentHistory({
          hospitalId: user.hospitalId,
          doctorId: user.doctorid,
          date: historyDate,
        });
        setHistoryData(res?.history || []);
      } catch (e) {
        console.error("Failed to fetch history", e);
        setHistoryData([]);
      }
    };

    if (activeTab === "history") fetchHistory();
  }, [activeTab, historyDate]);

  // View appointment details
  const handleViewDetails = async (app) => {
    try {
      setLoadingDetailId(app.id);
      const res = await getAppointmentWithPatientDetails({
        appointmentId: app.id,
      });
      const enriched = {
        ...app,
        patientDetails: {
          age: res.patient?.age || app.patientDetails?.age || "",
          gender: res.patient?.gender || app.patientDetails?.gender || "",
          contact: res.patient?.contact || app.patientDetails?.contact || "",
          email: res.patient?.email || app.patientDetails?.email || "",
          sessionType: app.sessionType,
          medicalHistoryFiles: app.patientDetails?.medicalHistoryFiles || [],
        },
      };
      setSelectedAppointment(enriched);
    } catch (e) {
      console.error("Failed to fetch appointment details", e);
      setSelectedAppointment(app);
    } finally {
      setLoadingDetailId(null);
    }
  };

  return (
    <>
      <main className="flex-1 p-4 lg:p-6 bg-gray-50/70">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Appointments
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your schedule and patient appointments
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === "upcoming"
                  ? "bg-white border-gray-200 border-t border-x text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className="bi bi-calendar-check mr-2"></i>Upcoming Appointments
            </button>
            <button
              onClick={() => setActiveTab("virtual")}
              className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === "virtual"
                  ? "bg-white border-gray-200 border-t border-x text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className="bi bi-camera-video mr-2"></i>Virtual Consultation
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === "history"
                  ? "bg-white border-gray-200 border-t border-x text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className="bi bi-clock-history mr-2"></i>Appointment History
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-b-2xl rounded-r-2xl shadow-sm border border-gray-200">
          {activeTab === "upcoming" && (
            <UpcomingAppointments
              appointments={upcomingAppointments}
              onViewDetails={handleViewDetails}
              onComplete={handlePrescription}
              onHandwritten={handleHandwritten}
            />
          )}

          {activeTab === "virtual" && (
            <VirtualConsultation appointments={virtualAppointments} />
          )}

          {activeTab === "history" && (
            <History
              appointments={historyAppointments}
              onViewDetails={handleViewDetails}
              historyDate={historyDate}
              setHistoryDate={setHistoryDate}
              historyData={historyData}
            />
          )}
        </div>
      </main>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          loadingDetailId={loadingDetailId}
        />
      )}
    </>
  );
}
