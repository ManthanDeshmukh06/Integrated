// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Sidebar from "../../components/Sidebar";
// import DashboardCard from "../../components/doctor/common/DashboardCard";
// import BedChart from "../../components/BedChart";
// import UpcomingAppointments from "../../components/doctor/appointments/UpcomingAppointments";

// export default function Home() {
//   const router = useRouter();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const loggedIn = localStorage.getItem("receptionistLoggedIn");
//     if (!loggedIn) {
//       router.push("/login");
//     }

//     // Check if mobile
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth < 768) setSidebarOpen(false);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, [router]);

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Sidebar Overlay for Mobile */}
//       {isMobile && sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div className={`
//         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
//         ${isMobile ? 'fixed inset-y-0 z-50 w-64' : 'relative'}
//         transition-transform duration-300 ease-in-out
//       `}>
//         <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
//       </div>

//       {/* Main Content */}
//       <main className={`
//         flex-1 transition-all duration-300
//         ${sidebarOpen && !isMobile ? 'ml-0' : 'ml-0'}
//         min-h-screen
//       `}>
//         {/* Top Bar */}
//         <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-30">
//           <div className="p-4 lg:p-6">
//             <div className="flex items-center justify-between">
              
//               {/* Left: Menu Button + Breadcrumb */}
//               <div className="flex items-center gap-4">
//                 <button 
//                   onClick={() => setSidebarOpen(!sidebarOpen)}
//                   className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
//                 >
//                   <i className="bi bi-list text-xl text-gray-600"></i>
//                 </button>
                
//                 <div className="hidden sm:block">
//                   <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//                   <p className="text-sm text-gray-500">Welcome back, Receptionist</p>
//                 </div>
//               </div>

//               {/* Middle Search Bar */}
//               <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
//                 <div className="relative group">
//                   <input
//                     type="text"
//                     placeholder="Search patients, appointments, staff, or beds..."
//                     className="w-full px-6 py-3 rounded-2xl border border-gray-300 bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md"
//                   />
//                   <span className="absolute right-4 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
//                     <i className="bi bi-search text-lg"></i>
//                   </span>
//                 </div>
//               </div>

//               {/* Right: Notifications + Profile */}
//               <div className="flex items-center gap-3">
//                 {/* Notifications */}
//                 <button className="relative p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/60 text-gray-600 hover:text-blue-600 hover:shadow-md transition-all duration-200">
//                   <i className="bi bi-bell text-xl"></i>
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
//                     3
//                   </span>
//                 </button>

//                 {/* Profile */}
//                 <button className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md border border-gray-200/60 transition-all duration-200">
//                   <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
//                     <span className="text-white font-semibold text-sm">R</span>
//                   </div>
//                   <div className="hidden lg:block text-left">
//                     <span className="block text-gray-800 font-medium">Receptionist</span>
//                     <span className="block text-xs text-gray-500">Admin</span>
//                   </div>
//                   <i className="bi bi-chevron-down text-gray-400 hidden lg:block"></i>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="p-4 lg:p-6">
//           {/* 🔹 Stat Cards Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
//             <DashboardCard
//               title="Appointments"
//               value="78 today"
//               icon="bi bi-calendar-check"
//               trend="+12%"
//               trendPositive={true}
//             />
//             <DashboardCard
//               title="Patients"
//               value="123 active"
//               icon="bi bi-people-fill"
//               trend="+5%"
//               trendPositive={true}
//             />
//             <DashboardCard
//               title="Beds"
//               value="56 occupied"
//               icon="bi bi-hospital"
//               trend="-2%"
//               trendPositive={false}
//             />
//             <DashboardCard
//               title="Staff"
//               value="80 on duty"
//               icon="bi bi-person-badge-fill"
//               trend="+8%"
//               trendPositive={true}
//             />
//           </div>

//           {/* 🔹 Compact Charts Section */}
//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
//             {/* Bed Occupancy - Compact */}
//             <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-4 lg:p-5 min-h-[280px] flex flex-col">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-gray-800">Bed Occupancy</h2>
//                 <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
//                   Details <i className="bi bi-arrow-right text-xs"></i>
//                 </button>
//               </div>
//               <BedChart />
//             </div>

//             {/* Upcoming Appointments - Compact */}
//             <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-4 lg:p-5 min-h-[280px] flex flex-col">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
//                 <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
//                   All <i className="bi bi-arrow-right text-xs"></i>
//                 </button>
//               </div>
//               <UpcomingAppointments />
//             </div>
//           </div>

//           {/* 🔹 Quick Actions Footer 
//           <div className="mt-6 lg:mt-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-4 lg:p-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
//               {[
//                 { icon: "bi bi-plus-circle", label: "New Patient", color: "text-green-600" },
//                 { icon: "bi bi-calendar-plus", label: "Schedule", color: "text-blue-600" },
//                 { icon: "bi bi-file-earmark-text", label: "Reports", color: "text-purple-600" },
//                 { icon: "bi bi-gear", label: "Settings", color: "text-gray-600" }
//               ].map((action, index) => (
//                 <button key={index} className="flex flex-col items-center gap-2 p-3 lg:p-4 rounded-xl bg-white/80 hover:shadow-md transition-all duration-200 border border-gray-200/60">
//                   <i className={`${action.icon} text-2xl ${action.color}`}></i>
//                   <span className="text-sm font-medium text-gray-700">{action.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div> */}
//         </div>
//       </main>
//     </div>
//   );
// }