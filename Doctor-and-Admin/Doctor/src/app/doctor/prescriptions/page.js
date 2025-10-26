// "use client";
// import { useEffect, useState, useContext } from "react";
// import { DoctorModuleContext } from "../DoctorModuleContext";
// import PrescriptionForm from "@/components/doctor/prescriptions/PrescriptionForm";
// import PrescriptionHistory from "@/components/doctor/prescriptions/PrescriptionHistory";
// import { fetchPrescriptionHistory } from "@/services/patientRecordApi";
// import PrintTemplate from "@/components/doctor/prescriptions/PrintTemplate";

// export default function PrescriptionsPage() {
//   const { prescriptionContext, prescriptionTab, setPrescriptionTab } = useContext(DoctorModuleContext);
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [activeTab, setActiveTab] = useState("history");
//   const [selectedPrescription, setSelectedPrescription] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [patient, setPatient] = useState(null);

//   // Sync tab with context and localStorage
//   useEffect(() => {
//     if (prescriptionContext) {
//       setPatient(prescriptionContext);
//       setActiveTab("new");
//       setPrescriptionTab("new");
//     } else {
//       const saved = localStorage.getItem("prescriptionContext");
//       const savedTab = localStorage.getItem("prescriptionTab") || "history";
//       if (saved) setPatient(JSON.parse(saved));
//       setActiveTab(savedTab);
//     }
//   }, [prescriptionContext, setPrescriptionTab]);

//   // Load prescription history
//   useEffect(() => {
//     async function loadPrescriptions() {
//       const hmsUser = localStorage.getItem("hmsUser");
//       if (!hmsUser) return;
//       const { doctorid, token } = JSON.parse(hmsUser);
//       if (!doctorid || !token) return;

//       try {
//         const response = await fetchPrescriptionHistory(doctorid, token);
//         const data = Array.isArray(response.data) ? response.data : [];
//         const normalized = data.map((item) => ({
//           ...item,
//           patientName: item.patient_id?.name || "Unknown",
//           patientEmail: item.patient_id?.email || "N/A",
//           doctorName: item.doctor_id?.name || "Dr. Unknown",
//           medicines: Array.isArray(item.prescription) ? item.prescription : [],
//           diagnosis: Array.isArray(item.diagnosis) ? item.diagnosis : item.diagnosis ? [item.diagnosis] : [],
//           symptoms: Array.isArray(item.symptoms) ? item.symptoms : [],
//           tests: Array.isArray(item.recommended_tests) ? item.recommended_tests : [],
//         }));
//         setPrescriptions(normalized);
//       } catch (err) {
//         console.error("Failed to fetch prescription history", err);
//       }
//     }
//     loadPrescriptions();
//   }, []);

//   const filteredPrescriptions = prescriptions.filter((p) => {
//     const name = p.patientName || "";
//     const email = p.patientEmail || "";
//     const diag = Array.isArray(p.diagnosis) ? p.diagnosis.join(" ") : "";
//     return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       diag.toLowerCase().includes(searchTerm.toLowerCase());
//   });

//   return (
//     <main className="flex-1 p-4 lg:p-6 overflow-auto">
//       <div className="mb-6 flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-black">Prescriptions</h1>
//         <button
//           onClick={() => setActiveTab("new")}
//           className="bg-green-600 text-white px-6 py-3 rounded-xl"
//         >
//           + New Prescription
//         </button>
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
//         <div className="border-b border-gray-200">
//           <nav className="flex">
//             <button
//               onClick={() => setActiveTab("history")}
//               className={`px-6 py-4 font-medium border-b-2 ${activeTab === "history" ? "border-green-600 text-green-600" : "border-transparent text-gray-500"}`}
//             >
//               History
//             </button>
//             <button
//               onClick={() => setActiveTab("new")}
//               className={`px-6 py-4 font-medium border-b-2 ${activeTab === "new" ? "border-green-600 text-green-600" : "border-transparent text-gray-500"}`}
//             >
//               New
//             </button>
//           </nav>
//         </div>

//         <div className="p-6">
//           {activeTab === "history" && (
//             <PrescriptionHistory
//               prescriptions={filteredPrescriptions}
//               searchTerm={searchTerm}
//               onSearchChange={setSearchTerm}
//               onView={setSelectedPrescription}
//               onPrint={(p) => console.log("Print:", p)}
//             />
//           )}

//           {activeTab === "new" ? (
//             <PrescriptionForm
//               initialPatientData={patient}
//               onSubmit={(data) => console.log("New prescription:", data)}
//             />
//           ) : activeTab === "new" ? (
//             <div className="text-center py-12 text-red-600">
//               No patient selected. Start from appointment.
//             </div>
//           ) : null}
//         </div>
//       </div>

//       {selectedPrescription && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <PrintTemplate prescription={selectedPrescription} isPrintable={true} />
//             <div className="p-4 flex justify-end gap-2">
//               <button onClick={() => setSelectedPrescription(null)} className="bg-gray-200 px-4 py-2 rounded">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }


// // "use client";
// // import { useEffect, useState, useContext } from "react";
// // import { DoctorModuleContext } from "../DoctorModuleContext";
// // import PrescriptionForm from "@/components/doctor/prescriptions/PrescriptionForm";
// // import PrescriptionHistory from "@/components/doctor/prescriptions/PrescriptionHistory";
// // import { fetchPrescriptionHistory } from "@/services/patientRecordApi";
// // import PrintTemplate from "@/components/doctor/prescriptions/PrintTemplate";

// // export default function PrescriptionsPage() {
// //   const {
// //     prescriptionContext,
// //     setPrescriptionContext,
// //     prescriptionTab,
// //     setPrescriptionTab,
// //   } = useContext(DoctorModuleContext);

// //   const [prescriptions, setPrescriptions] = useState([]);
// //   const [activeTab, setActiveTab] = useState(prescriptionTab || "history");
// //   const [selectedPrescription, setSelectedPrescription] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState("");

// //   // Restore context from localStorage on mount
// //   useEffect(() => {
// //     if (!prescriptionContext && typeof window !== "undefined") {
// //       const savedPatient = localStorage.getItem("prescriptionContext");
// //       const savedTab = localStorage.getItem("prescriptionTab") || "history";
// //       if (savedPatient) setPrescriptionContext(JSON.parse(savedPatient));
// //       setPrescriptionTab(savedTab);
// //       setActiveTab(savedTab);
// //     } else {
// //       setActiveTab(prescriptionTab || "history");
// //     }
// //   }, [prescriptionContext, prescriptionTab]);

// //   // Load prescription history function
// //   const loadPrescriptions = async () => {
// //     if (typeof window === "undefined") return;
// //     const hmsUser = localStorage.getItem("hmsUser");
// //     if (!hmsUser) return;
// //     const { doctorid, token } = JSON.parse(hmsUser);
// //     if (!doctorid || !token) return;

// //     try {
// //       const response = await fetchPrescriptionHistory(doctorid, token);
// //       const data = Array.isArray(response.data) ? response.data : [];

// //       const normalized = data.map((item) => ({
// //         ...item,
// //         patientName: item.patient_id?.name || "Unknown",
// //         patientEmail: item.patient_id?.email || "N/A",
// //         doctorName: item.doctor_id?.name || "Dr. Unknown",
// //         medicines: Array.isArray(item.prescription) ? item.prescription : [],
// //         diagnosis: Array.isArray(item.diagnosis)
// //           ? item.diagnosis
// //           : item.diagnosis
// //           ? [item.diagnosis]
// //           : [],
// //         symptoms: Array.isArray(item.symptoms) ? item.symptoms : [],
// //         tests: Array.isArray(item.recommended_tests)
// //           ? item.recommended_tests
// //           : [],
// //       }));

// //       setPrescriptions(normalized);
// //     } catch (err) {
// //       console.error("Failed to fetch prescription history", err);
// //       // Set empty array on error to prevent UI issues
// //       setPrescriptions([]);
// //     }
// //   };

// //   // Load prescription history on component mount
// //   useEffect(() => {
// //     loadPrescriptions();
// //   }, []);

// //   const filteredPrescriptions = prescriptions.filter((p) => {
// //     const name = p.patientName || "";
// //     const email = p.patientEmail || "";
// //     const diag = Array.isArray(p.diagnosis) ? p.diagnosis.join(" ") : "";
// //     return (
// //       name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       email.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       diag.toLowerCase().includes(searchTerm.toLowerCase())
// //     );
// //   });

// //   return (
// //     <main className="flex-1 p-4 lg:p-6 overflow-auto">
// //       <div className="mb-6 flex justify-between items-center">
// //         <h1 className="text-2xl font-bold">Prescriptions</h1>
// //         <button
// //           onClick={() => {
// //             setActiveTab("new");
// //             setPrescriptionTab("new");
// //           }}
// //           className="bg-green-600 text-white px-6 py-3 rounded-xl"
// //         >
// //           + New Prescription
// //         </button>
// //       </div>

// //       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
// //         <div className="border-b border-gray-200">
// //           <nav className="flex">
// //             <button
// //               onClick={() => {
// //                 setActiveTab("history");
// //                 setPrescriptionTab("history");
// //               }}
// //               className={`px-6 py-4 font-medium border-b-2 ${
// //                 activeTab === "history"
// //                   ? "border-green-600 text-green-600"
// //                   : "border-transparent text-gray-500"
// //               }`}
// //             >
// //               History
// //             </button>
// //             <button
// //               onClick={() => {
// //                 setActiveTab("new");
// //                 setPrescriptionTab("new");
// //               }}
// //               className={`px-6 py-4 font-medium border-b-2 ${
// //                 activeTab === "new"
// //                   ? "border-green-600 text-green-600"
// //                   : "border-transparent text-gray-500"
// //               }`}
// //             >
// //               New
// //             </button>
// //           </nav>
// //         </div>

// //         <div className="p-6">
// //           {activeTab === "history" && (
// //             <PrescriptionHistory
// //               prescriptions={filteredPrescriptions}
// //               searchTerm={searchTerm}
// //               onSearchChange={setSearchTerm}
// //               onView={setSelectedPrescription}
// //               onPrint={(p) => console.log("Print:", p)}
// //             />
// //           )}

// //           {activeTab === "new" && prescriptionContext?.patientEmail ? (
// //             <PrescriptionForm
// //               initialPatientData={prescriptionContext}
// //               onSubmit={(data) => {
// //                 console.log("New prescription submitted:", data);
// //                 // Refresh prescription history after creating new prescription
// //                 loadPrescriptions();
// //                 // Switch back to history tab
// //                 setActiveTab("history");
// //                 setPrescriptionTab("history");
// //               }}
// //               onCancel={() => {
// //                 setActiveTab("history");
// //                 setPrescriptionTab("history");
// //               }}
// //             />
// //           ) : activeTab === "new" ? (
// //             <div className="text-center py-12 text-red-600">
// //               No patient selected. Start from appointment.
// //             </div>
// //           ) : null}
// //         </div>
// //       </div>

// //       {selectedPrescription && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
// //             <PrintTemplate
// //               prescription={selectedPrescription}
// //               isPrintable={true}
// //             />
// //             <div className="p-4 flex justify-end gap-2">
// //               <button
// //                 onClick={() => setSelectedPrescription(null)}
// //                 className="bg-gray-200 px-4 py-2 rounded"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </main>
// //   );
// // }
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
