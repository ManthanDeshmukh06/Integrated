"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, ClipboardList, Search, ArrowLeft, User } from "lucide-react";

const upcomingAppointments = [
  { name: "James Smith", date: "28-06-24", time: "08:21 AM", mode: "Virtual", sessionType: "Checkup" },
  { name: "Hazy Eling", date: "08-07-24", time: "03:05 PM", mode: "In-Person", sessionType: "Follow-up" },
  { name: "Pelor Grey", date: "30-09-24", time: "12:54 PM", mode: "Virtual", sessionType: "Therapy" },
  { name: "Sarah Lee", date: "10-08-24", time: "09:15 AM", mode: "In-Person", sessionType: "Consultation" },
];

const recentAppointments = [
  { name: "Oliver Queen", date: "15-05-24", time: "10:10 AM", mode: "Virtual", sessionType: "Checkup" },
  { name: "Emily Watson", date: "20-05-24", time: "01:45 PM", mode: "In-Person", sessionType: "Consultation" },
  { name: "Bruce Wayne", date: "05-06-24", time: "11:20 AM", mode: "Virtual", sessionType: "Follow-up" },
];

const appointmentModeColors = {
  "Virtual": "bg-blue-50 text-blue-700 border-blue-200",
  "In-Person": "bg-green-50 text-green-700 border-green-200",
};

export default function AppointmentsPage() {
  const router = useRouter();
  const [tab, setTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");

  const activeAppointments = tab === "upcoming" ? upcomingAppointments : recentAppointments;

  const filteredAppointments = activeAppointments
    .filter(appt =>
      appt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.mode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.sessionType.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortBy === "date") {
        const [dayA, monthA, yearA] = a.date.split("-").map(Number);
        const [dayB, monthB, yearB] = b.date.split("-").map(Number);
        const dateA = new Date(`20${yearA}`, monthA - 1, dayA);
        const dateB = new Date(`20${yearB}`, monthB - 1, dayB);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "time") {
        const timeA = convertTo24Hour(a.time);
        const timeB = convertTo24Hour(b.time);
        return sortOrder === "asc" ? timeA.localeCompare(timeB) : timeB.localeCompare(timeA);
      }
      return 0;
    });

  function convertTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    }
    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
    return `${hours.padStart(2, '0')}:${minutes}`;
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with proper alignment */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group mt-1"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Appointments</h1>
              <p className="text-gray-600 mt-2 text-lg">
                {tab === "upcoming" ? "Manage your upcoming appointments" : "View recent appointment history"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{upcomingAppointments.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Virtual</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {upcomingAppointments.filter(a => a.mode === "Virtual").length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <ClipboardList className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">In-Person</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {upcomingAppointments.filter(a => a.mode === "In-Person").length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <User className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
              <button
                onClick={() => setTab("upcoming")}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  tab === "upcoming" 
                    ? "bg-white text-blue-600 shadow-sm border border-blue-100" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Upcoming Appointments
              </button>
              <button
                onClick={() => setTab("recent")}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  tab === "recent" 
                    ? "bg-white text-blue-600 shadow-sm border border-blue-100" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Recent History
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1 lg:justify-end">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search patients, type, mode..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-50/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="date">Sort by Date</option>
                  <option value="time">Sort by Time</option>
                  <option value="name">Sort by Name</option>
                </select>
                
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-600 font-medium">
                  <th className="p-6">Patient</th>
                  <th className="p-6">Date</th>
                  <th className="p-6">Time</th>
                  <th className="p-6">Session Type</th>
                  <th className="p-6">Appointment Type</th>
                  {tab === "upcoming" && <th className="p-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAppointments.map((appt, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-medium">
                          {appt.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 block">{appt.name}</span>
                          <span className="text-sm text-gray-500">{appt.sessionType}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3 text-gray-900 font-medium">
                        <Calendar size={16} className="text-gray-400" />
                        {appt.date}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3 text-gray-900 font-medium">
                        <Clock size={16} className="text-gray-400" />
                        {appt.time}
                      </div>
                    </td>
                    <td className="p-6 text-gray-700">
                      <span className="font-medium">{appt.sessionType}</span>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-medium border ${appointmentModeColors[appt.mode]}`}>
                        <ClipboardList size={12} />
                        {appt.mode}
                      </span>
                    </td>
                    {tab === "upcoming" && (
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition border border-blue-100">
                            Reschedule
                          </button>
                          <button className="px-4 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition border border-red-100">
                            Cancel
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-3 text-lg">No appointments found</div>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}