// // "use client";

// // export default function PrintTemplate({ prescription, isPrintable = false }) {
// //   if (!prescription) return null;

// //   return (
// //     <div id={isPrintable ? "printable-prescription" : ""} className="bg-white p-8">
// //       {/* Header */}
// //       <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
// //         <h1 className="text-3xl font-bold text-gray-800 mb-2">MEDICAL PRESCRIPTION</h1>
// //         <div className="flex justify-between items-center text-sm text-gray-600">
// //           <div className="text-left">
// //             <p><strong>Hospital:</strong> City General Hospital</p>
// //             <p>123 Healthcare Avenue, Medical City</p>
// //           </div>
// //           <div className="text-right">
// //             <p><strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
// //             <p><strong>Prescription ID:</strong> {prescription.prescriptionId}</p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Patient Information */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
// //           PATIENT INFORMATION
// //         </h2>
// //         <div className="grid grid-cols-2 gap-4 text-sm">
// //           <div>
// //             <strong>Name:</strong> {prescription.patientName}
// //           </div>
// //           <div>
// //             <strong>Patient ID:</strong> {prescription.patientId}
// //           </div>
// //           <div>
// //             <strong>Email:</strong> {prescription.patientEmail}
// //           </div>
// //           <div>
// //             <strong>Doctor:</strong> {prescription.doctorName || "Dr. Sarah Wilson"}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Symptoms */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
// //           SYMPTOMS
// //         </h2>
// //         <div className="flex flex-wrap gap-2">
// //           {prescription.symptoms.map((symptom, index) => (
// //             <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm">
// //               {symptom}
// //             </span>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Diagnosis */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
// //           DIAGNOSIS
// //         </h2>
// //         <div className="flex flex-wrap gap-2">
// //           {prescription.diagnosis.map((diag, index) => (
// //             <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm">
// //               {diag}
// //             </span>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Medicines */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
// //           PRESCRIBED MEDICINES
// //         </h2>
// //         <div className="space-y-3">
// //           {prescription.medicines.map((medicine, index) => (
// //             <div key={index} className="border border-gray-200 rounded-lg p-4">
// //               <div className="flex justify-between items-start">
// //                 <div className="flex-1">
// //                   <h3 className="font-bold text-lg text-gray-800">{medicine.medicine_name}</h3>
// //                   <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
// //                     <div><strong>Dosage:</strong> {medicine.dosage}</div>
// //                     <div><strong>Frequency:</strong> {medicine.frequency}</div>
// //                     <div><strong>Duration:</strong> {medicine.duration}</div>
// //                     {medicine.instructions && (
// //                       <div><strong>Instructions:</strong> {medicine.instructions}</div>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Recommended Tests */}
// //       {prescription.tests && prescription.tests.length > 0 && (
// //         <div className="mb-6">
// //           <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
// //             RECOMMENDED TESTS
// //           </h2>
// //           <ul className="list-disc list-inside space-y-1">
// //             {prescription.tests.map((test, index) => (
// //               <li key={index} className="text-gray-700">{test}</li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}

// //       {/* Notes & Instructions */}
// //       {prescription.notes && (
// //         <div className="mb-6">
// //           <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
// //             ADDITIONAL NOTES & INSTRUCTIONS
// //           </h2>
// //           <p className="text-gray-700 whitespace-pre-wrap">{prescription.notes}</p>
// //         </div>
// //       )}

// //       {/* Follow-up */}
// //       {prescription.followUpDate && (
// //         <div className="mb-6">
// //           <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
// //             FOLLOW-UP
// //           </h2>
// //           <p className="text-gray-700">
// //             <strong>Next Appointment:</strong> {new Date(prescription.followUpDate).toLocaleDateString()}
// //           </p>
// //         </div>
// //       )}

// //       {/* Footer */}
// //       <div className="mt-12 pt-6 border-t-2 border-gray-300">
// //         <div className="flex justify-between items-end">
// //           <div className="text-center">
// //             <div className="border-t border-gray-400 pt-2 mt-8 w-48">
// //               <p className="font-bold">Dr. Sarah Wilson</p>
// //               <p className="text-sm text-gray-600">Cardiologist</p>
// //               <p className="text-sm text-gray-600">License: MED123456</p>
// //             </div>
// //           </div>
// //           <div className="text-center">
// //             <div className="border-t border-gray-400 pt-2 mt-8 w-48">
// //               <p className="font-bold">Patient Signature</p>
// //               <p className="text-sm text-gray-600">Date: ________________</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Print Notice */}
// //       <div className="text-center text-xs text-gray-500 mt-8">
// //         <p>This is a computer-generated prescription. No physical signature required.</p>
// //         <p>Generated on: {new Date().toLocaleString()}</p>
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// export default function PrintTemplate({ prescription, isPrintable = false }) {
//   if (!prescription) return null;

//   return (
//     <div id={isPrintable ? "printable-prescription" : ""} className="bg-white p-8">
//       {/* Header */}
//       <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">MEDICAL PRESCRIPTION</h1>
//         <div className="flex justify-between items-center text-sm text-gray-600">
//           <div className="text-left">
//             <p><strong>Hospital:</strong> City General Hospital</p>
//             <p>123 Healthcare Avenue, Medical City</p>
//           </div>
//           <div className="text-right">
//             <p><strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
//             <p>
//               <strong
//                 className={`${prescription.status === "active" ? "text-green-600" : "text-blue-600"}`}
//               >
//                 {(prescription.status || "N/A").toUpperCase()}
//               </strong>
//             </p>
//             <p><strong>Prescription ID:</strong> {prescription.prescriptionId || "N/A"}</p>
//           </div>
//         </div>
//       </div>

//       {/* Patient Information */}
//       <div className="mb-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
//           PATIENT INFORMATION
//         </h2>
//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <div><strong>Name:</strong> {prescription.patientName || "N/A"}</div>
//           <div><strong>Patient ID:</strong> {prescription.patientId || "N/A"}</div>
//           <div><strong>Email:</strong> {prescription.patientEmail || "N/A"}</div>
//           <div><strong>Doctor:</strong> {prescription.doctorName || "Dr. Sarah Wilson"}</div>
//         </div>
//       </div>

//       {/* Symptoms */}
//       <div className="mb-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
//           SYMPTOMS
//         </h2>
//         <div className="flex flex-wrap gap-2">
//           {(Array.isArray(prescription.symptoms) ? prescription.symptoms : []).map((symptom, i) => (
//             <span key={i} className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm">
//               {symptom}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Diagnosis */}
//       <div className="mb-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
//           DIAGNOSIS
//         </h2>
//         <div className="flex flex-wrap gap-2">
//           {Array.isArray(prescription.diagnosis)
//             ? prescription.diagnosis.map((diag, i) => (
//                 <span key={i} className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm">
//                   {diag}
//                 </span>
//               ))
//             : prescription.diagnosis
//             ? <span className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm">{prescription.diagnosis}</span>
//             : "N/A"}
//         </div>
//       </div>

//       {/* Medicines */}
//       <div className="mb-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
//           PRESCRIBED MEDICINES
//         </h2>
//         <div className="space-y-3">
//           {(Array.isArray(prescription.medicines) ? prescription.medicines : []).map((med, i) => (
//             <div key={i} className="border border-gray-200 rounded-lg p-4">
//               <h3 className="font-bold text-lg text-gray-800">{med.medicine_name}</h3>
//               <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
//                 <div><strong>Dosage:</strong> {med.dosage || "N/A"}</div>
//                 <div><strong>Frequency:</strong> {med.frequency || "N/A"}</div>
//                 <div><strong>Duration:</strong> {med.duration || "N/A"}</div>
//                 {med.instructions && <div><strong>Instructions:</strong> {med.instructions}</div>}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Recommended Tests */}
//       {Array.isArray(prescription.tests) && prescription.tests.length > 0 && (
//         <div className="mb-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
//             RECOMMENDED TESTS
//           </h2>
//           <ul className="list-disc list-inside space-y-1">
//             {prescription.tests.map((test, i) => (
//               <li key={i} className="text-gray-700">{test}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Notes */}
//       {prescription.notes && (
//         <div className="mb-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
//             ADDITIONAL NOTES & INSTRUCTIONS
//           </h2>
//           <p className="text-gray-700 whitespace-pre-wrap">{prescription.notes}</p>
//         </div>
//       )}

//       {/* Follow-up */}
//       {prescription.followUpDate && (
//         <div className="mb-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
//             FOLLOW-UP
//           </h2>
//           <p className="text-gray-700">
//             <strong>Next Appointment:</strong> {new Date(prescription.followUpDate).toLocaleDateString()}
//           </p>
//         </div>
//       )}

//       {/* Footer */}
//       <div className="mt-12 pt-6 border-t-2 border-gray-300">
//         <div className="flex justify-between items-end">
//           <div className="text-center">
//             <div className="border-t border-gray-400 pt-2 mt-8 w-48">
//               <p className="font-bold">Dr. Sarah Wilson</p>
//               <p className="text-sm text-gray-600">Cardiologist</p>
//               <p className="text-sm text-gray-600">License: MED123456</p>
//             </div>
//           </div>
//           <div className="text-center">
//             <div className="border-t border-gray-400 pt-2 mt-8 w-48">
//               <p className="font-bold">Patient Signature</p>
//               <p className="text-sm text-gray-600">Date: ________________</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="text-center text-xs text-gray-500 mt-8">
//         <p>This is a computer-generated prescription. No physical signature required.</p>
//         <p>Generated on: {new Date().toLocaleString()}</p>
//       </div>
//     </div>
//   );
// }
"use client";

export default function PrintTemplate({ prescription, isPrintable = false }) {
  if (!prescription) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Normalize medicines and diagnosis
  const medicines = Array.isArray(prescription.medicines)
    ? prescription.medicines
    : Array.isArray(prescription.prescription)
    ? prescription.prescription
    : [];

  const diagnosis = Array.isArray(prescription.diagnosis)
    ? prescription.diagnosis
    : prescription.diagnosis
    ? [prescription.diagnosis]
    : [];

  const symptoms = Array.isArray(prescription.symptoms)
    ? prescription.symptoms
    : [];

  const tests = Array.isArray(prescription.tests)
    ? prescription.tests
    : Array.isArray(prescription.recommended_tests)
    ? prescription.recommended_tests
    : [];

  const patientName =
    prescription.patientName ||
    prescription.patient_id?.name ||
    "Unknown Patient";
  const patientEmail =
    prescription.patientEmail ||
    prescription.patient_id?.email ||
    "N/A";

  const doctorName =
    prescription.doctorName || prescription.doctor_id?.name || "Dr. Unknown";

  return (
    <div id="printable-prescription" className={`bg-white ${isPrintable ? "p-8" : "p-6"}`}>
      {/* Hospital Header */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">MERAKI HOSPITAL</h1>
        <p className="text-gray-600">123 Healthcare Avenue, Medical City, MC 12345</p>
        <p className="text-gray-600">Phone: (555) 123-4567 | Email: info@merakihospital.com</p>
        <p className="text-gray-600">www.merakihospital.com</p>
      </div>

      {/* Prescription Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">MEDICAL PRESCRIPTION</h2>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Prescription ID: <strong>{prescription.prescriptionId || prescription._id}</strong></p>
            <p>Date: <strong>{formatDate(prescription.date || prescription.visit_date)}</strong></p>
            <p>Status:{" "}
              <strong className={`${prescription.status === "active" ? "text-green-600" : "text-blue-600"}`}>
                {prescription.status ? prescription.status.toUpperCase() : "N/A"}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* Patient & Doctor Information */}
      <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-300 pb-1">PATIENT INFORMATION</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Full Name:</span><span className="font-semibold text-gray-800">{patientName}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Patient Email:</span><span className="font-semibold text-gray-800">{patientEmail}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Date of Visit:</span><span className="font-semibold text-gray-800">{formatDate(prescription.date || prescription.visit_date)}</span></div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-300 pb-1">DOCTOR INFORMATION</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Doctor:</span><span className="font-semibold text-gray-800">{doctorName}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Hospital:</span><span className="font-semibold text-gray-800">Meraki Hospital</span></div>
          </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-300 pb-1">DIAGNOSIS & CLINICAL FINDINGS</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-wrap gap-2">
            {diagnosis.length > 0 ? diagnosis.map((d, i) => (
              <span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">{d}</span>
            )) : <span>N/A</span>}
          </div>
        </div>
      </div>

      {/* Medicines */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-300 pb-1">PRESCRIBED MEDICATIONS</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r border-gray-200">Medicine</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 border-r border-gray-200 w-20">Dosage</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 border-r border-gray-200 w-24">Frequency</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 w-20">Duration</th>
              </tr>
            </thead>
            <tbody>
              {medicines.length > 0 ? medicines.map((m, idx) => (
                <tr key={idx} className="border-b border-gray-200 last:border-b-0">
                  <td className="px-4 py-3 border-r border-gray-200">
                    <div className="font-semibold text-gray-800">{m.medicine_name || m.name}</div>
                    {m.instructions && <div className="text-xs text-gray-600 mt-1">{m.instructions}</div>}
                  </td>
                  <td className="px-4 py-3 text-center border-r border-gray-200">{m.dosage}</td>
                  <td className="px-4 py-3 text-center border-r border-gray-200">{m.frequency}</td>
                  <td className="px-4 py-3 text-center">{m.duration}</td>
                </tr>
              )) : <tr><td colSpan={4} className="text-center p-4 text-gray-500">No medicines prescribed</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tests */}
      {tests.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-300 pb-1">RECOMMENDED INVESTIGATIONS</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {tests.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Notes */}
      {prescription.notes && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-300 pb-1">NOTES & INSTRUCTIONS</h3>
          <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{prescription.notes}</p>
        </div>
      )}
    </div>
  );
}
