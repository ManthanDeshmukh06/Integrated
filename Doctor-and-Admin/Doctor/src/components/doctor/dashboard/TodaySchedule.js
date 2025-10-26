// "use client";
// import { useState, useContext, useMemo } from "react";
// import { DoctorModuleContext } from "../../../app/doctor/DoctorModuleContext";

// export default function TodaySchedule() {
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [view, setView] = useState("list"); // list, timeline
//   const context = useContext(DoctorModuleContext);
//   const appointments = context?.appointments || [];
//   const today = new Date().toISOString().split("T")[0];
//   const todaySchedule = useMemo(() => {
//     const todays = appointments.filter((a) => a.date === today).slice();
//     todays.sort((a, b) => {
//       const at = a.slotStart || a.time || "";
//       const bt = b.slotStart || b.time || "";
//       return at.localeCompare(bt);
//     });
//     return todays.map((a) => ({
//       id: a.id,
//       patientName: a.patientName,
//       condition: a.sessionType || "Consultation",
//       type: a.appointmentType || a.type || "consultation",
//       typeLabel: (a.appointmentType || a.type || "consultation").replace(
//         "-",
//         " "
//       ),
//       time: a.time,
//       duration: a.slotDuration ? `${a.slotDuration} min` : "",
//       location: a.type === "virtual" ? "Online" : "Hospital",
//       isVideo: a.type === "virtual",
//       status: a.status || "scheduled",
//       patientId: a.patientDetails?.patientId || a.id,
//       notes: "",
//     }));
//   }, [appointments, today]);

//   const joinVideoCall = (appointmentId) => {
//     console.log(`Joining video call for appointment ${appointmentId}`);
//     // Redirect to video consultation page
//     // router.push(`/doctor/video-consult/${appointmentId}`);
//   };

//   const getAppointmentTypeColor = (type) => {
//     const colors = {
//       "new-patient": "bg-blue-100 text-blue-700 border-blue-200",
//       "follow-up": "bg-green-100 text-green-700 border-green-200",
//       consultation: "bg-purple-100 text-purple-700 border-purple-200",
//       procedure: "bg-orange-100 text-orange-700 border-orange-200",
//     };
//     return colors[type] || colors.consultation;
//   };

//   return (
//     <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-4 lg:p-6 h-full">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4 lg:mb-6">
//         <div>
//           <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
//             Today's Schedule
//           </h2>
//           <p className="text-sm text-gray-500">
//             {todaySchedule.length} appointments
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setView(view === "list" ? "timeline" : "list")}
//             className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
//           >
//             <i className={`bi bi-${view === "list" ? "clock" : "list"}`}></i>
//             {view === "list" ? "Timeline" : "List"}
//           </button>
//         </div>
//       </div>

//       {/* Schedule Content */}
//       {view === "list" ? (
//         <div className="space-y-4">
//           {todaySchedule.map((appointment) => (
//             <div
//               key={appointment.id}
//               className="p-3 rounded-xl bg-white/60 border border-gray-200/60 hover:shadow-md transition-all duration-200 group cursor-pointer"
//               onClick={() => setSelectedAppointment(appointment)}
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-3">
//                   <div
//                     className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                       appointment.isVideo
//                         ? "bg-purple-100 text-purple-600"
//                         : "bg-green-100 text-green-600"
//                     }`}
//                   >
//                     <i
//                       className={`bi bi-${
//                         appointment.isVideo ? "camera-video" : "calendar-check"
//                       } text-lg`}
//                     ></i>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-800">
//                       {appointment.patientName}
//                     </h3>
//                     <p className="text-xs text-gray-500">
//                       {appointment.condition}
//                     </p>
//                   </div>
//                 </div>
//                 <span
//                   className={`text-xs font-medium px-2 py-1 rounded-full border ${getAppointmentTypeColor(
//                     appointment.type
//                   )}`}
//                 >
//                   {appointment.typeLabel}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between text-sm text-gray-600">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-1">
//                     <i className="bi bi-clock"></i>
//                     {appointment.time} ({appointment.duration})
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <i className="bi bi-geo-alt"></i>
//                     {appointment.location}
//                   </div>
//                 </div>
//                 {appointment.isVideo && appointment.status === "confirmed" && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       joinVideoCall(appointment.id);
//                     }}
//                     className="text-green-600 hover:text-green-700 text-xs font-medium flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg"
//                   >
//                     <i className="bi bi-camera-video"></i>.
//                   </button>
//                 )}
//               </div>

//               {appointment.notes && (
//                 <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
//                   <i className="bi bi-info-circle mr-1"></i>
//                   {appointment.notes}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {todaySchedule.map((appointment) => (
//             <div key={appointment.id} className="flex items-center gap-3 p-2">
//               <div className="w-16 text-sm font-medium text-gray-600">
//                 {appointment.time}
//               </div>
//               <div
//                 className={`flex-1 p-3 rounded-xl border-l-4 ${
//                   appointment.type === "new-patient"
//                     ? "border-l-blue-500 bg-blue-50"
//                     : appointment.type === "follow-up"
//                     ? "border-l-green-500 bg-green-50"
//                     : appointment.type === "procedure"
//                     ? "border-l-orange-500 bg-orange-50"
//                     : "border-l-purple-500 bg-purple-50"
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h4 className="font-semibold text-gray-800">
//                       {appointment.patientName}
//                     </h4>
//                     <p className="text-xs text-gray-600">
//                       {appointment.condition}
//                     </p>
//                   </div>
//                   {appointment.isVideo && (
//                     <i className="bi bi-camera-video text-purple-600"></i>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Footer */}
//       <div className="mt-4 pt-4 border-t border-gray-200/60">
//         <div className="flex items-center justify-between text-sm">
//           {/* <span className="text-gray-600">Next available slot:</span>
//           <span className="font-semibold text-green-600">03:00 PM Today</span> */}
//         </div>
//       </div>

//       {/* Appointment Detail Modal */}
//       {selectedAppointment && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Appointment Details
//               </h3>
//               <button
//                 onClick={() => setSelectedAppointment(null)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <div
//                   className={`w-12 h-12 rounded-xl flex items-center justify-center ${
//                     selectedAppointment.isVideo
//                       ? "bg-purple-100 text-purple-600"
//                       : "bg-green-100 text-green-600"
//                   }`}
//                 >
//                   <i
//                     className={`bi bi-${
//                       selectedAppointment.isVideo ? "camera-video" : "person"
//                     } text-xl`}
//                   ></i>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-800">
//                     {selectedAppointment.patientName}
//                   </h4>
//                   <p className="text-sm text-gray-500">
//                     Patient ID: {selectedAppointment.patientId}
//                   </p>
//                   <span
//                     className={`text-xs font-medium px-2 py-1 rounded-full ${getAppointmentTypeColor(
//                       selectedAppointment.type
//                     )}`}
//                   >
//                     {selectedAppointment.typeLabel}
//                   </span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <div className="text-xs text-gray-500">Time</div>
//                   <div className="font-semibold text-gray-800">
//                     {selectedAppointment.time}
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded-lg">
//                   <div className="text-xs text-gray-500">Location</div>
//                   <div className="font-semibold text-gray-800">
//                     {selectedAppointment.location}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <div className="text-sm font-medium text-gray-700 mb-2">
//                   Condition & Notes
//                 </div>
//                 <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm">
//                   {selectedAppointment.condition}
//                   {selectedAppointment.notes && (
//                     <div className="mt-1 text-xs opacity-75">
//                       {selectedAppointment.notes}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 {selectedAppointment.isVideo ? (
//                   <button
//                     onClick={() => joinVideoCall(selectedAppointment.id)}
//                     className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
//                   >
//                     <i className="bi bi-camera-video"></i>
//                     Join Video Call
//                   </button>
//                 ) : (
//                   <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
//                     Start Consultation
//                   </button>
//                 )}
//                 <button
//                   onClick={() => setSelectedAppointment(null)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { useContext, useMemo } from "react";
import { DoctorModuleContext } from "../../../app/doctor/DoctorModuleContext";

export default function TodaySchedule() {
  const context = useContext(DoctorModuleContext);
  const appointments = context?.appointments || [];
  const today = new Date().toISOString().split("T")[0];

  const todaySchedule = useMemo(() => {
    const todays = appointments.filter((a) => a.date === today).slice();
    todays.sort((a, b) => (a.slotStart || "").localeCompare(b.slotStart || ""));
    return todays.map((a, index) => ({
      _id: a._id || `appointment-${index}`, // unique key
      patientName: a.patientName || "-",
      type: a.appointmentType || "manual",
      time: a.slotStart || "-",
      endTime: a.slotEnd || "-",
      status: a.status || "scheduled",
      reason: a.reason || "-", // fixed reason display
      isCompleted: (a.status || "").toLowerCase() === "completed",
    }));
  }, [appointments, today]);

  const getStatusColor = (isCompleted) =>
    isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-4 lg:p-6 h-full">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
            Today's Schedule
          </h2>
          <p className="text-sm text-gray-500">{todaySchedule.length} appointments</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left text-gray-900">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 border-b">Time</th>
              <th className="py-2 px-3 border-b">End Time</th>
              <th className="py-2 px-3 border-b">Patient</th>
              <th className="py-2 px-3 border-b">Type</th>
              <th className="py-2 px-3 border-b">Reason</th>
              <th className="py-2 px-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {todaySchedule.map((appointment) => (
              <tr
                key={appointment._id} // unique key
                className={`${getStatusColor(appointment.isCompleted)} transition-colors`}
              >
                <td className="py-2 px-3 border-b">{appointment.time}</td>
                <td className="py-2 px-3 border-b">{appointment.endTime}</td>
                <td className="py-2 px-3 border-b">{appointment.patientName}</td>
                <td className="py-2 px-3 border-b">{appointment.type}</td>
                <td className="py-2 px-3 border-b">{appointment.reason}</td>
                <td className="py-2 px-3 border-b capitalize">{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
