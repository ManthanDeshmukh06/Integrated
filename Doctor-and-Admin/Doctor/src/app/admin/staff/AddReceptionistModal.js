"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

// API base URL from .env.local
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ReceptionistModal({ isOpen, onClose, onReceptionistAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    hospital_id: "HOSP01", // default for testing
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load hospital ID from localStorage once
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("hmsUser"));
      if (storedUser?.hospitalId) {
        setFormData((prev) => ({ ...prev, hospital_id: storedUser.hospitalId }));
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/receptionists/register`, formData);

      setSuccess(true);
      onReceptionistAdded?.(response.data.receptionist);

      // Reset form (keep hospital_id)
      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        hospital_id: formData.hospital_id,
      });

      // Close modal after 2 seconds
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error("Receptionist Registration Error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to register. Check backend.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = "text", placeholder, value, onChange, required = false }) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-bold text-gray-800">Register Receptionist</h3>
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <i className="bi bi-arrow-left text-base"></i> Back
          </button>
        </div>

        {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        {success && <div className="p-3 mb-4 bg-green-100 text-green-700 rounded-lg">Receptionist registered successfully!</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
          <InputField label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} required />
          <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />

          {/* Hidden Hospital ID */}
          <input type="hidden" name="hospital_id" value={formData.hospital_id} />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"}`}
            >
              {loading ? (
                <>
                  <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                  Registering...
                </>
              ) : (
                "Register Receptionist"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
