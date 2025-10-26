"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [hospitalId, setHospitalId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const e = {};
    if (!hospitalId.trim()) e.hospitalId = "Hospital ID is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(email.trim())) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); 

    const user = {
      hospitalId: hospitalId.trim(),
      email: email.trim(),
      loggedAt: new Date().toISOString(),
    };

    localStorage.setItem("hmsUser", JSON.stringify(user));
    localStorage.setItem("loggedIn", "true");

    setIsLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative z-10">
        {/* Left: Brand Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 lg:p-12 text-white overflow-hidden">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <span className="text-2xl font-bold">Meraki HMS</span>
                  <div className="text-blue-200 text-sm">Healthcare Management System</div>
                </div>
              </div>

              <div className="mb-6">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  Welcome to <span className="text-blue-200"> Smart Healthcare </span>
                </h1>
                <p className="text-blue-100 text-lg leading-relaxed opacity-90">
                  Experience the future of hospital management with our secure, intuitive platform.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between text-blue-200">
                  <div className="flex-1 h-px bg-blue-500/30"></div>
                  <span className="px-4 text-sm font-medium">Trusted by Leading Hospitals</span>
                  <div className="flex-1 h-px bg-blue-500/30"></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">500+</div>
                    <div className="text-xs text-blue-200">Daily Patients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">99.9%</div>
                    <div className="text-xs text-blue-200">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">A+</div>
                    <div className="text-xs text-blue-200">Security</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="p-8 lg:p-12 relative">
          <div className="relative z-10 max-w-md mx-auto w-full">
            <div className="text-center lg:text-left mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Login Portal
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900"> Access Your Account </h2>
              <p className="text-gray-600 mt-2">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hospital ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hospital ID <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  value={hospitalId}
                  onChange={(e) => setHospitalId(e.target.value)}
                  onFocus={() => setActiveField("hospitalId")}
                  onBlur={() => setActiveField("")}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-gray-900 placeholder-gray-400 ${
                    errors.hospitalId
                      ? "border-red-500 bg-red-50"
                      : activeField === "hospitalId"
                      ? "border-blue-500 bg-white shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  placeholder="HOSP-001"
                />
                {errors.hospitalId && <p className="text-red-600 text-sm mt-2">{errors.hospitalId}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Email Address <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField("")}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-gray-900 placeholder-gray-400 ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : activeField === "email"
                      ? "border-blue-500 bg-white shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  placeholder="your.email@hospital.com"
                  type="email"
                />
                {errors.email && <p className="text-red-600 text-sm mt-2">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Password <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setActiveField("password")}
                    onBlur={() => setActiveField("")}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 pr-12 text-gray-900 placeholder-gray-400 ${
                      errors.password
                        ? "border-red-500 bg-red-50"
                        : activeField === "password"
                        ? "border-blue-500 bg-white shadow-lg"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-2">{errors.password}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>
            </form>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Secure Access Notice</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Your credentials are encrypted end-to-end. Contact your system administrator for account setup.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
