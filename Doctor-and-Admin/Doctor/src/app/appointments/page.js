// "use client";
// import { useState } from "react";

// export default function AppointmentsPage() {
//   const [tab, setTab] = useState("scheduled");
//   const [openMenu, setOpenMenu] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     date: "",
//     startTime: "",
//     department: "",
//     doctor: "",
//     participant: ""
//   });

//   const departments = [
//     { id: 1, name: "Cardiology" },
//     { id: 2, name: "Neurology" },
//     { id: 3, name: "Pediatrics" },
//     { id: 4, name: "Orthopedics" },
//     { id: 5, name: "Dermatology" },
//     { id: 6, name: "Ophthalmology" },
//   ];

//   const doctors = [
//     { id: 1, name: "Dr. Smith", department: "Cardiology" },
//     { id: 2, name: "Dr. Johnson", department: "Cardiology" },
//     { id: 3, name: "Dr. Williams", department: "Neurology" },
//     { id: 4, name: "Dr. Brown", department: "Neurology" },
//     { id: 5, name: "Dr. Davis", department: "Pediatrics" },
//     { id: 6, name: "Dr. Miller", department: "Orthopedics" },
//     { id: 7, name: "Dr. Wilson", department: "Dermatology" },
//     { id: 8, name: "Dr. Moore", department: "Ophthalmology" },
//   ];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const filteredDoctors = formData.department
//     ? doctors.filter(doctor => doctor.department === formData.department)
//     : doctors;

//   const scheduledMeetings = [
//     {
//       id: 1,
//       title: "Annual Checkup",
//       date: "26-04-2025",
//       time: "07:50 AM To 08:30 AM",
//       patient: "Dhiraj Choudhary",
//       status: "upcoming",
//       department: "Cardiology",
//       doctor: "Dr. Smith"
//     },
//     {
//       id: 2,
//       title: "Follow-up Consultation",
//       date: "26-04-2025",
//       time: "09:00 AM To 09:30 AM",
//       patient: "Swami Shardul",
//       status: "upcoming",
//       department: "Neurology",
//       doctor: "Dr. Williams"
//     },
//     {
//       id: 3,
//       title: "Therapy Session",
//       date: "28-05-2025",
//       time: "09:00 AM To 09:30 AM",
//       patient: "Amol Marathe",
//       status: "upcoming",
//       department: "Orthopedics",
//       doctor: "Dr. Miller"
//     },
//     {
//       id: 4,
//       title: "Routine Checkup",
//       date: "29-05-2025",
//       time: "10:00 AM To 10:30 AM",
//       patient: "Rahul Sharma",
//       status: "upcoming",
//       department: "Dermatology",
//       doctor: "Dr. Wilson"
//     },
//     {
//       id: 5,
//       title: "Eye Examination",
//       date: "30-05-2025",
//       time: "11:00 AM To 11:45 AM",
//       patient: "Priya Patel",
//       status: "upcoming",
//       department: "Ophthalmology",
//       doctor: "Dr. Moore"
//     },
//   ];

//   const recentMeetings = [
//     {
//       id: 101,
//       title: "General Consultation",
//       date: "25-04-2025",
//       time: "10:00 AM To 10:30 AM",
//       patient: "Prathamesh Ramdas Bhokare",
//       status: "completed",
//       department: "Pediatrics",
//       doctor: "Dr. Davis"
//     },
//     {
//       id: 102,
//       title: "Vaccination",
//       date: "25-04-2025",
//       time: "11:00 AM To 11:30 AM",
//       patient: "Prathamesh Ramdas Bhokare",
//       status: "completed",
//       department: "Pediatrics",
//       doctor: "Dr. Davis"
//     },
//     {
//       id: 103,
//       title: "Post-Op Check",
//       date: "24-04-2025",
//       time: "02:00 PM To 02:30 PM",
//       patient: "Michael Johnson",
//       status: "completed",
//       department: "Orthopedics",
//       doctor: "Dr. Miller"
//     },
//     {
//       id: 104,
//       title: "Cardiac Screening",
//       date: "23-04-2025",
//       time: "09:30 AM To 10:15 AM",
//       patient: "Sarah Williams",
//       status: "completed",
//       department: "Cardiology",
//       doctor: "Dr. Smith"
//     },
//   ];

//   const meetingsToShow = tab === "scheduled" ? scheduledMeetings : recentMeetings;

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Appointments</h1>
        
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Schedule Meeting Form */}
//           <div className="bg-white shadow-lg rounded-xl p-6">
//             <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               Schedule Meeting
//             </h2>

//             <form className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   placeholder="Add your title"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//                 <input
//                   type="time"
//                   name="startTime"
//                   value={formData.startTime}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                 />
//               </div>

//               {/* Department Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
//                 <div className="relative">
//                   <select
//                     name="department"
//                     value={formData.department}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
//                   >
//                     <option value="">Select Department</option>
//                     {departments.map(dept => (
//                       <option key={dept.id} value={dept.name}>{dept.name}</option>
//                     ))}
//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                     <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               {/* Doctor Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
//                 <div className="relative">
//                   <select
//                     name="doctor"
//                     value={formData.doctor}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
//                     disabled={!formData.department}
//                   >
//                     <option value="">Select Doctor</option>
//                     {filteredDoctors.map(doc => (
//                       <option key={doc.id} value={doc.name}>{doc.name}</option>
//                     ))}
//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                     <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Participant</label>
//                 <input
//                   type="email"
//                   name="participant"
//                   value={formData.participant}
//                   onChange={handleInputChange}
//                   placeholder="Search or type an email address"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                 />
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="button"
//                   className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-700 transition flex-1 flex items-center justify-center"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                   Schedule
//                 </button>
//                 <button
//                   type="button"
//                   className="border border-blue-600 text-blue-600 px-5 py-3 rounded-lg hover:bg-blue-50 transition flex-1 flex items-center justify-center"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   Start Now
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Meeting List */}
//           <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
//             <div className="flex border-b mb-4">
//               <button
//                 className={`py-3 px-4 font-medium text-sm relative ${tab === "scheduled" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
//                 onClick={() => setTab("scheduled")}
//               >
//                 Scheduled Meetings
//                 {tab === "scheduled" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
//               </button>
//               <button
//                 className={`py-3 px-4 font-medium text-sm relative ${tab === "recent" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
//                 onClick={() => setTab("recent")}
//               >
//                 Recent Meetings
//                 {tab === "recent" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
//               </button>
//             </div>

//             <div className="flex-1 overflow-hidden">
//               <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
//                 <div className="space-y-3">
//                   {meetingsToShow.length > 0 ? (
//                     meetingsToShow.map((m) => (
//                       <div
//                         key={m.id}
//                         className="relative border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow"
//                       >
//                         {tab === "scheduled" && (
//                           <div className="absolute top-3 right-3">
//                             <button
//                               onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}
//                               className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//                               </svg>
//                             </button>

//                             {openMenu === m.id && (
//                               <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
//                                 <button className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center">
//                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                                   </svg>
//                                   Reschedule
//                                 </button>
//                                 <button className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-red-600 flex items-center">
//                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                                   </svg>
//                                   Cancel
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         )}

//                         <div className="pr-6">
//                           <div className="flex items-start">
//                             <div className={`p-1.5 rounded-md ${tab === "scheduled" ? "bg-blue-100" : "bg-green-100"}`}>
//                               <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${tab === "scheduled" ? "text-blue-600" : "text-green-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                               </svg>
//                             </div>
//                             <div className="ml-3 flex-1">
//                               <h3 className="font-semibold text-gray-800 text-sm">{m.title}</h3>
                              
//                               <div className="flex flex-wrap gap-1.5 mt-2">
//                                 <span className="inline-flex items-center text-xs bg-gray-100 text-gray-600 rounded-full pl-2 pr-2.5 py-1">
//                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                   </svg>
//                                   {m.date}
//                                 </span>
//                                 <span className="inline-flex items-center text-xs bg-gray-100 text-gray-600 rounded-full pl-2 pr-2.5 py-1">
//                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                   </svg>
//                                   {m.time}
//                                 </span>
//                               </div>
                              
//                               <div className="mt-2 flex items-center text-xs text-gray-600">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                                 </svg>
//                                 {m.patient}
//                               </div>
                              
//                               <div className="mt-1.5 flex items-center text-xs text-gray-600">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                                 </svg>
//                                 <span className="truncate">{m.department} • {m.doctor}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {tab === "scheduled" && (
//                           <div className="flex justify-end mt-3">
//                             <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition flex items-center text-xs">
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
//                               </svg>
//                               Start
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-8 text-gray-500">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                       </svg>
//                       <p className="mt-2 text-sm">No {tab === "scheduled" ? "scheduled" : "recent"} meetings</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #c5c5c5;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #a8a8a8;
//         }
//       `}</style>
//     </div>
//   );
// }