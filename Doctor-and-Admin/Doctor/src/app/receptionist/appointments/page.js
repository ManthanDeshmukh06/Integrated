"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import Sidebar from "../../components/Sidebar";
import BillingPage from "@/components/Billing/BillingPage";
export default function AppointmentsPage() {
  const router = useRouter();
  const [tab, setTab] = useState("scheduled");
  const [mode, setMode] = useState("book"); // "book" | "view"
  const [viewTab, setViewTab] = useState("scheduled"); // inside View: "scheduled" | "recent"
  const [currentPageScheduled, setCurrentPageScheduled] = useState(1);
  const [currentPageRecent, setCurrentPageRecent] = useState(1);
  const pageSize = 6;
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [resModal, setResModal] = useState({
    open: false,
    appt: null,
    date: "",
    slot: "",
    slots: [],
  });
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientId: "",
    reason: "",
    department: "",
    doctor: "",
    date: "", // This will be initialized to today in useEffect
    startTime: "",
    sessionType: "checkup",
    appointmentType: "In-person",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [allMeetings, setAllMeetings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const hospitalId = "HOSP01";

  useEffect(() => {
    const role = localStorage.getItem("hmsRole");
    const token = role ? localStorage.getItem(`${role}AuthToken`) : null;
    if (!role || !token) {
      router.push("/login");
      return;
    }
    const fetchInitialData = async () => {
      try {
        const appointmentsRes = await api.get(
          `/appointments/hospital/${hospitalId}`
        );
        // Format and set appointments with computed timestamps
        const formattedAppointments = appointmentsRes.data.map((apt) => {
          const startIso = `${apt.date}T${apt.slotStart}`; // YYYY-MM-DDTHH:mm
          const endIso = `${apt.date}T${apt.slotEnd || apt.slotStart}`;
          const startMs = new Date(startIso).getTime();
          const endMs = new Date(endIso).getTime();
          return {
            ...apt,
            id: apt._id,
            patientName: apt.patientName || "Unknown Patient",
            patientId: apt.patientId, // Ensure patientId is carried over
            startMs,
            endMs,
            date: new Date(apt.date)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "-"),
            slotStart: new Date(
              `1970-01-01T${apt.slotStart}`
            ).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            slotEnd: new Date(`1970-01-01T${apt.slotEnd}`).toLocaleTimeString(
              "en-US",
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }
            ),
          };
        });
        setAllMeetings(formattedAppointments);

        const deptsRes = await api.get(
          `/appointments/departments/${hospitalId}`
        );
        setDepartments(deptsRes.data || []);

        // Fetch patients
        const patientsRes = await api.get(
          `/appointments/patients/hospital/${hospitalId}`
        );
        setPatients(patientsRes.data || []);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, [router, hospitalId]);

  useEffect(() => {
    if (formData.date && formData.doctor) {
      const fetchSlots = async () => {
        try {
          const doctorMatch = doctors.find((d) => d.name === formData.doctor);
          const doctorId =
            doctorMatch?._id || doctorMatch?.id || doctorMatch?.doctorId;
          if (!doctorId) {
            setAvailableSlots([]);
            return;
          }
          const response = await api.get(
            `/patient-appointments/available-slots`,
            {
              params: { doctorId, date: formData.date },
            }
          );
          const slots = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data?.slots)
            ? response.data.slots
            : [];
          const toMinutes = (t) => {
            if (!t) return 0;
            const parts = t.split(":");
            const hh = Number(parts[0]);
            const mm = Number(parts[1] || 0);
            return hh * 60 + mm;
          };
          const sorted = (slots || [])
            .filter((s) => s && s.slotStart)
            .sort((a, b) => toMinutes(a.slotStart) - toMinutes(b.slotStart))
            .filter(
              (s, idx, arr) =>
                idx === 0 || s.slotStart !== arr[idx - 1].slotStart
            ); // de-duplicate
          setAvailableSlots(sorted);
        } catch (error) {
          console.error("Failed to fetch available slots:", error);
          setAvailableSlots([]);
        }
      };
      fetchSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [formData.date, formData.doctor, doctors]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    if (name === "department") {
      setFormData((prev) => ({
        ...prev,
        department: value,
        doctor: "",
        date: "",
        startTime: "",
      }));
      if (value) {
        try {
          const response = await api.get(`/appointments/doctors`, {
            params: { hospitalId, department: value },
          });
          const payload = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data?.doctors)
            ? response.data.doctors
            : [];
          setDoctors(payload || []);
        } catch (error) {
          console.error("Failed to fetch doctors:", error);
          setDoctors([]);
        }
      } else {
        setDoctors([]);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleCompleteAppointment = (appointmentId) => {
    router.push(`/billing?appointmentId=${appointmentId}`);
  };
  const handleScheduleMeeting = async (e) => {
    e.preventDefault();

    if (
      !formData.patientId ||
      !formData.reason ||
      !formData.department ||
      !formData.doctor ||
      !formData.date ||
      !formData.startTime
    ) {
      alert("Please fill all fields");
      return;
    }

    const doctorId = doctors.find((d) => d.name === formData.doctor)?._id;
    if (!doctorId) {
      alert("Could not find doctor ID.");
      return;
    }

    const selectedPatient = patients.find((p) => p._id === formData.patientId);
    if (!selectedPatient) {
      alert("Please select a valid patient from the list.");
      return;
    }

    const appointmentData = {
      hospitalId,
      doctorId,
      patientId: selectedPatient._id,
      patientName:
        selectedPatient.name ||
        `${selectedPatient.firstName || ""} ${
          selectedPatient.lastName || ""
        }`.trim(),
      reason: formData.reason,
      department: formData.department, // ✅ Add department to the payload
      date: formData.date,
      slotStart: formData.startTime, // Backend expects slotStart
      sessionType: formData.sessionType,
      appointmentType:
        formData.appointmentType === "In-person" ? "manual" : "virtual",
    };

    try {
      const response = await api.post("/appointments/book", appointmentData);
      const newMeeting = response.data;

      setAllMeetings((prev) => [
        {
          ...newMeeting,
          id: newMeeting._id,
          patientName: newMeeting.patientName,
          date: new Date(newMeeting.date)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "-"),
          slotStart: new Date(
            `1970-01-01T${newMeeting.slotStart}`
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          slotEnd: new Date(
            `1970-01-01T${newMeeting.slotEnd}`
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        },
        ...prev,
      ]);

      setFormData({
        patientId: "",
        reason: "",
        department: "",
        doctor: "",
        date: "",
        startTime: "",
        sessionType: "checkup",
        appointmentType: "In-person",
      });

      setTab("scheduled");
      alert("Appointment scheduled successfully!");
    } catch (error) {
      console.error("Failed to schedule appointment:", error);
      alert(
        `Failed to schedule appointment: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const nowMs = Date.now();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayMs = startOfToday.getTime();
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const endOfTodayMs = endOfToday.getTime();

  // Scheduled: future OR later today (start time >= now)
  const scheduledMeetingsToShow = allMeetings
    .filter((m) => m.startMs && m.startMs >= nowMs && m.status !== "Cancelled")
    .sort((a, b) => a.startMs - b.startMs);

  // Recent: appointments that are done (ended before now)
  const recentMeetingsToShow = allMeetings
    .filter((m) => m.endMs && m.endMs < nowMs && m.status !== "Cancelled")
    .sort((a, b) => b.endMs - a.endMs);

  const meetingsToShow =
    tab === "scheduled" ? scheduledMeetingsToShow : recentMeetingsToShow;

  // Pagination slices
  const totalScheduledPages = Math.max(
    1,
    Math.ceil(scheduledMeetingsToShow.length / pageSize)
  );
  const totalRecentPages = Math.max(
    1,
    Math.ceil(recentMeetingsToShow.length / pageSize)
  );
  const pagedScheduled = scheduledMeetingsToShow.slice(
    (currentPageScheduled - 1) * pageSize,
    currentPageScheduled * pageSize
  );
  const pagedRecent = recentMeetingsToShow.slice(
    (currentPageRecent - 1) * pageSize,
    currentPageRecent * pageSize
  );

  const resetPagination = () => {
    setCurrentPageScheduled(1);
    setCurrentPageRecent(1);
  };

  const openReschedule = async (appt) => {
    const isoDate =
      appt.rawDate || appt.date?.split("-").reverse().join("-") || today; // reschedule same date only
    try {
      // fetch available slots for this doctor and date
      const response = await api.get(`/patient-appointments/available-slots`, {
        params: {
          doctorId: appt.doctorId || appt.doctor_id || appt.doctor?._id,
          date: isoDate,
        },
      });
      const raw = Array.isArray(response.data)
        ? response.data
        : response.data?.slots || [];
      const toMinutes = (t) => {
        const [hh, mm] = (t || "0:0").split(":");
        return Number(hh) * 60 + Number(mm);
      };
      const slots = (raw || [])
        .filter((s) => s && s.slotStart)
        .sort((a, b) => toMinutes(a.slotStart) - toMinutes(b.slotStart))
        .filter((s, i, arr) => i === 0 || s.slotStart !== arr[i - 1].slotStart);
      setResModal({ open: true, appt, date: isoDate, slot: "", slots });
    } catch (e) {
      setResModal({ open: true, appt, date: isoDate, slot: "", slots: [] });
    }
  };

  const handleCancel = async (appt) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await api.patch(
        `/patient-appointments/${appt.id || appt.appointmentId}/cancel`
      );
      await refreshAppointments();
      // If current form has same doctor/date selected, refresh slots as well
      if (formData.date) {
        try {
          const doctorMatch = doctors.find((d) => d.name === formData.doctor);
          const doctorId =
            doctorMatch?._id || doctorMatch?.id || doctorMatch?.doctorId;
          if (doctorId) {
            const response = await api.get(
              `/patient-appointments/available-slots`,
              {
                params: { doctorId, date: formData.date },
              }
            );
            const slots = Array.isArray(response.data)
              ? response.data
              : response.data?.slots || [];
            const toMinutes = (t) => {
              const [hh, mm] = (t || "0:0").split(":");
              return Number(hh) * 60 + Number(mm);
            };
            const sorted = (slots || [])
              .filter((s) => s && s.slotStart)
              .sort((a, b) => toMinutes(a.slotStart) - toMinutes(b.slotStart));
            setAvailableSlots(sorted);
          }
        } catch (_) {}
      }
      alert("Appointment cancelled");
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  const refreshAppointments = async () => {
    try {
      const appointmentsRes = await api.get(
        `/appointments/hospital/${hospitalId}`
      );
      const formattedAppointments = appointmentsRes.data.map((apt) => {
        const startIso = `${apt.date}T${apt.slotStart}`;
        const endIso = `${apt.date}T${apt.slotEnd || apt.slotStart}`;
        return {
          ...apt,
          id: apt._id || apt.appointmentId || apt.id,
          rawDate: apt.date,
          patientId: apt.patientId, // Ensure patientId is carried over
          startMs: new Date(startIso).getTime(),
          endMs: new Date(endIso).getTime(),
          date: new Date(apt.date)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "-"),
          slotStart: new Date(`1970-01-01T${apt.slotStart}`).toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit", hour12: true }
          ),
          slotEnd: new Date(`1970-01-01T${apt.slotEnd}`).toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit", hour12: true }
          ),
        };
      });
      setAllMeetings(formattedAppointments);
    } catch (_) {}
  };

  const submitReschedule = async () => {
    if (!resModal.appt || !resModal.date || !resModal.slot) {
      alert("Please select date and time");
      return;
    }
    try {
      await api.patch(
        `/patient-appointments/${
          resModal.appt.id || resModal.appt.appointmentId
        }/reschedule`,
        {
          // date sent for validation, backend enforces same date
          date: resModal.date,
          newSlotStart: resModal.slot,
        }
      );
      setResModal({ open: false, appt: null, date: "", slot: "", slots: [] });
      await refreshAppointments();
      alert("Appointment rescheduled");
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  // ✅ View Prescription Function
  const handleViewPrescription = async (appointment) => {
    try {
      setSelectedAppointment(appointment);
      // Note: The original snippet used axios.get, using api.get for consistency.
      // The endpoint is based on patientRecordController's getRecordByAppointment
      const res = await api.get(
        `/patient-records/${appointment.patientId}/appointment/${appointment._id}`
      );
      setPrescription(res.data.record);
      setShowPrescription(true);
      setError(""); // Clear previous errors
    } catch (err) {
      setError("No prescription found for this appointment.");
      setShowPrescription(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Appointments
          </h1>

          {/* Main toggle: Book vs View */}
          <div className="flex border-b mb-6">
            <button
              className={`py-3 px-4 font-medium text-sm relative ${
                mode === "book"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                setMode("book");
                resetPagination();
              }}
            >
              Book Appointment
              {mode === "book" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              className={`py-3 px-4 font-medium text-sm relative ${
                mode === "view"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                setMode("view");
                resetPagination();
              }}
            >
              View Appointments
              {mode === "view" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>

          {mode === "book" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Schedule Form Card */}
              <div className="bg-white shadow-lg rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                  Schedule Appointment
                </h2>
                <form className="space-y-5" onSubmit={handleScheduleMeeting}>
                  {/* Patient Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name
                    </label>
                    <select
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-black "
                      required
                    >
                      <option value="">Select a patient</option>
                      {patients.map((patient) => (
                        <option key={patient._id} value={patient._id}>
                          {patient.name ||
                            `${patient.firstName || ""} ${
                              patient.lastName || ""
                            }`.trim()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason / Complaint
                    </label>
                    <input
                      type="text"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="Reason for visit"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-gray-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((deptName) => (
                        <option key={deptName} value={deptName}>
                          {deptName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Doctor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doctor
                    </label>
                    <select
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black"
                      disabled={!formData.department}
                      required
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map((doc) => (
                        <option key={doc._id} value={doc.name}>
                          {doc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium  mb-1 text-black">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={today}
                      className="w-full border border-gray-300 placeholder-gray-500 rounded-lg px-4 py-3 text-black "
                      disabled={!formData.doctor}
                      required
                    />
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <select
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black"
                      disabled={!formData.date || availableSlots.length === 0}
                      required
                    >
                      <option value="">Select an available time</option>
                      {availableSlots.length > 0 ? (
                        availableSlots.map((slot) => (
                          <option key={slot.slotStart} value={slot.slotStart}>
                            {new Date(
                              `1970-01-01T${slot.slotStart}`
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          {formData.date
                            ? "No slots available"
                            : "Select a date and doctor first"}
                        </option>
                      )}
                    </select>
                  </div>

                  {/* Session Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Type
                    </label>
                    <select
                      name="sessionType"
                      value={formData.sessionType}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black"
                      required
                    >
                      <option value="checkup">Checkup</option>
                      <option value="followup">Followup</option>
                      <option value="therapy">Therapy</option>
                      <option value="consultation">Consultation</option>
                    </select>
                  </div>

                  {/* Appointment Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Type
                    </label>
                    <select
                      name="appointmentType"
                      value={formData.appointmentType}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black"
                      required
                    >
                      <option value="In-person">In-person</option>
                      <option value="virtual">Virtual</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-700 transition flex-1 flex items-center justify-center"
                    >
                      Schedule
                    </button>
                  </div>
                </form>
              </div>

              {/* In Book mode show only 5 scheduled cards */}
              <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Scheduled (next)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Showing next 5 appointments
                  </p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-3">
                      {scheduledMeetingsToShow.slice(0, 5).length > 0 ? (
                        scheduledMeetingsToShow.slice(0, 5).map((m) => (
                          <div
                            key={m.id}
                            className="relative border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start">
                              <div className="p-1.5 rounded-md bg-blue-100">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-blue-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <div className="ml-3 flex-1">
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {m.reason}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {m.patientName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {m.date} at {m.slotStart} - {m.slotEnd}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500">
                          No meetings to display
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === "view" && (
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
              {/* Secondary toggle */}
              <div className="flex border-b mb-4">
                <button
                  className={`py-3 px-4 font-medium text-sm relative ${
                    viewTab === "scheduled"
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => {
                    setViewTab("scheduled");
                    setCurrentPageScheduled(1);
                  }}
                >
                  Scheduled Appointments
                  {viewTab === "scheduled" && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  className={`py-3 px-4 font-medium text-sm relative ${
                    viewTab === "recent"
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => {
                    setViewTab("recent");
                    setCurrentPageRecent(1);
                  }}
                >
                  Recent Appointments
                  {viewTab === "recent" && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                  )}
                </button>
              </div>

              {/* Lists with pagination */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-3">
                    {(viewTab === "scheduled" ? pagedScheduled : pagedRecent)
                      .length > 0 ? (
                      (viewTab === "scheduled"
                        ? pagedScheduled
                        : pagedRecent
                      ).map((m) => (
                        <div
                          key={m.id}
                          className="relative border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start">
                            <div
                              className={`p-1.5 rounded-md ${
                                viewTab === "scheduled"
                                  ? "bg-blue-100"
                                  : "bg-green-100"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ${
                                  viewTab === "scheduled"
                                    ? "text-blue-600"
                                    : "text-green-600"
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div className="ml-3 flex-1">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {m.reason}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {m.patientName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {m.date} at {m.slotStart} - {m.slotEnd}
                              </p>
                            </div>
                            {viewTab === "scheduled" && (
                              <div className="relative">
                                <button
                                  className="px-2 py-1 text-gray-600 hover:text-gray-800"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpenId(
                                      menuOpenId === m.id ? null : m.id
                                    );
                                  }}
                                >
                                  ⋮
                                </button>
                                {menuOpenId === m.id && (
                                  <div className="absolute right-0 mt-1 w-36 bg-white border rounded shadow z-10">
                                    <button
                                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
                                      disabled={!(m.startMs >= Date.now())}
                                      onClick={() => {
                                        setMenuOpenId(null);
                                        openReschedule(m);
                                      }}
                                    >
                                      Reschedule
                                    </button>
                                    <button
                                      className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                                      disabled={!(m.startMs >= Date.now())}
                                      onClick={() => {
                                        setMenuOpenId(null);
                                        handleCancel(m);
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                            {viewTab === "recent" && (
                              <div className="relative flex flex-col gap-2 sm:flex-row sm:gap-3">
                                {/* ✅ Complete Appointment button */}
                                <button
                                  onClick={() =>
                                    handleCompleteAppointment(m._id)
                                  }
                                  disabled={m.is_completed} // 👈 disable when appointment is already completed
                                  className={`px-3 py-1 rounded-md transition ${
                                    m.is_completed
                                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                      : "bg-green-500 text-white hover:bg-green-600"
                                  }`}
                                >
                                  {m.is_completed
                                    ? "Appointment Completed"
                                    : "Complete Appointment"}
                                </button>

                                {/* ✅ Prescription button (only if available) */}
                                {m.is_prescription && (
                                  <button
                                    onClick={() => handleViewPrescription(m)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                  >
                                    Prescription
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">
                        No meetings to display
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-between mt-4">
                {viewTab === "scheduled" ? (
                  <>
                    <button
                      className="px-3 py-1 border rounded text-black disabled:opacity-50 bg-white hover:bg-gray-100"
                      disabled={currentPageScheduled <= 1}
                      onClick={() =>
                        setCurrentPageScheduled((p) => Math.max(1, p - 1))
                      }
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPageScheduled} of {totalScheduledPages}
                    </span>
                    <button
                      className="px-3 py-1 border rounded text-black disabled:opacity-50 bg-white hover:bg-gray-100"
                      disabled={currentPageScheduled >= totalScheduledPages}
                      onClick={() =>
                        setCurrentPageScheduled((p) =>
                          Math.min(totalScheduledPages, p + 1)
                        )
                      }
                    >
                      Next
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="px-3 py-1 border rounded disabled:opacity-50"
                      disabled={currentPageRecent <= 1}
                      onClick={() =>
                        setCurrentPageRecent((p) => Math.max(1, p - 1))
                      }
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPageRecent} of {totalRecentPages}
                    </span>
                    <button
                      className="px-3 py-1 border rounded disabled:opacity-50"
                      disabled={currentPageRecent >= totalRecentPages}
                      onClick={() =>
                        setCurrentPageRecent((p) =>
                          Math.min(totalRecentPages, p + 1)
                        )
                      }
                    >
                      Next
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Reschedule Modal */}
      <RescheduleModal
        state={resModal}
        onClose={() =>
          setResModal({
            open: false,
            appt: null,
            date: "",
            slot: "",
            slots: [],
          })
        }
        onSubmit={submitReschedule}
        onChangeSlot={(val) => setResModal((p) => ({ ...p, slot: val }))}
      />

      {/* ✅ Prescription Modal (New) */}
      {showPrescription && prescription && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Prescription Details
            </h2>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <strong>Diagnosis:</strong> {prescription.diagnosis || "N/A"}
              </p>
              <p>
                <strong>Notes:</strong> {prescription.notes || "N/A"}
              </p>

              {prescription.prescription?.length > 0 && (
                <div>
                  <strong>Medicines:</strong>
                  <ul className="list-disc ml-6 mt-1">
                    {prescription.prescription.map((med, i) => (
                      <li key={i}>
                        {med.medicine_name} — {med.dosage}, {med.frequency},{" "}
                        {med.duration}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowPrescription(false)}
              className="mt-5 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Reschedule Modal Component inline (simple)
// Renders at end of file to avoid layout shifts
export function RescheduleModal({ state, onClose, onSubmit, onChangeSlot }) {
  if (!state.open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-4 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-3">Reschedule Appointment</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={state.date}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              New Start Time
            </label>
            {(state.slots || []).length > 0 ? (
              <select
                value={state.slot}
                onChange={(e) => onChangeSlot?.(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select a time</option>
                {(state.slots || []).map((s) => (
                  <option key={s.slotStart} value={s.slotStart}>
                    {s.slotStart}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-gray-500">
                No slots available for today.
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-2 border rounded" onClick={onClose}>
            Close
          </button>
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={!state.slot}
            onClick={onSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
