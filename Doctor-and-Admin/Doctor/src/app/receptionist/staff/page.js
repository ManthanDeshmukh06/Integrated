"use client";
import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function StaffDirectory({ onShiftUpdate }) {
  const [staffData, setStaffData] = useState([]);
  const [activeRole, setActiveRole] = useState("doctor");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null); // This will now include shift details
  const [selectedDate, setSelectedDate] = useState("");
  const [shifts, setShifts] = useState([{ start: "", end: "" }]);
  const [savedWindows, setSavedWindows] = useState([]);
  const hospitalId = "HOSP01";

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // Fetch doctors via Next.js proxy (/api -> backend)
        const doctorsRes = await api.get(`/doctors/hospital/${hospitalId}`);
        
        // Format doctors and assign the 'doctor' role for the UI filters.
        const formattedStaff = doctorsRes.data.map(staff => ({
          ...staff,
          id: staff._id, // Use the MongoDB ID
          role: 'doctor', // Manually assign role for filtering
          department: staff.specialization, // Align department field
          photo: staff.photo || '/default-avatar.png' // Fallback to a default image
        }));
        setStaffData(formattedStaff);
      } catch (error) {
        console.error("Failed to fetch staff data:", error);
        // It's good practice to inform the user.
        alert("Could not load staff data. Please check the console for details.");
      }
    };
    fetchStaff();
  }, []);

  const roleBasedStaff = staffData.filter((staff) => staff.role === activeRole);

  const filteredList = roleBasedStaff.filter(
    (staff) =>
      staff.name.toLowerCase().includes(search.toLowerCase()) &&
      (departmentFilter ? staff.department === departmentFilter : true)
  );

  const uniqueDepartments = [
    ...new Set(roleBasedStaff.map((s) => s.department).filter(Boolean)),
  ];

  const handleShiftChange = (index, field, value) => {
    const newShifts = [...shifts];
    newShifts[index][field] = value;
    setShifts(newShifts);
  };

  const addShift = () => {
    setShifts([...shifts, { start: "", end: "" }]);
  };

  const removeShift = (index) => {
    if (shifts.length > 1) {
      const newShifts = shifts.filter((_, i) => i !== index);
      setShifts(newShifts);
    }
  };

  const handleSaveShift = async () => {
    if (!selectedDate) {
      alert("Please select a date for the shift(s).");
      return;
    }

    const validShifts = shifts.filter(shift => shift.start && shift.end);
    if (validShifts.length === 0) {
      alert("Please fill in at least one complete shift (start and end time).");
      return;
    }

    try {
      const availabilityData = {
        hospitalId,
        doctorId: selectedStaff._id,
        date: selectedDate,
        slots: validShifts,
      };

      await api.post(`/appointments/availability`, availabilityData);

      alert("Shift timings saved successfully!");

      // Refresh saved windows for the selected date so they appear immediately
      try {
        const res = await api.get(`/appointments/availability/raw/${selectedStaff._id}/${selectedDate}`);
        const slots = Array.isArray(res.data?.slots) ? res.data.slots : [];
        setSavedWindows(slots);
      } catch (_) {
        setSavedWindows([]);
      }

      // Reset input rows
      setShifts([{ start: "", end: "" }]);
    } catch (error) {
      console.error("Failed to save shift:", error);
      alert(`Failed to save shift: ${error.response?.data?.message || error.message}`);
    }
  };

  // Load saved windows when a staff (doctor) and date are selected
  useEffect(() => {
    const fetchWindows = async () => {
      if (!selectedStaff || selectedStaff.role !== "doctor" || !selectedDate) { setSavedWindows([]); return; }
      try {
        const res = await api.get(`/appointments/availability/raw/${selectedStaff._id}/${selectedDate}`);
        const slots = Array.isArray(res.data?.slots) ? res.data.slots : [];
        setSavedWindows(slots);
      } catch (e) {
        setSavedWindows([]);
      }
    };
    fetchWindows();
  }, [selectedStaff, selectedDate]);

  const handleDeleteWindow = async (win) => {
    if (!selectedStaff || !selectedDate) return;
    const ok = confirm(`Delete shift ${win.start} - ${win.end}? This will cancel appointments in this window and email patients.`);
    if (!ok) return;
    try {
      await api.delete(`/appointments/availability/${selectedStaff._id}/${selectedDate}`, { params: { start: win.start, end: win.end } });
      // refresh windows
      const res = await api.get(`/appointments/availability/raw/${selectedStaff._id}/${selectedDate}`);
      setSavedWindows(Array.isArray(res.data?.slots) ? res.data.slots : []);
      alert("Shift deleted and affected patients notified.");
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
            Staff Directory
          </h1>
          <p className="text-gray-600 mb-6">
            Find and connect with our healthcare professionals
          </p>

          {/* Navbar Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl w-full">
            {["doctor", "nurse", "ambulance"].map((role) => (
              <button
                key={role}
                onClick={() => {
                  setActiveRole(role);
                  setSearch("");
                  setDepartmentFilter("");
                }}
                className={`flex-1 py-3 px-4 text-sm font-medium capitalize transition-all duration-300 rounded-lg ${
                  activeRole === role
                    ? "bg-[#2563eb] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                {role === "doctor"
                  ? "Doctors"
                  : role === "nurse"
                  ? "Nurses"
                  : "Ambulance"}
              </button>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-gray-700"
              />
            </div>
            <div className="md:w-64">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-gray-700"
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map((dept, index) => (
                  <option key={`${dept}-${index}`} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Staff Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredList.map((staff) => (
            <div
              key={staff.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#2563eb] hover:translate-y-[-4px] group"
              onClick={() => {
                setSelectedStaff(staff);
                setShifts([{ start: "", end: "" }]);
                setSelectedDate("");
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center overflow-hidden group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors">
                    <img // The photo path might need adjustment based on backend data
                      src={staff.photo}
                      alt={staff.name}
                      className="w-18 h-18 rounded-full object-cover"
                    />
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
                      staff.available ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {staff.name}
                </h2>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  {staff.department}
                </p>
                <p className="text-xs text-gray-500 mb-2">{staff.contact}</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    staff.available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {staff.available ? "Available" : "Not Available"}
                </span>
                <div className="mt-4 text-xs text-[#2563eb] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Profile →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedStaff && (
          <div
            className="fixed inset-0 bg-blue-100 bg-opacity-80 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
            onClick={() => setSelectedStaff(null)}
          >
            <div
              className="bg-white p-6 rounded-2xl w-full max-w-md relative shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setSelectedStaff(null);
                  setSelectedDate("");
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-gray-100 rounded-full p-1"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center overflow-hidden mb-6">
                  <img // The photo path might need adjustment based on backend data
                    src={selectedStaff.photo}
                    alt={selectedStaff.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedStaff.name}
                </h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                    {selectedStaff.role}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedStaff.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedStaff.available ? "Available" : "Not Available"}
                  </span>
                </div>

                {/* Details */}
                <div className="w-full bg-gray-50 rounded-xl p-5 mt-4 text-left">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Department
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedStaff.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Contact
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedStaff.contact}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Email
                      </p>
                      <p className="text-sm text-gray-900 break-words">
                        {selectedStaff.email || "N/A"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Experience
                        </p>
                        <p className="text-sm text-gray-900">
                          {selectedStaff.experience || "N/A"} years
                        </p>
                      </div>
                    </div>
                    {selectedStaff.qualifications && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Qualifications
                        </p>
                        <p className="text-sm text-gray-900">
                          {selectedStaff.qualifications}
                        </p>
                      </div>
                    )}
                  {/* Inline Shifts under Experience */}
                  {selectedDate && savedWindows.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Shifts for {selectedDate}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {savedWindows.map((w, idx) => (
                          <span key={`${w.start}-${w.end}-${idx}`} className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs">
                            {w.start} - {w.end}
                            <button
                              title="Delete shift"
                              onClick={() => handleDeleteWindow(w)}
                              className="text-red-600 hover:text-red-700 p-0.5"
                              aria-label={`Delete shift ${w.start}-${w.end}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 3a1 1 0 0 0-1 1v1H5.5a1 1 0 1 0 0 2H6v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7h.5a1 1 0 1 0 0-2H16V4a1 1 0 0 0-1-1H9zm2 2h2v1h-2V5zM8 7h10v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7zm3 3a1 1 0 1 0-2 0v7a1 1 0 1 0 2 0v-7zm5 0a1 1 0 1 0-2 0v7a1 1 0 1 0 2 0v-7z"/>
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  </div>
                </div>

                {/* Shift Inputs Only for Doctors */}
                {selectedStaff.role === "doctor" && (
                  <div className="w-full mt-6 text-left">
                    <h3 className="text-md font-semibold text-gray-800 mb-3 border-b pb-2">
                      Shift Timings
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={today}
                        className="px-3 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    {/* Read-only preview for the selected date (no delete here) */}
                    {selectedDate && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Saved Shifts for {selectedDate}</p>
                        {savedWindows.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {savedWindows.map((w, idx) => (
                              <span
                                key={`${w.start}-${w.end}-${idx}`}
                                className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 text-xs"
                              >
                                {w.start} - {w.end}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">No saved shifts for this date.</p>
                        )}
                      </div>
                    )}
                    {shifts.map((shift, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end mt-2">
                        <div className="col-span-5">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={shift.start}
                            onChange={(e) => handleShiftChange(index, "start", e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-5">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={shift.end}
                            onChange={(e) => handleShiftChange(index, "end", e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-2 flex items-center">
                          {shifts.length > 1 && (
                            <button onClick={() => removeShift(index)} className="text-red-500 hover:text-red-700 p-2">
                              -
                            </button>
                          )}
                          {index === shifts.length - 1 && (
                            <button onClick={addShift} className="text-blue-500 hover:text-blue-700 p-2">
                              +
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Save Button */}
                    <button
                      onClick={handleSaveShift}
                      className="mt-4 w-full bg-[#2563eb] text-white py-2 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                    >
                      Save Shift
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
