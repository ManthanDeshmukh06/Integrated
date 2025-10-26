"use client";
import React from "react";
import DashboardCard from "../common/DashboardCard";
import { DoctorModuleContext } from "../../../app/doctor/DoctorModuleContext";

export default function StatCards() {
  const context = React.useContext(DoctorModuleContext);
  const appointments = context?.appointments || [];

  const today = new Date().toISOString().split("T")[0];
  const todaysAppointments = appointments.filter((a) => a.date === today);
  const pendingConsultations = todaysAppointments.filter(
    (a) => a.status === "scheduled"
  );
  const prescriptionsToday = appointments.filter(
    (a) => a.status === "completed" && a.date === today
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <DashboardCard
        title="Today's Appointments"
        value={todaysAppointments.length}
        subtitle="patients"
        icon="bi bi-calendar-check"
        trend={0}
        trendPositive={true}
        color="green"
        onClick={() => console.log("Navigate to appointments")}
      />
      <DashboardCard
        title="Pending Consultations"
        value={pendingConsultations.length}
        subtitle="waiting"
        icon="bi bi-people-fill"
        trend={0}
        trendPositive={true}
        color="blue"
        onClick={() => console.log("Navigate to patient queue")}
      />
      <DashboardCard
        title="Prescriptions Today"
        value={prescriptionsToday.length}
        subtitle="issued"
        icon="bi bi-file-medical"
        trend={0}
        trendPositive={true}
        color="purple"
        onClick={() => console.log("Navigate to prescriptions")}
      />
      <DashboardCard
        title="Lab Reports Pending"
        value={0}
        subtitle="reviews"
        icon="bi bi-clipboard-data"
        trend={0}
        trendPositive={false}
        color="orange"
        onClick={() => console.log("Navigate to lab reports")}
      />
    </div>
  );
}
