// src/app/staff/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar"; 
import AddDoctorModal from "./AddDoctorModal"; 
import ReceptionistModal from "./AddReceptionistModal"// ✅ Import Receptionist Modal
import DashboardCard from "../components/DashboardCard";

export default function StaffManagementPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isReceptionistModalOpen, setIsReceptionistModalOpen] = useState(false); // ✅ New state

  const staffCounts = {
    doctors: 28,
    receptionists: 5,
    nurses: 42,
    pharmacists: 8,
    totalStaff: 83,
  };

  // Handlers
  const handleDoctorAdded = (newDoctor) => {
      console.log("New Doctor Added:", newDoctor);
      // TODO: Re-fetch staffCounts if needed
  }

  const handleReceptionistAdded = (newReceptionist) => {
      console.log("New Receptionist Added:", newReceptionist);
      // TODO: Re-fetch staffCounts if needed
  }

  useEffect(() => {
    setIsAdmin(true); // DEV bypass

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setSidebarOpen(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [router]);

  if (!isAdmin) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">Loading...</div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isMobile ? 'fixed inset-y-0 z-50 w-64' : 'relative'} transition-transform duration-300 ease-in-out`}>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 min-h-screen p-4 lg:p-6">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200/60 p-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                        <i className="bi bi-list text-xl text-gray-600"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Staff Management Overview</h1>
                        <p className="text-sm text-gray-500">Quick statistics and staff registration.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Staff Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard title="Total Doctors" value={staffCounts.doctors} icon="bi bi-heart-pulse-fill" trend="1.5% MoM" trendPositive={true} color="blue" onClick={() => console.log('Go to Doctors List')} />
            <DashboardCard title="Total Nurses" value={staffCounts.nurses} icon="bi bi-bandages-fill" trend="0.5% MoM" trendPositive={true} color="green" onClick={() => console.log('Go to Nurses List')} />
            <DashboardCard title="Receptionists" value={staffCounts.receptionists} icon="bi bi-person-badge-fill" trend="2.0% MoM" trendPositive={false} color="orange" onClick={() => console.log('Go to Receptionist List')} />
            <DashboardCard title="Total Staff" value={staffCounts.totalStaff} icon="bi bi-people-fill" trend="Up to date" trendPositive={true} color="purple" onClick={() => console.log('Go to Full Staff List')} />
        </div>

        {/* Prominent Add Buttons Section */}
        <div className="text-center p-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/60">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Need to onboard new personnel?</h3>
            <p className="text-gray-600 mb-6">Use the buttons below to register new staff quickly.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setIsDoctorModalOpen(true)} className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg bg-green-600 text-white font-bold rounded-xl shadow-xl hover:bg-green-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.05]">
                  <i className="bi bi-plus-circle-fill"></i> Register Doctor
              </button>
              <button onClick={() => setIsReceptionistModalOpen(true)} className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg bg-yellow-600 text-white font-bold rounded-xl shadow-xl hover:bg-yellow-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.05]">
                  <i className="bi bi-plus-circle-fill"></i> Register Receptionist
              </button>
            </div>
        </div>

      </main>

      {/* Modals */}
      <AddDoctorModal 
          isOpen={isDoctorModalOpen} 
          onClose={() => setIsDoctorModalOpen(false)}
          onDoctorAdded={handleDoctorAdded}
      />

      <ReceptionistModal
          isOpen={isReceptionistModalOpen}
          onClose={() => setIsReceptionistModalOpen(false)}
          onReceptionistAdded={handleReceptionistAdded}
      />

    </div>
  );
}
