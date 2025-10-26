
"use client";
import StatCards from "../../../components/doctor/dashboard/StatCards";
import TodaySchedule from "../../../components/doctor/dashboard/TodaySchedule";
import { useDoctorAuth } from "../../../hooks/useDoctorAuth";

export default function DoctorDashboard() {
  const { user } = useDoctorAuth();

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
          Welcome back
          {user?.email ? ", Dr. " + user?.email.split("@")[0] : ", Doctor"}
        </h1>
        <p className="text-gray-600 mt-2">
          Here&apos;s your schedule for today.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="mb-6 lg:mb-8">
        <StatCards />
      </div>

      {/* Today's Schedule - Full Width */}
      <div className="mb-6 lg:mb-8">
        <TodaySchedule />
      </div>
    </>
  );
}
