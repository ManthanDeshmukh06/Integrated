"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

// ✅ Use environment variable (recommended)
// Make sure you have NEXT_PUBLIC_API_URL=http://localhost:3000 in your .env.local
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AddDoctorModal({ isOpen, onClose, onDoctorAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    hospital_id: "HOSP01", // Default ID for testing
    specialization: "",
    workingHours: "9:00-17:00",
    slotSize: 15,
    breaks: "13:00-14:00",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // ✅ Update hospital_id once on mount based on localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("hmsUser"));
      if (storedUser?.hospitalId) {
        setFormData((prev) => ({
          ...prev,
          hospital_id: storedUser.hospitalId,
        }));
      }
    }
  }, []); // empty dependency array prevents infinite loop

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
      const processedData = {
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        password: formData.password,
        hospital_id: formData.hospital_id,
        specialization: formData.specialization,
        workingHours: {
          start: formData.workingHours.split("-")[0],
          end: formData.workingHours.split("-")[1],
        },
        slotSize: Number(formData.slotSize),
        breaks: [
          {
            start: formData.breaks.split("-")[0],
            end: formData.breaks.split("-")[1],
          },
        ],
      };

      const response = await axios.post(
        `${API_BASE_URL}/doctors/register`,
        processedData
      );

      setSuccess(true);
      onDoctorAdded?.(response.data.doctor);

      // Reset form
      setFormData({
        name: "",
        email: "",
        contact: "",
        password: "",
        hospital_id: formData.hospital_id, // keep same hospital
        specialization: "",
        workingHours: "9:00-17:00",
        slotSize: 15,
        breaks: "13:00-14:00",
      });

      setTimeout(onClose, 2000);
    } catch (err) {
      console.error("❌ Doctor registration error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to register doctor. Please check your backend connection.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
    ...props
  }) => (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        {...props}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Register New Doctor
          </h3>
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <i className="bi bi-arrow-left text-base"></i> Back
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 mb-4 bg-green-100 text-green-700 rounded-lg">
            Doctor registered successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              name="name"
              placeholder="Dr. Priya Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="priya.sharma@hms.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Contact Number"
              name="contact"
              placeholder="9876543210"
              value={formData.contact}
              onChange={handleChange}
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <InputField
            label="Specialization"
            name="specialization"
            placeholder="Cardiology, Neurology, etc."
            value={formData.specialization}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <InputField
              label="Working Hours"
              name="workingHours"
              placeholder="9:00-17:00"
              value={formData.workingHours}
              onChange={handleChange}
              required
            />
            <InputField
              label="Slot Size (min)"
              name="slotSize"
              type="number"
              placeholder="15"
              value={formData.slotSize}
              onChange={handleChange}
              required
            />
            <InputField
              label="Breaks"
              name="breaks"
              placeholder="13:00-14:00"
              value={formData.breaks}
              onChange={handleChange}
            />
          </div>

          <input
            type="hidden"
            name="hospital_id"
            value={formData.hospital_id}
            onChange={handleChange}
          />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              }`}
            >
              {loading ? (
                <>
                  <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                  Registering...
                </>
              ) : (
                "Register Doctor"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
