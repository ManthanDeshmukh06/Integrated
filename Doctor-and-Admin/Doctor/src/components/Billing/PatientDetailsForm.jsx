import React from "react";

export default function PatientDetailsForm({ patient, setPatient }) {
  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-blue-100 p-4 rounded-lg mb-4 shadow-md">
      <h2 className="text-xl font-semibold text-blue-700 mb-3">
        Patient Details
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Patient Name */}
        <input
          type="text"
          name="name"
          value={patient.name}
          onChange={handleChange}
          placeholder="Patient Name"
          className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Contact Number */}
        <input
          type="text"
          name="contact"
          value={patient.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Gender */}
        <select
          name="gender"
          value={patient.gender}
          onChange={handleChange}
          className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        {/* Age */}
        <input
          type="number"
          name="age"
          value={patient.age}
          onChange={handleChange}
          placeholder="Age"
          className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Doctor Name */}
        <select
          name="doctorName"
          value={patient.doctorName}
          onChange={handleChange}
          className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-2"
        >
          <option value="">Select Doctor</option>
          <option>Dr. Amit Deshmukh (Cardiologist)</option>
          <option>Dr. Priya Kulkarni (Pediatrician)</option>
          <option>Dr. Rohan Mehta (Orthopedic)</option>
          <option>Dr. Neha Patil (Gynecologist)</option>
          <option>Dr. Vivek Sharma (General Physician)</option>
        </select>
      </div>
    </div>
  );
}
