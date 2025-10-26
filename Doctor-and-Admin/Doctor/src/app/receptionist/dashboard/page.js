"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import BedChart from "@/components/BedChart";
import UpcomingAppointments from "@/components/doctor/appointments/UpcomingAppointments";
import DashboardCard from "@/components/doctor/common/DashboardCard";

export default function Home() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("hmsRole");
    const token = role ? localStorage.getItem(`${role}AuthToken`) : null;
    if (!role || !token) {
      router.push("/login"); // redirect if not logged in
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* 🔹 Top Bar (Search + Notifications + Profile) */}
        <div className="flex justify-between items-center mb-6">

          {/* Middle Search Bar */}
          <div className="flex-1 mx-12">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search patients, appointments, staff, or beds..."
                className="w-full px-4 py-2 rounded-full border-2 border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.02]"
              />
              <span className="absolute right-3 top-2.5 text-gray-600 group-focus-within:text-blue-600 transition-colors duration-300">
                <i className="bi bi-search text-lg"></i>
              </span>
            </div>
          </div>

          {/* Right: Notifications + Profile */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative text-gray-600 hover:text-blue-600 transition">
              <i className="bi bi-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                3
              </span>
            </button>

            {/* Profile */}
            <button className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow hover:shadow-md transition">
              <i className="bi bi-person-circle text-xl text-blue-600"></i>
              <span className="hidden md:inline text-gray-700 font-medium">
                Receptionist
              </span>
            </button>
          </div>
        </div>

        {/* 🔹 Stat Cards (with icons restored) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <DashboardCard
            title="Appointments"
            value="78 today"
            icon="bi bi-calendar-check"
          />
          <DashboardCard
            title="Patients"
            value="123 active"
            icon="bi bi-people-fill"
          />
          <DashboardCard
            title="Beds"
            value="56 occupied"
            icon="bi bi-hospital"
          />
          <DashboardCard
            title="Staff"
            value="80 on duty"
            icon="bi bi-person-badge-fill"
          />
        </div>

        {/* 🔹 Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BedChart />
          <UpcomingAppointments />
        </div>
      </main>
    </div>
  );
}
