"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import Sidebar from "../../components/Sidebar";

// --- Constants for Pagination ---
const RECORDS_PER_PAGE = 10;
// ---------------------------------

export default function PatientsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  // Drawer (Add Patient) State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerAnimating, setDrawerAnimating] = useState(false);

  // Filter Modal State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    gender: "all",
    age: "all",
    status: "all",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    age: "",
    gender: "",
    address: "",
  });

  const hospitalId = "HOSP01";

  // Function to fetch data from the server
  const fetchPatients = async () => {
    try {
      // Use the appointments endpoint which doesn't require patient authentication
      const response = await api.get(`/appointments/patients/hospital/${hospitalId}`);
      const data = Array.isArray(response.data) ? response.data : [];

      const backendPatients = data.map((p) => ({
        ...p,
        id: p._id || p.id,
        name: p.name || p.firstName || p.fullName || "",
        phone: p.phone || p.mobile || p.contact || "",
        gender: p.gender || "",
        // Calculate age if DOB is present and age is missing
        age: p.age || (p.dob ? (new Date().getFullYear() - new Date(p.dob).getFullYear()) : undefined),
        // Active status logic (default to true unless explicitly discharged)
        active: p.active !== false && !(p.is_discharged === true),
      }));
      setPatients(backendPatients);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      // In a real app, you might show a toast notification here
      setPatients([]);
    }
  };

  // Set up event listener for updates and initial fetch
  useEffect(() => {
    fetchPatients();
    window.addEventListener("patientsUpdated", fetchPatients);
    return () => window.removeEventListener("patientsUpdated", fetchPatients);
  }, []);

  // --- Drawer (Add Patient) Handlers ---
  const openDrawer = () => {
    setIsDrawerOpen(true);
    setTimeout(() => setDrawerAnimating(true), 10);
  };

  const closeDrawer = () => {
    setDrawerAnimating(false);
    setTimeout(() => {
      setIsDrawerOpen(false);
      // Reset form fields
      setNewPatient({
        name: "",
        email: "",
        phone: "",
        dob: "",
        age: "",
        gender: "",
        address: "",
      });
    }, 300);
  };

  const handleDobChange = (val) => {
    const today = new Date();
    const birthDate = new Date(val);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    setNewPatient((s) => ({ ...s, dob: val, age }));
  };

  const validateAdd = () => {
    if (!newPatient.name || newPatient.name.trim().length === 0)
      return "Full name is required.";
    if (!newPatient.phone || !/^\d{7,15}$/.test(newPatient.phone.trim()))
      return "Enter a valid mobile number (digits only, 7-15 length).";
    if (!newPatient.dob) return "Date of birth is required.";
    if (!newPatient.gender) return "Please select gender.";
    if (!newPatient.email) return "Email is required.";
    return null;
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    const err = validateAdd();
    if (err) {
      alert(err);
      return;
    }

    try {
      const patientData = {
        firstName: newPatient.name,
        lastName: "", // Optional field
        email: newPatient.email,
        phone: newPatient.phone,
        hospitalId: hospitalId,
        dob: newPatient.dob,
        gender: newPatient.gender,
        address: newPatient.address,
      };

      // 1. Post new patient data to the server using appointments endpoint
      await api.post("/appointments/register-patient", patientData);

      // 2. Trigger a full list re-fetch from the server
      window.dispatchEvent(new Event("patientsUpdated"));

      closeDrawer();
      // Reset page to 1 after adding a new patient
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to add patient:", error);
      alert(
        `Error: ${error.response?.data?.error || "Could not add patient. Check console for details."}`
      );
    }
  };
  // ---------------------------------------------

  // --- Patient List Actions ---
  const handleRemove = (id) => {
    if (!confirm("Remove patient from active list? (Data will be retained)")) {
      return;
    }
    // Perform soft removal locally, the actual API call would go here to set active: false
    // Since we don't have a specific API for soft delete, we'll simulate the state change and re-fetch later
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: false } : p))
    );
    // In a real app:
    // await api.put(`/patients/${id}/status`, { active: false });
    // window.dispatchEvent(new Event("patientsUpdated"));
  };
  // ----------------------------

  // --- Filtering and Searching Logic (Memoized) ---
  const filtered = useMemo(() => {
    // Reset page to 1 whenever filters or search change
    setCurrentPage(1);

    return patients.filter((p) => {
      // 1. Status Filter
      if (filters.status === "active" && !p.active) return false;
      if (filters.status === "removed" && p.active) return false;

      // 2. Search Filter
      if (search) {
        const q = search.toLowerCase();
        const match =
          (p.name || "").toLowerCase().includes(q) ||
          (p.id || "").toLowerCase().includes(q) ||
          (p.phone || "").includes(q);
        if (!match) return false;
      }

      // 3. Gender Filter
      if (filters.gender !== "all" && p.gender !== filters.gender) return false;

      // 4. Age Group Filter
      if (filters.age !== "all") {
        const patientAge = p.age;
        if (filters.age === "child" && !(patientAge !== undefined && patientAge < 13))
          return false;
        if (
          filters.age === "adult" &&
          !(patientAge !== undefined && patientAge >= 13 && patientAge < 60)
        )
          return false;
        if (filters.age === "senior" && !(patientAge !== undefined && patientAge >= 60))
          return false;
      }
      return true;
    });
  }, [patients, search, filters]);

  const clearFilters = () => {
    setFilters({ gender: "all", age: "all", status: "all" });
    setIsFilterOpen(false); // Close the modal upon clearing
  };
  // ------------------------------------------------

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filtered.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;

  // Get the patients for the current page
  const paginatedPatients = filtered.slice(startIndex, endIndex);

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  // -------------------------

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Patients List
            </h1>
            <p className="text-sm text-slate-500">
              Manage walk-ins and registered patients
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID or phone..."
                className="pl-10 pr-4 py-2 rounded-lg border-2 border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="px-3 py-2 bg-slate-100 rounded-md hover:bg-slate-200"
            >
              Filters
            </button>

            <button
              onClick={openDrawer}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Add Patient
            </button>
          </div>
        </div>

        {/* --- Patient Table --- */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Patient ID</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Gender</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.map((p) => (
                <tr key={p.id || p._id || Math.random()} className={`border-b ${p.active ? "hover:bg-slate-50" : "bg-slate-50"}`}>
                  <td
                    className={`p-3 ${
                      p.active ? "text-slate-900" : "text-gray-400"
                    }`}
                  >
                    {p.name}
                  </td>
                  <td
                    className={`p-3 ${
                      p.active ? "text-slate-900" : "text-gray-400"
                    }`}
                  >
                    {p.id}
                  </td>
                  <td
                    className={`p-3 ${
                      p.active ? "text-slate-900" : "text-gray-400"
                    }`}
                  >
                    {p.phone}
                  </td>
                  <td
                    className={`p-3 ${
                      p.active ? "text-slate-900" : "text-gray-400"
                    }`}
                  >
                    {p.gender}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => router.push(`/patients/${p.id}?mode=view`)}
                      className="px-3 py-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100"
                    >
                      View
                    </button>

                    {p.active && (
                      <button
                        onClick={() => handleRemove(p.id)}
                        className="px-3 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {paginatedPatients.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-slate-500" colSpan={5}>
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* --- End Patient Table --- */}

        {/* --- Pagination Controls --- */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-slate-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded-md ${currentPage === 1 ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-slate-100'}`}
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-md">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded-md ${currentPage === totalPages ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-slate-100'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
        {/* --- End Pagination Controls --- */}

      </main>

      {/* --- Add Patient Drawer --- */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          <aside
            className={`fixed right-0 top-0 z-50 h-full w-[420px] bg-white shadow-2xl p-6 transform transition-transform duration-300 ${
              drawerAnimating ? "translate-x-0" : "translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Add New Patient
              </h3>
              <button onClick={closeDrawer} className="text-slate-500">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-3 overflow-y-auto h-[90%] pb-10">
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient((s) => ({ ...s, name: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={newPatient.email}
                  onChange={(e) =>
                    setNewPatient((s) => ({ ...s, email: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                  placeholder="Mobile number for login"
                  className="w-full border rounded px-3 py-2"
                  value={newPatient.phone}
                  onChange={(e) =>
                    setNewPatient((s) => ({ ...s, phone: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Date of Birth</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={newPatient.dob}
                  onChange={(e) => handleDobChange(e.target.value)}
                />
                {newPatient.age !== "" && newPatient.age !== undefined && (
                  <p className="text-sm text-slate-600 mt-1">
                    Age: {newPatient.age} years
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Gender</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={newPatient.gender}
                  onChange={(e) =>
                    setNewPatient((s) => ({ ...s, gender: e.target.value }))
                  }
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Address</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  value={newPatient.address}
                  onChange={(e) =>
                    setNewPatient((s) => ({ ...s, address: e.target.value }))
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Save Patient
                </button>
              </div>
            </form>
          </aside>
        </>
      )}
      {/* --- End Add Patient Drawer --- */}

      {/* --- Filter Modal --- */}
      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-6 rounded-xl shadow-2xl w-96">
            <h3 className="text-xl font-semibold mb-4">Filter Patients</h3>

            <div className="space-y-4">
              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  value={filters.gender}
                  onChange={(e) => setFilters(s => ({ ...s, gender: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="all">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Age Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Age Group</label>
                <select
                  value={filters.age}
                  onChange={(e) => setFilters(s => ({ ...s, age: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="all">All Ages</option>
                  <option value="child">Child (0-12)</option>
                  <option value="adult">Adult (13-59)</option>
                  <option value="senior">Senior (60+)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(s => ({ ...s, status: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="all">All Patients</option>
                  <option value="active">Active</option>
                  <option value="removed">Removed (Inactive)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between gap-3 mt-6">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border rounded-md text-red-600 hover:bg-red-50"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
      {/* --- End Filter Modal --- */}
    </div>
  );
}