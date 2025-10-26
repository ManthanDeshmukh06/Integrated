// src/app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar"; // Assuming Sidebar is at src/components/Sidebar
import DashboardCard from "../components/DashboardCard"; 
// Adjust DashboardCard path if needed.

// NOTE: AdminFeatureCard and adminFeatures data have been REMOVED.

export default function AdminDashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState({});

  useEffect(() => {
    // ⚠️ DEVELOPMENT BYPASS: Comment out the code below and use the line below it to bypass login.
    /*
    const loggedIn = localStorage.getItem("loggedIn");
    const hmsUser = localStorage.getItem("hmsUser");

    if (!loggedIn || !hmsUser) {
      router.push("/login");
    } else {
        setAdminUser(JSON.parse(hmsUser));
        setIsAdmin(true);
    }
    */
    
    // 💡 TEMPORARY BYPASS START: Allows direct access to /dashboard for development
    setAdminUser({ hospitalId: "DEV-BYPASS", email: "dev@hms.com" });
    setIsAdmin(true); 
    // 💡 TEMPORARY BYPASS END

    // Check if mobile 
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setSidebarOpen(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [router]);

  // Render a loading screen while checking auth
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // NOTE: The adminFeatures array is no longer defined here.

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Sidebar Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isMobile ? 'fixed inset-y-0 z-50 w-64' : 'relative'}
        transition-transform duration-300 ease-in-out
      `}>
        {/* The links inside this Sidebar component need to be updated 
            in your separate Sidebar.js file to only show "Staff Management". */}
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 min-h-screen">
        
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-30">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              
              {/* Left: Menu Button + Breadcrumb */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <i className="bi bi-list text-xl text-gray-600"></i>
                </button>
                
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">
                      Welcome, System Administrator ({adminUser.hospitalId || 'HMS'})
                  </p>
                </div>
              </div>
              
              {/* Middle Search Bar */}
              <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search users, logs, or system settings..."
                    className="w-full px-6 py-3 rounded-2xl border border-gray-300 bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md"
                  />
                  <span className="absolute right-4 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
                    <i className="bi bi-search text-lg"></i>
                  </span>
                </div>
              </div>

              {/* Right: Notifications + Profile */}
              <div className="flex items-center gap-3">
                <button className="relative p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/60 text-gray-600 hover:text-blue-600 hover:shadow-md transition-all duration-200">
                  <i className="bi bi-bell text-xl"></i>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">3</span>
                </button>
                <button className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md border border-gray-200/60 transition-all duration-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">A</span>
                  </div>
                  <div className="hidden lg:block text-left">
                    <span className="block text-gray-800 font-medium">Administrator</span>
                    <span className="block text-xs text-gray-500">System Role</span>
                  </div>
                  <i className="bi bi-chevron-down text-gray-400 hidden lg:block"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - ADMIN FOCUS */}
        <div className="p-4 lg:p-6">
          
          {/* 🔹 Core Admin Cards (e.g., Stats) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <DashboardCard
              title="Active Users"
              value="15 total staff"
              icon="bi bi-people-fill"
              trend="+1 new"
              trendPositive={true}
            />
            <DashboardCard
              title="Audit Log Entries"
              value="500+ today"
              icon="bi bi-journal-text"
              trend="Check Now"
              trendPositive={false}
            />
            <DashboardCard
              title="System Config Status"
              value="Operational"
              icon="bi bi-gear-fill"
              trend="No Issues"
              trendPositive={true}
            />
            <DashboardCard
              title="Open Complaints"
              value="4 pending"
              icon="bi bi-chat-square-dots"
              trend="High Priority"
              trendPositive={false}
            />
          </div>

          {/* The "Admin Core Features" section has been successfully REMOVED 
            from the component's JSX here, fulfilling your requirement.
          */}
          
        </div>
      </main>
    </div>
  );
}