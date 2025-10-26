"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();

  const [hospitalId, setHospitalId] = useState("");
  const [role, setRole] = useState("doctor"); // Default role
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const e = {};
    if (!hospitalId.trim()) e.hospitalId = "Hospital ID is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(email.trim()))
      e.email = "Enter a valid email address";
    // if (!password) e.password = "Password is required";
    // else if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      // ✅ Send login request to backend
      const response = await axios.post("http://localhost:3000/doctors/login", {
        email,
        password,
        hospital_id: hospitalId,
      });

      const { token, doctorid, hospital_id } = response.data;

      // ✅ Save to localStorage
      const user = {
        hospitalId: hospital_id, // Use hospital_id from backend response
        role,
        email: email.trim(),
        doctorid,
        token,
        loggedAt: new Date().toISOString(),
      };

      localStorage.setItem(`${role}LoggedIn`, "true");
      localStorage.setItem("hmsUser", JSON.stringify(user));

      alert("✅ Login successful!");
      router.push("/doctor/dashboard");
    } catch (error) {
      console.log("🔴 Login error details:", error); // ✅ Debugging log
      console.log("🔴 Server response:", error.response?.data); // ✅ Log backend response
      alert(
        error.response?.data?.message ||
          "Login failed. Please check console for details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative z-10">
        {/* Left Side */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 lg:p-12 text-white overflow-hidden">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-2xl font-bold">Meraki HMS</span>
                  <div className="text-blue-200 text-sm">
                    Healthcare Management System
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  Welcome to{" "}
                  <span className="text-blue-200">Smart Healthcare</span>
                </h1>
                <p className="text-blue-100 text-lg leading-relaxed opacity-90">
                  Experience the future of hospital management with our secure,
                  intuitive platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 lg:p-12 relative">
          <div className="relative z-10 max-w-md mx-auto w-full">
            <div className="text-center lg:text-left mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-3">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Secure Login Portal
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Doctor Login
              </h2>
              <p className="text-gray-600 mt-2">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hospital ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hospital ID <span className="text-red-500">*</span>
                </label>
                <input
                  value={hospitalId}
                  onChange={(e) => setHospitalId(e.target.value)}
                  className={`w-full px-4 py-3 text-black rounded-xl border-2 transition-all duration-300 ${
                    errors.hospitalId
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-white/80 hover:border-gray-300"
                  }`}
                  placeholder="HOSP-001"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 text-black rounded-xl border-2 transition-all duration-300 ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-white/80 hover:border-gray-300"
                  }`}
                  type="email"
                  placeholder="your.email@hospital.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 text-black rounded-xl border-2 transition-all duration-300 ${
                      errors.password
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-white/80 hover:border-gray-300"
                    }`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isLoading ? "Signing In..." : "Sign In to Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
