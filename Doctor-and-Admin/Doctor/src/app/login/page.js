"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginSelection() {
  const router = useRouter();
  const [role, setRole] = useState("doctor");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === "admin") {
      router.push("/admin/login");
    } else if (role === "receptionist") {
      router.push("/receptionist/login");
    } else {
      router.push("/login/doctorLogin"); // your doctor login path
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative z-10 p-10 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Welcome to <span className="text-blue-600">Meraki HMS</span>
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Choose your role to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-6 flex-wrap">
            {/* Doctor Card */}
            <button
              type="button"
              onClick={() => setRole("doctor")}
              className={`flex flex-col items-center justify-center w-40 h-40 rounded-2xl border-2 transition-all duration-300 ${
                role === "doctor"
                  ? "border-blue-600 bg-blue-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-400 bg-white"
              }`}
            >
              <svg
                className="w-12 h-12 mb-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0-1.104.896-2 2-2h0a2 2 0 012 2v2a2 2 0 01-2 2h0a2 2 0 01-2-2v-2zm-6 9v-2a4 4 0 014-4h4a4 4 0 014 4v2"
                />
              </svg>
              <span className="font-semibold text-gray-800">Doctor</span>
            </button>

            {/* Admin Card */}
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex flex-col items-center justify-center w-40 h-40 rounded-2xl border-2 transition-all duration-300 ${
                role === "admin"
                  ? "border-cyan-600 bg-cyan-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-400 bg-white"
              }`}
            >
              <svg
                className="w-12 h-12 mb-2 text-cyan-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 4v2m4-2v2m-9 4h14m-2 4h2m-2 4h2M4 14h2m-2 4h2m2-4h8m-8 4h8"
                />
              </svg>
              <span className="font-semibold text-gray-800">Admin</span>
            </button>

            {/* Receptionist Card */}
            <button
              type="button"
              onClick={() => setRole("receptionist")}
              className={`flex flex-col items-center justify-center w-40 h-40 rounded-2xl border-2 transition-all duration-300 ${
                role === "receptionist"
                  ? "border-pink-600 bg-pink-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-400 bg-white"
              }`}
            >
              <svg
                className="w-12 h-12 mb-2 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-9-5m9 5l9-5"
                />
              </svg>
              <span className="font-semibold text-gray-800">Receptionist</span>
            </button>
          </div>

          <button
            type="submit"
            className="mt-8 w-full py-3.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 
                     transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Continue to{" "}
            {role === "doctor"
              ? "Doctor"
              : role === "admin"
              ? "Admin"
              : "Receptionist"}{" "}
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
