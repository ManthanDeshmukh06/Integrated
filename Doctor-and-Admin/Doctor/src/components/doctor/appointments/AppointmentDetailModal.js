import React from "react";

// Helper function to get an icon based on file extension
const getFileIcon = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  switch (extension) {
    case "pdf":
      return "bi-file-earmark-pdf-fill text-red-500";
    case "jpg":
    case "jpeg":
    case "png":
      return "bi-file-earmark-image-fill text-blue-500";
    default:
      return "bi-file-earmark-fill text-gray-500";
  }
};

export default function AppointmentDetailModal({ appointment, patientDocuments, onClose }) {
  if (!appointment) return null;

  const { patientName, date, time, type, sessionType, status } = appointment;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <i className="bi bi-x-lg text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Appointment Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
              Appointment Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-900">
              <div>
                <strong>Patient Name:</strong> {patientName || "N/A"}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div>
                <strong>Time:</strong> {time || "N/A"}
              </div>
              <div>
                <strong>Type:</strong> {type?.replace("-", " ") || "N/A"}
              </div>
              <div>
                <strong>Session Type:</strong> {sessionType || "N/A"}
              </div>
              <div>
                <strong>Status:</strong> {status || "N/A"}
              </div>
            </div>
          </div>

          {/* Medical History Files */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
              Medical History Files
            </h3>
            {patientDocuments && patientDocuments.length > 0 ? (
              <div className="space-y-2">
                {patientDocuments.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <i className={`bi ${getFileIcon(file.name)} text-2xl mr-3`}></i>
                    <span className="text-sm font-medium text-gray-800">
                      {file.name}
                    </span>
                    <i className="bi bi-box-arrow-up-right text-gray-400 ml-auto"></i>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No medical history files uploaded.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
// import React from "react";

// // Helper function to get an icon based on file extension
// const getFileIcon = (fileName) => {
//   const extension = fileName.split(".").pop().toLowerCase();
//   switch (extension) {
//     case "pdf":
//       return "bi-file-earmark-pdf-fill text-red-500";
//     case "jpg":
//     case "jpeg":
//     case "png":
//       return "bi-file-earmark-image-fill text-blue-500";
//     default:
//       return "bi-file-earmark-fill text-gray-500";
//   }
// };

// export default function AppointmentDetailModal({ appointment, patientDocuments, onClose }) {
//   if (!appointment) return null;

//   const {
//     patientName,
//     patientEmail,
//     patientPhone,
//     patientGender,
//     patientAge,
//     date,
//     slotStart,
//     slotEnd,
//     type,
//     sessionType,
//     status,
//     department,
//     reason,
//     slotDuration,
//     is_prescription,
//     createdAt,
//   } = appointment;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//         {/* Header */}
//         <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
//           >
//             <i className="bi bi-x-lg text-xl"></i>
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-6">
//           {/* Appointment Info */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
//               Appointment Information
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-900">
//               <div><strong>Patient Name:</strong> {patientName || "N/A"}</div>
//               <div><strong>Email:</strong> {patientEmail || "N/A"}</div>
//               <div><strong>Phone:</strong> {patientPhone || "N/A"}</div>
//               <div><strong>Gender:</strong> {patientGender || "N/A"}</div>
//               <div><strong>Age:</strong> {patientAge || "N/A"}</div>
//               <div><strong>Date:</strong> {new Date(date).toLocaleDateString("en-US", {
//                 year: "numeric", month: "long", day: "numeric"
//               })}</div>
//               <div><strong>Time:</strong> {slotStart && slotEnd ? `${slotStart} - ${slotEnd}` : "N/A"}</div>
//               <div><strong>Type:</strong> {type?.replace("-", " ") || "N/A"}</div>
//               <div><strong>Session Type:</strong> {sessionType || "N/A"}</div>
//               <div><strong>Status:</strong> {status || "N/A"}</div>
//               <div><strong>Department:</strong> {department || "N/A"}</div>
//               <div><strong>Reason:</strong> {reason || "N/A"}</div>
//               <div><strong>Slot Duration:</strong> {slotDuration ? `${slotDuration} mins` : "N/A"}</div>
//               <div><strong>Prescription Created:</strong> {is_prescription ? "Yes" : "No"}</div>
//               <div><strong>Created At:</strong> {createdAt ? new Date(createdAt).toLocaleString() : "N/A"}</div>
//             </div>
//           </div>

//           {/* Medical History Files */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
//               Medical History Files
//             </h3>
//             {patientDocuments && patientDocuments.length > 0 ? (
//               <div className="space-y-2">
//                 {patientDocuments.map((file, index) => (
//                   <a
//                     key={index}
//                     href={file.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <i className={`bi ${getFileIcon(file.name)} text-2xl mr-3`}></i>
//                     <span className="text-sm font-medium text-gray-800">{file.name}</span>
//                     <i className="bi bi-box-arrow-up-right text-gray-400 ml-auto"></i>
//                   </a>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500 italic">
//                 No medical history files uploaded.
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-200 text-right">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useEffect } from "react";

// // 🧩 Helper to get icon based on file extension
// const getFileIcon = (fileName = "") => {
//   const ext = fileName.split(".").pop().toLowerCase();
//   switch (ext) {
//     case "pdf":
//       return "bi-file-earmark-pdf-fill text-red-500";
//     case "jpg":
//     case "jpeg":
//     case "png":
//       return "bi-file-earmark-image-fill text-blue-500";
//     default:
//       return "bi-file-earmark-fill text-gray-500";
//   }
// };

// export default function AppointmentDetailModal({
//   appointment,
//   patientDocuments = [],
//   onClose,
// }) {
//   // 🧠 Debug logs
//   useEffect(() => {
//     console.group("📋 Appointment Modal Debug");
//     console.log("Appointment object:", appointment);
//     console.log("Patient Documents:", patientDocuments);
//     console.groupEnd();
//   }, [appointment, patientDocuments]);

//   if (!appointment) return null;

//   // Destructure safely with fallbacks
//   const {
//     patientName = "N/A",
//     patientEmail = "N/A",
//     patientPhone = "N/A",
//     patientGender = "N/A",
//     patientAge = "N/A",
//     date = null,
//     slotStart = null,
//     slotEnd = null,
//     type = "N/A",
//     sessionType = "N/A",
//     status = "N/A",
//     department = "N/A",
//     reason = "N/A",
//     slotDuration = null,
//     is_prescription = false,
//     createdAt = null,
//   } = appointment || {};

//   // Log key values for debugging
//   console.table({
//     patientName,
//     patientEmail,
//     patientPhone,
//     patientGender,
//     patientAge,
//     date,
//     slotStart,
//     slotEnd,
//     type,
//     sessionType,
//     status,
//     department,
//     reason,
//     slotDuration,
//     is_prescription,
//     createdAt,
//   });

//   // Formatters
//   const formatDate = (d) => {
//     if (!d) return "N/A";
//     try {
//       return new Date(d).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });
//     } catch {
//       return "N/A";
//     }
//   };

//   const formatDateTime = (dt) => {
//     if (!dt) return "N/A";
//     try {
//       return new Date(dt).toLocaleString("en-US");
//     } catch {
//       return "N/A";
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//         {/* Header */}
//         <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-800">
//             Appointment Details
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
//           >
//             <i className="bi bi-x-lg text-xl"></i>
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-6">
//           {/* Appointment Info */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
//               Appointment Information
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-900">
//               <div>
//                 <strong>Patient Name:</strong> {patientName}
//               </div>
//               <div>
//                 <strong>Email:</strong> {patientEmail}
//               </div>
//               <div>
//                 <strong>Phone:</strong> {patientPhone}
//               </div>
//               <div>
//                 <strong>Gender:</strong> {patientGender}
//               </div>
//               <div>
//                 <strong>Age:</strong> {patientAge || "N/A"}
//               </div>
//               <div>
//                 <strong>Date:</strong> {formatDate(date)}
//               </div>
//               <div>
//                 <strong>Time:</strong>{" "}
//                 {slotStart && slotEnd ? `${slotStart} - ${slotEnd}` : "N/A"}
//               </div>
//               <div>
//                 <strong>Type:</strong> {type?.replace("-", " ") || "N/A"}
//               </div>
//               <div>
//                 <strong>Session Type:</strong> {sessionType}
//               </div>
//               <div>
//                 <strong>Status:</strong> {status}
//               </div>
//               <div>
//                 <strong>Department:</strong> {department}
//               </div>
//               <div>
//                 <strong>Reason:</strong> {reason}
//               </div>
//               <div>
//                 <strong>Slot Duration:</strong>{" "}
//                 {slotDuration ? `${slotDuration} mins` : "N/A"}
//               </div>
//               <div>
//                 <strong>Prescription Created:</strong>{" "}
//                 {is_prescription ? "Yes" : "No"}
//               </div>
//               <div>
//                 <strong>Created At:</strong> {formatDateTime(createdAt)}
//               </div>
//             </div>
//           </div>

//           {/* Medical History Files */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
//               Medical History Files
//             </h3>

//             {Array.isArray(patientDocuments) && patientDocuments.length > 0 ? (
//               <div className="space-y-2">
//                 {patientDocuments.map((file, index) => (
//                   <a
//                     key={index}
//                     href={file.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <i
//                       className={`bi ${getFileIcon(file.name)} text-2xl mr-3`}
//                     ></i>
//                     <span className="text-sm font-medium text-gray-800">
//                       {file.name || `File ${index + 1}`}
//                     </span>
//                     <i className="bi bi-box-arrow-up-right text-gray-400 ml-auto"></i>
//                   </a>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500 italic">
//                 No medical history files uploaded.
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-200 text-right">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
