"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();
  const quickActions = [
    { id: 1, icon: "bi bi-file-medical", label: "Prescriptions", description: "Create prescriptions", color: "green", module: "prescriptions" },
    { id: 2, icon: "bi bi-clipboard-data", label: "Lab Reports", description: "View lab results", color: "blue", module: "lab-reports" },
    { id: 3, icon: "bi bi-camera-video", label: "Video Consult", description: "Start video call", color: "purple", module: "video-consult" },
    { id: 4, icon: "bi bi-journal-medical", label: "Diagnosis", description: "Patient diagnosis", color: "orange", module: "diagnosis" },
    { id: 5, icon: "bi bi-arrow-left-right", label: "Referrals", description: "Refer patients", color: "indigo", module: "referrals" },
    { id: 6, icon: "bi bi-file-earmark-text", label: "Discharge", description: "Patient discharge", color: "red", module: "discharge" },
  ];

  const handleActionClick = (action) => {
    console.log(`Quick action: ${action.label}`);
    if (action.module) {
      router.push(`/doctor/${action.module}`);
    }
    // Show success notification
    // You can add toast notifications here
  };

  const getActionColor = (color) => {
    const colors = {
      green: "bg-green-50 text-green-600 hover:bg-green-100",
      blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
      purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
      orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
      red: "bg-red-50 text-red-600 hover:bg-red-100",
      indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Quick Actions</h2>
          <p className="text-sm text-gray-500">Frequently used tasks</p>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Most Used</span>
      </div>

      {/* Actions Grid - Horizontal Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickActions.map((action) => (
          <button 
            key={action.id}
            onClick={() => handleActionClick(action)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 group hover:shadow-md border border-gray-200/60 text-center ${getActionColor(action.color)}`}
          >
            <div className="p-3 rounded-xl bg-white group-hover:scale-110 transition-transform duration-200 shadow-sm">
              <i className={`${action.icon} text-xl`}></i>
            </div>
            <div>
              <span className="text-sm font-medium block">{action.label}</span>
              <span className="text-xs opacity-75">{action.description}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Support Section */}
      <div className="mt-6 pt-4 border-t border-gray-200/60">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Need assistance?</p>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center justify-center gap-1 w-full">
            <i className="bi bi-headset"></i>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}