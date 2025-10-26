// "use client";
// import StatCards from "../../../components/doctor/dashboard/StatCards";
// import PatientQueue from "../../../components/doctor/dashboard/PatientQueue";
// import TodaySchedule from "../../../components/doctor/dashboard/TodaySchedule";
// import QuickActions from "../../../components/doctor/dashboard/QuickActions";
// import { useDoctorAuth } from "../../../hooks/useDoctorAuth";

// export default function DoctorDashboard() {
//   const { user } = useDoctorAuth();
//   return (
//     <>
//       {/* Welcome Section */}
//       <div className="mb-6 lg:mb-8">
//         <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//           Welcome back
//           {user?.email ? ", Dr. " + user?.email.split("@")[0] : ", Doctor"}
//         </h1>
//         <p className="text-gray-600 mt-2">
//           Here&apos;s your schedule and patient queue for today.
//         </p>
//       </div>

//       {/* Stat Cards Grid */}
//       <div className="mb-6 lg:mb-8">
//         <StatCards />
//       </div>

//       {/* Main Dashboard Grid */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
//         {/* Patient Queue - Left Column */}
//         {/* <div className="xl:col-span-1">
//           <PatientQueue />
//         </div> */}

//         {/* Today's Schedule - Right Column */}
//         <div className="xl:col-span-1">
//           <TodaySchedule />
//         </div>
//       </div>

//       {/* Quick Actions - Below Patient Queue & Today's Schedule */}
//       {/* <div className="mb-6 lg:mb-8">
//         <QuickActions />
//       </div> */}

//       {/* Emergency Alert Banner */}
//       {/* <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
//               <i className="bi bi-exclamation-triangle text-red-600 text-xl"></i>
//             </div>
//             <div>
//               <h3 className="font-semibold text-red-800">
//                 Emergency Case Alert
//               </h3>
//               <p className="text-red-600 text-sm">
//                 Patient in Room 204 requires immediate attention
//               </p>
//             </div>
//           </div>
//           <button className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors">
//             Respond Now
//           </button>
//         </div>
//       </div> */}
//     </>
//   );
// }
"use client";
import StatCards from "../../../components/doctor/dashboard/StatCards";
import TodaySchedule from "../../../components/doctor/dashboard/TodaySchedule";
import { useDoctorAuth } from "../../../hooks/useDoctorAuth";

export default function DoctorDashboard() {
  const { user } = useDoctorAuth();

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
          Welcome back
          {user?.email ? ", Dr. " + user?.email.split("@")[0] : ", Doctor"}
        </h1>
        <p className="text-gray-600 mt-2">
          Here&apos;s your schedule for today.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="mb-6 lg:mb-8">
        <StatCards />
      </div>

      {/* Today's Schedule - Full Width */}
      <div className="mb-6 lg:mb-8">
        <TodaySchedule />
      </div>
    </>
  );
}
