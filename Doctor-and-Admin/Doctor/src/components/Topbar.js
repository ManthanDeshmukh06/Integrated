"use client";
import { Bell, User, Settings, Search, Menu } from "lucide-react";

export default function Topbar({ onMenuClick }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-30">
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between">
          
          {/* Left: Menu Button + Breadcrumb */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onMenuClick}
              className="p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/60 hover:shadow-md transition-all duration-200 text-gray-600 hover:text-blue-600"
            >
              <Menu size={20} />
            </button>
            
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, Receptionist</p>
            </div>
          </div>

          {/* Middle Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" size={18} />
              <input
                type="text"
                placeholder="Search patients, appointments, staff, or beds..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md"
              />
            </div>
          </div>

          {/* Right: Notifications + Profile */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/60 text-gray-600 hover:text-blue-600 hover:shadow-md transition-all duration-200">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                3
              </span>
            </button>

            {/* Settings */}
            <button className="p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/60 text-gray-600 hover:text-blue-600 hover:shadow-md transition-all duration-200">
              <Settings size={20} />
            </button>

            {/* Profile */}
            <button className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md border border-gray-200/60 transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">R</span>
              </div>
              <div className="hidden lg:block text-left">
                <span className="block text-gray-800 font-medium">Receptionist</span>
                <span className="block text-xs text-gray-500">Admin</span>
              </div>
              <User className="hidden lg:block text-gray-400" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}