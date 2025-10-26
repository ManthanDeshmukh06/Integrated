"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";

/* Helper to generate unique patient id */
const generatePatientId = (existing = []) => {
  let id;
  do {
    id = "P" + Math.floor(1000 + Math.random() * 9000);
  } while (existing.some((p) => p.id === id));
  return id;
};

const getFullName = (p) => {
  const fn = p.firstName?.trim() || "";
  const ln = p.lastName?.trim() || "";
  return (fn + (ln ? " " + ln : "")).trim() || p.name || "—";
};

export default function PatientsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ gender: "all", age: "all" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAnimating, setModalAnimating] = useState(false);

  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    age: "",
    phone: "",
    email: "",
    address: "",
  });

  // Load patients from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("patients");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const normalized = parsed.map((p) => {
          const copy = { ...p };
          if (!copy.firstName && copy.name) {
            const parts = copy.name.trim().split(" ");
            copy.firstName = parts.shift() || "";
            copy.lastName = parts.join(" ") || "";
          }
          if ((copy.age === undefined || copy.age === "") && copy.dob) {
            const today = new Date();
            const bd = new Date(copy.dob);
            let age = today.getFullYear() - bd.getFullYear();
            const m = today.getMonth() - bd.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
            copy.age = age;
          }
          return copy;
        });
        setPatients(normalized);
        localStorage.setItem("patients", JSON.stringify(normalized));
      } catch (err) {
        console.error("Failed to parse patients:", err);
        setPatients([]);
      }
    } else {
      const demo = [
        { id: "P1001", firstName: "Ravindra", lastName: "Shardul", phone: "9322078972", gender: "Male", dob: "1990-01-01", age: 34, email: "", address: "" },
        { id: "P1002", firstName: "Okok", lastName: "", phone: "857875585", gender: "Male", dob: "1992-02-02", age: 32, email: "", address: "" },
      ];
      setPatients(demo);
      localStorage.setItem("patients", JSON.stringify(demo));
    }
  }, []);

  const persistPatients = (arr) => {
    setPatients(arr);
    localStorage.setItem("patients", JSON.stringify(arr));
    window.dispatchEvent(new Event("patientsUpdated"));
  };

  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => setModalAnimating(true), 10);
  };

  const closeModal = () => {
    setModalAnimating(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setNewPatient({
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
        age: "",
        phone: "",
        email: "",
        address: "",
      });
    }, 220);
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
    if (!newPatient.firstName?.trim()) return "First name is required.";
    if (!newPatient.lastName?.trim()) return "Last name is required.";
    if (!newPatient.phone || !/^\d{7,15}$/.test(newPatient.phone.trim())) return "Enter a valid phone number (7-15 digits).";
    if (!newPatient.dob) return "Date of birth is required.";
    if (!newPatient.gender) return "Please select gender.";
    return null;
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    const err = validateAdd();
    if (err) {
      alert(err);
      return;
    }
    const id = generatePatientId(patients);
    const toAdd = { ...newPatient, id };
    const updated = [...patients, toAdd];
    persistPatients(updated);
    closeModal();
  };

  const filtered = patients.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      const name = (getFullName(p) || "").toLowerCase();
      const idStr = (p.id || "").toLowerCase();
      if (!name.includes(q) && !idStr.includes(q) && !(p.phone || "").includes(q)) return false;
    }

    if (filters.gender !== "all" && p.gender !== filters.gender) return false;

    if (filters.age !== "all") {
      if (filters.age === "child" && !(p.age < 13)) return false;
      if (filters.age === "adult" && !(p.age >= 13 && p.age < 60)) return false;
      if (filters.age === "senior" && !(p.age >= 60)) return false;
    }

    return true;
  });

  const clearFilters = () => setFilters({ gender: "all", age: "all" });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
              <p className="text-sm text-gray-600 mt-1">Manage all registered patients</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search patients..."
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>

              <button 
                onClick={() => setIsFilterOpen(true)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filters
              </button>

              <button 
                onClick={openModal}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Patient
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Male Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{patients.filter(p => p.gender === 'Male').length}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Female Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{patients.filter(p => p.gender === 'Female').length}</p>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg">
                  <svg className="h-6 w-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Patients Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {p.firstName?.charAt(0)}{p.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{getFullName(p)}</div>
                            <div className="text-sm text-gray-500">{p.dob}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {p.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{p.phone}</div>
                        <div className="text-sm text-gray-500">{p.email || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.gender === 'Male' ? 'bg-green-100 text-green-800' : 
                          p.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {p.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {p.age} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => router.push(`/patients/${p.id}?mode=view`)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="mt-2 text-sm font-medium">No patients found</p>
                          <p className="text-xs">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Patient Modal */}
      {isModalOpen && (
        <>
          <div
            className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity ${modalAnimating ? "opacity-100" : "opacity-0"}`}
            onClick={closeModal}
          />

          <div
            className={`fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-xl transform transition-all duration-220 ${modalAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Patient</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    value={newPatient.firstName}
                    onChange={(e) => setNewPatient((s) => ({ ...s, firstName: e.target.value }))}
                    placeholder="John"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    value={newPatient.lastName}
                    onChange={(e) => setNewPatient((s) => ({ ...s, lastName: e.target.value }))}
                    placeholder="Doe"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={newPatient.gender}
                  onChange={(e) => setNewPatient((s) => ({ ...s, gender: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={newPatient.dob}
                  onChange={(e) => handleDobChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {newPatient.age && (
                  <p className="text-sm text-gray-600 mt-1">Age: {newPatient.age} years</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient((s) => ({ ...s, phone: e.target.value }))}
                  placeholder="9876543210"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient((s) => ({ ...s, email: e.target.value }))}
                  placeholder="john.doe@example.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={newPatient.address}
                  onChange={(e) => setNewPatient((s) => ({ ...s, address: e.target.value }))}
                  placeholder="Street, City, State, ZIP Code"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button 
                type="button" 
                onClick={closeModal}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                onClick={handleAddPatient}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add Patient
              </button>
            </div>
          </div>
        </>
      )}

      {/* Filters Modal */}
      {isFilterOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Filter Patients</h3>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select 
                  value={filters.gender} 
                  onChange={(e) => setFilters((s) => ({ ...s, gender: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Genders</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                <select 
                  value={filters.age} 
                  onChange={(e) => setFilters((s) => ({ ...s, age: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Ages</option>
                  <option value="child">Child (&lt;13)</option>
                  <option value="adult">Adult (13–59)</option>
                  <option value="senior">Senior (60+)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between p-4 border-t border-gray-200">
              <button 
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear All
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}