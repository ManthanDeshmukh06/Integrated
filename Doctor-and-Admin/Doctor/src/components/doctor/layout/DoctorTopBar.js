"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function DoctorTopBar({ sidebarOpen, setSidebarOpen, user }) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const displayName = (() => {
    if (user?.name && user.name.trim().length > 0) return user.name;
    if (user?.email) return user.email.split("@")[0];
    return "Doctor";
  })();

  const initials = (() => {
    const base =
      user?.name && user.name.trim().length > 0
        ? user.name
        : user?.email
        ? user.email.split("@")[0]
        : "DR";
    const parts = base.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return base.slice(0, 2).toUpperCase();
  })();

  const notifications = [
    {
      id: 1,
      type: "emergency",
      message: "Emergency case in Room 204",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      type: "appointment",
      message: "New appointment request",
      time: "5 min ago",
      read: false,
    },
    {
      id: 3,
      type: "lab",
      message: "Lab results ready for Patient #123",
      time: "1 hour ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-30 shadow-sm">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Menu Button & Breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-gray-600 hover:text-green-600"
            >
              <i className="bi bi-list text-xl"></i>
            </button>

            <div className="hidden md:block">
              <h1 className="text-2xl font-bold text-gray-800 capitalize">
                {(() => {
                  if (pathname === "/doctor/dashboard")
                    return "Doctor Dashboard";
                  if (pathname === "/doctor/patients") return "My Patients";
                  if (pathname === "/doctor/appointments")
                    return "Appointments";
                  if (pathname === "/doctor/prescriptions")
                    return "Prescriptions";
                  if (pathname === "/doctor/lab-reports") return "Lab Reports";
                  if (pathname === "/doctor/video-consult")
                    return "Video Consult";
                  if (pathname === "/doctor/diagnosis") return "Diagnosis";
                  if (pathname === "/doctor/referrals") return "Referrals";
                  if (pathname === "/doctor/discharge") return "Discharge";
                  if (pathname === "/doctor/feedback") return "Feedback";
                  return "Doctor Dashboard";
                })()}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Middle Section - Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search patients, conditions, medications..."
                className="w-full px-6 py-3 rounded-2xl border border-gray-300 bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md"
              />
              <span className="absolute right-4 top-3 text-gray-400 group-focus-within:text-green-600 transition-colors duration-300">
                <i className="bi bi-search text-lg"></i>
              </span>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {/* Emergency Quick Action */}
            <button className="relative p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:shadow-md transition-all duration-200 group">
              <i className="bi bi-activity text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium animate-pulse">
                1
              </span>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2">
                <p className="text-sm font-medium text-gray-800">
                  Emergency Alert
                </p>
                <p className="text-xs text-gray-600">Patient in Room 204</p>
              </div>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/60 text-gray-600 hover:text-green-600 hover:shadow-md transition-all duration-200"
              >
                <i className="bi bi-bell text-xl"></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">
                        Notifications
                      </h3>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {unreadCount} unread
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              notification.type === "emergency"
                                ? "bg-red-100 text-red-600"
                                : notification.type === "appointment"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            <i
                              className={`bi bi-${
                                notification.type === "emergency"
                                  ? "exclamation-triangle"
                                  : notification.type === "appointment"
                                  ? "calendar-check"
                                  : "clipboard-data"
                              } text-sm`}
                            ></i>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md border border-gray-200/60 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-sm">
                    {initials}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <span className="block text-gray-800 font-medium">
                    Dr. {displayName}
                  </span>
                  <span className="block text-xs text-gray-500">
                    Cardiologist
                  </span>
                </div>
                <i className="bi bi-chevron-down text-gray-400 hidden lg:block"></i>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-800">
                      Dr. {displayName}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email || ""}</p>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      ● Online
                    </p>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center gap-2">
                      <i className="bi bi-person"></i>
                      My Profile
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center gap-2">
                      <i className="bi bi-gear"></i>
                      Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center gap-2">
                      <i className="bi bi-question-circle"></i>
                      Help & Support
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        localStorage.removeItem("doctorLoggedIn");
                        localStorage.removeItem("hmsUser");
                        window.location.href = "/login";
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for dropdowns */}
      {(showNotifications || showProfileMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfileMenu(false);
          }}
        />
      )}
    </header>
  );
}
