// "use client";
// import React, { useState, useMemo } from 'react';

// // Helper to get status color
// const StatusIndicator = ({ status }) => {
//     const isCompleted = status === 'completed';
//     return (
//         <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
//             isCompleted ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
//         }`}>
//             <i className={`bi ${isCompleted ? 'bi-check-circle' : 'bi-x-circle'} text-2xl`}></i>
//         </div>
//     );
// };

// export default function History({ appointments, onViewDetails }) {
//     // Get today's date in YYYY-MM-DD format for the date picker max attribute
//     const today = new Date().toISOString().split('T')[0];

//     // State for filters
//     const [selectedDate, setSelectedDate] = useState(""); // default: show all
//     const [statusFilter, setStatusFilter] = useState('all'); // all, completed, cancelled
//     const [typeFilter, setTypeFilter] = useState('all'); // all, virtual, walk-in, offline
//     const [rangeFilter, setRangeFilter] = useState('all'); // all, day, week, month
//     const [sessionTypeFilter, setSessionTypeFilter] = useState('all'); // all, Checkup, Follow-Up, Therapy, Consultation

//     // Helper to check if a date is in previous day/week/month
//     function isInRange(dateStr, range) {
//         const today = new Date();
//         const date = new Date(dateStr);
//         if (range === 'day') {
//             // Previous day
//             const prevDay = new Date(today);
//             prevDay.setDate(today.getDate() - 1);
//             return date.getFullYear() === prevDay.getFullYear() && date.getMonth() === prevDay.getMonth() && date.getDate() === prevDay.getDate();
//         } else if (range === 'week') {
//             // Previous week (Monday-Sunday)
//             const prevWeekStart = new Date(today);
//             prevWeekStart.setDate(today.getDate() - today.getDay() - 6); // Last week's Monday
//             prevWeekStart.setHours(0,0,0,0);
//             const prevWeekEnd = new Date(prevWeekStart);
//             prevWeekEnd.setDate(prevWeekStart.getDate() + 6); // Last week's Sunday
//             return date >= prevWeekStart && date <= prevWeekEnd;
//         } else if (range === 'month') {
//             // Previous month
//             const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//             const nextMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//             return date >= prevMonth && date < nextMonth;
//         }
//         return true;
//     }

//     const filteredAppointments = useMemo(() => {
//         return appointments.filter(app => {
//             const matchesDate = !selectedDate || app.date === selectedDate;
//             const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
//             const matchesType = typeFilter === 'all' || app.type === typeFilter;
//             const matchesRange = rangeFilter === 'all' || isInRange(app.date, rangeFilter);
//             const matchesSessionType = sessionTypeFilter === 'all' || app.sessionType === sessionTypeFilter;
//             return matchesDate && matchesStatus && matchesType && matchesRange && matchesSessionType;
//         });
//     }, [appointments, selectedDate, statusFilter, typeFilter, rangeFilter, sessionTypeFilter]);

//     return (
//         <div>
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//                 <h2 className="text-xl font-bold text-gray-800">Appointments History</h2>
//                 {/* Filter Controls */}
//                 <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap">
//                     <input
//                         type="date"
//                         value={selectedDate}
//                         onChange={(e) => setSelectedDate(e.target.value)}
//                         max={today} // Prevents selecting future dates
//                         className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
//                         placeholder="All Dates"
//                     />
//                     <select
//                         value={statusFilter}
//                         onChange={(e) => setStatusFilter(e.target.value)}
//                         className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
//                     >
//                         <option value="all">All Status</option>
//                         <option value="completed">Completed</option>
//                         <option value="cancelled">Cancelled</option>
//                     </select>
//                     <select
//                         value={typeFilter}
//                         onChange={(e) => setTypeFilter(e.target.value)}
//                         className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
//                     >
//                         <option value="all">All Types</option>
//                         <option value="virtual">Virtual</option>
//                         <option value="walk-in">Walk-in</option>
//                         <option value="offline">Offline</option>
//                     </select>
//                     <select
//                         value={rangeFilter}
//                         onChange={e => setRangeFilter(e.target.value)}
//                         className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
//                     >
//                         <option value="all">All Time</option>
//                         <option value="day">Previous Day</option>
//                         <option value="week">Previous Week</option>
//                         <option value="month">Previous Month</option>
//                     </select>
//                     <select
//                         value={sessionTypeFilter}
//                         onChange={e => setSessionTypeFilter(e.target.value)}
//                         className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
//                     >
//                         <option value="all">All Session Types</option>
//                         <option value="Checkup">Checkup</option>
//                         <option value="Follow-Up">Follow-Up</option>
//                         <option value="Therapy">Therapy</option>
//                         <option value="Consultation">Consultation</option>
//                     </select>
//                 </div>
//             </div>

//             {/* Appointments List */}
//             {filteredAppointments.length > 0 ? (
//                 <div className="space-y-4">
//                     {filteredAppointments.map((app) => (
//                         <div key={app.id} className="border border-gray-200 rounded-xl p-4">
//                             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                                 <div className="flex items-start gap-4">
//                                     <StatusIndicator status={app.status} />
//                                     <div>
//                                         <h3 className="font-semibold text-gray-800">{app.patientName}</h3>
//                                         <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
//                                             <span className="flex items-center">
//                                                 <i className="bi bi-clock mr-1.5"></i>
//                                                 {app.time}
//                                             </span>
//                                             <span className="flex items-center capitalize">
//                                                 <i className="bi bi-tag mr-1.5"></i>
//                                                 {app.type.replace('-', ' ')}
//                                             </span>
//                                             <span className="flex items-center capitalize">
//                                                 <i className="bi bi-activity mr-1.5"></i>
//                                                 {app.sessionType}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="mt-4 sm:mt-0 self-end sm:self-center">
//                                     <button
//                                         onClick={() => onViewDetails(app)}
//                                         className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
//                                     >
//                                         View Details
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <div className="text-center py-12">
//                     <i className="bi bi-calendar-x text-4xl text-gray-300 mb-4"></i>
//                     <h3 className="text-lg font-medium text-gray-500">No History Found</h3>
//                     <p className="text-gray-400 mt-1">No appointments match the selected date and filters.</p>
//                 </div>
//             )}
//         </div>
//     );
// }"use client";
import React, { useState, useMemo } from 'react';

// Helper to get status color
const StatusIndicator = ({ status }) => {
    const isCompleted = status === 'completed';
    return (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isCompleted ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
            <i className={`bi ${isCompleted ? 'bi-check-circle' : 'bi-x-circle'} text-2xl`}></i>
        </div>
    );
};

export default function History({ appointments, onViewDetails }) {
    const today = new Date().toISOString().split('T')[0];

    const [selectedDate, setSelectedDate] = useState("");
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [rangeFilter, setRangeFilter] = useState('all');
    const [sessionTypeFilter, setSessionTypeFilter] = useState('all');

    function isInRange(dateStr, range) {
        const today = new Date();
        const date = new Date(dateStr);
        if (range === 'day') {
            const prevDay = new Date(today);
            prevDay.setDate(today.getDate() - 1);
            return date.toDateString() === prevDay.toDateString();
        } else if (range === 'week') {
            const prevWeekStart = new Date(today);
            prevWeekStart.setDate(today.getDate() - today.getDay() - 6);
            prevWeekStart.setHours(0,0,0,0);
            const prevWeekEnd = new Date(prevWeekStart);
            prevWeekEnd.setDate(prevWeekStart.getDate() + 6);
            return date >= prevWeekStart && date <= prevWeekEnd;
        } else if (range === 'month') {
            const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const nextMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            return date >= prevMonth && date < nextMonth;
        }
        return true;
    }

    const filteredAppointments = useMemo(() => {
        return appointments.filter(app => {
            const matchesDate = !selectedDate || app.date === selectedDate;
            const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
            const matchesType = typeFilter === 'all' || app.type === typeFilter;
            const matchesRange = rangeFilter === 'all' || isInRange(app.date, rangeFilter);
            const matchesSessionType = sessionTypeFilter === 'all' || app.sessionType === sessionTypeFilter;
            return matchesDate && matchesStatus && matchesType && matchesRange && matchesSessionType;
        });
    }, [appointments, selectedDate, statusFilter, typeFilter, rangeFilter, sessionTypeFilter]);

    const getStatusColor = (status) => 
        status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800">Appointments History</h2>
                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        max={today}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500">
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500">
                        <option value="all">All Types</option>
                        <option value="virtual">Virtual</option>
                        <option value="walk-in">Walk-in</option>
                        <option value="offline">Offline</option>
                    </select>
                    <select value={rangeFilter} onChange={e => setRangeFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500">
                        <option value="all">All Time</option>
                        <option value="day">Previous Day</option>
                        <option value="week">Previous Week</option>
                        <option value="month">Previous Month</option>
                    </select>
                    <select value={sessionTypeFilter} onChange={e => setSessionTypeFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500">
                        <option value="all">All Session Types</option>
                        <option value="Checkup">Checkup</option>
                        <option value="Follow-Up">Follow-Up</option>
                        <option value="Therapy">Therapy</option>
                        <option value="Consultation">Consultation</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            {filteredAppointments.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 text-left text-gray-900">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-3 border-b">Start Time</th>
                                <th className="py-2 px-3 border-b">End Time</th>
                                <th className="py-2 px-3 border-b">Patient</th>
                                <th className="py-2 px-3 border-b">Type</th>
                                <th className="py-2 px-3 border-b">Session</th>
                                <th className="py-2 px-3 border-b">Reason</th>
                                <th className="py-2 px-3 border-b">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((app, idx) => (
                                <tr
                                    key={app._id || `history-${idx}`}
                                    className={`cursor-pointer ${getStatusColor(app.status)} hover:shadow transition-shadow`}
                                    onClick={() => onViewDetails(app)}
                                >
                                    <td className="py-2 px-3 border-b">{app.slotStart || "N/A"}</td>
                                    <td className="py-2 px-3 border-b">{app.slotEnd || "N/A"}</td>
                                    <td className="py-2 px-3 border-b">{app.patientName || "N/A"}</td>
                                    <td className="py-2 px-3 border-b">{app.type?.replace('-', ' ') || "Manual"}</td>
                                    <td className="py-2 px-3 border-b">{app.sessionType || "N/A"}</td>
                                    <td className="py-2 px-3 border-b">{app.reason || "N/A"}</td>
                                    <td className="py-2 px-3 border-b capitalize">{app.status || "Scheduled"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12">
                    <i className="bi bi-calendar-x text-4xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-500">No History Found</h3>
                    <p className="text-gray-400 mt-1">No appointments match the selected date and filters.</p>
                </div>
            )}
        </div>
    );
}
