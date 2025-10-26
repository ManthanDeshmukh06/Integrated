"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CompleteAppointmentPage() {
  const router = useRouter();
  const [appointmentData, setAppointmentData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [patientDocuments, setPatientDocuments] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem("activeAppointment");
    console.log("Raw localStorage data:", storedData); // Step 1

    if (storedData) {
      const appointment = JSON.parse(storedData);
      console.log("Parsed Appointment Object:", appointment); // Step 1
      setAppointmentData(appointment);
      fetchPatientData(appointment.patientId);
      fetchPatientDocuments(appointment.patientId);
      fetchPatientRecords(appointment.patientId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPatientData = async (patientId) => {
  try {
    const res = await fetch(`http://localhost:3000/patients/${patientId}`);
    const result = await res.json();

    // If API returns success: false (like "Patient not found"), handle quietly
    if (!res.ok || result.success === false) {
      setPatientData(null);
      return; // no error thrown or logged
    }

    console.log("Fetched Patient Data:", result.data);
    setPatientData(result.data || null);
  } catch (err) {
    // Catch only actual network or parsing errors silently
    console.error("Error fetching patient data:", err.message);
    setPatientData(null);
  }
};


  const fetchPatientDocuments = async (patientId) => {
    try {
      const user = JSON.parse(localStorage.getItem("hmsUser"));
      const token = user?.token;
      if (!token) return;

      const res = await fetch(
        `http://localhost:3000/patient-uploads/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        console.warn("No patient documents found or failed to fetch");
        setPatientDocuments([]);
        return;
      }

      const data = await res.json();
      console.log("Fetched Patient Documents:", data.uploads);

      const allFiles = (data.uploads || []).flatMap((upload) =>
        (upload.files || []).map((file) => ({
          url: file.file_url,
          type:
            file.file_type === "pdf" ? "application/pdf" : file.file_type || "",
          name: upload.diagnosis || "Patient Document",
        }))
      );

      setPatientDocuments(allFiles);
    } catch (err) {
      console.error("Error fetching patient documents:", err);
      setPatientDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientRecords = async (patientId) => {
    try {
      const user = JSON.parse(localStorage.getItem("hmsUser"));
      const doctorId = user?.doctorid; // use doctorid
      const token = user?.token;

      console.log("Doctor ID:", doctorId);
      console.log("Patient ID:", patientId);

      if (!doctorId || !token) return;

      const res = await fetch(
        `http://localhost:3000/patient-records/patient/${patientId}/doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Fetch response status:", res.status);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      console.log("Fetched Patient Records:", data.records);
      setPatientRecords(data.records || []);
    } catch (err) {
      console.error("Error fetching patient records:", err);
      setPatientRecords([]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!appointmentData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p className="text-lg mb-3">No appointment selected.</p>
        <button
          onClick={() => router.push("/doctor/appointments")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Appointments
        </button>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Complete Appointment
          </h1>
          <p className="text-gray-700">
            Review and complete details for this appointment
          </p>
        </div>

        <div className="flex gap-4">
          {/* Back Button */}
          <button
            onClick={() => router.push("/doctor/appointments")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
          >
            ← Back
          </button>

          {/* Create Prescription Button */}
          <button
            onClick={() => {
              if (patientData && appointmentData) {
                localStorage.setItem(
                  "prescriptionContext",
                  JSON.stringify({
                    patientId: patientData._id, // match handleSubmit key
                    appointmentId: appointmentData.id,  // add appointment ID
                    patientName: patientData.name,
                    patientEmail: patientData.email,
                  })
                );
                // optional: persist active tab
                localStorage.setItem("prescriptionTab", "new");
                router.push("/doctor/prescriptions");
              }
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Create Prescription
          </button>
        </div>
      </div>

      {/* Appointment Info */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Appointment Information</h2>
        <table className="min-w-full text-sm border rounded-lg overflow-hidden text-gray-900">
          <tbody>
            <tr className="bg-gray-50">
              <td className="p-3 font-medium w-1/4 border-b">Date</td>
              <td className="p-3 border-b">{appointmentData.date || "N/A"}</td>
            </tr>
            <tr>
              <td className="p-3 font-medium border-b">Time</td>
              <td className="p-3 border-b">
                {appointmentData.slotStart && appointmentData.slotEnd
                  ? `${appointmentData.slotStart} - ${appointmentData.slotEnd}`
                  : "N/A"}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-3 font-medium border-b">Session Type</td>
              <td className="p-3 border-b">
                {appointmentData.sessionType || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium border-b">Reason</td>
              <td className="p-3 border-b">
                {appointmentData.reason || "N/A"}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-3 font-medium border-b">Status</td>
              <td className="p-3 border-b capitalize">
                {appointmentData.status || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Patient Info */}
      {patientData && (
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Patient Information</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-40 h-40 rounded-full overflow-hidden border">
              <img
                src={patientData.profileImage || "/default-profile.png"}
                alt={patientData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <table className="min-w-full text-sm border rounded-lg overflow-hidden text-gray-900">
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium w-1/4 border-b">Name</td>
                    <td className="p-3 border-b">
                      {patientData.name || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium border-b">Email</td>
                    <td className="p-3 border-b">
                      {patientData.email || "N/A"}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium border-b">Mobile</td>
                    <td className="p-3 border-b">
                      {patientData.mobile || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium border-b">DOB</td>
                    <td className="p-3 border-b">
                      {patientData.dob?.split("T")[0] || "N/A"}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium border-b">Gender</td>
                    <td className="p-3 border-b">
                      {patientData.gender || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium border-b">Address</td>
                    <td className="p-3 border-b">
                      {patientData.address || "N/A"}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium border-b">
                      Height / Weight
                    </td>
                    <td className="p-3 border-b">
                      {patientData.height || "N/A"} cm /{" "}
                      {patientData.weight || "N/A"} kg
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium border-b">Blood Group</td>
                    <td className="p-3 border-b">
                      {patientData.blood_group || "N/A"}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium border-b">Marital Status</td>
                    <td className="p-3 border-b">
                      {patientData.marital_status || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium border-b">Occupation</td>
                    <td className="p-3 border-b">
                      {patientData.occupation || "N/A"}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium border-b">Activity Level</td>
                    <td className="p-3 border-b">
                      {patientData.activity_level || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium border-b">
                      Food Preference
                    </td>
                    <td className="p-3 border-b">
                      {patientData.food_preference || "N/A"}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium border-b">
                      Smoking / Alcohol
                    </td>
                    <td className="p-3 border-b">
                      {patientData.smoking_habits || "N/A"} /{" "}
                      {patientData.alcohol_consumption || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium border-b">Allergies</td>
                    <td className="p-3 border-b">
                      {(patientData.allergies || []).join(", ") || "N/A"}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium border-b">
                      Chronic Diseases
                    </td>
                    <td className="p-3 border-b">
                      {(patientData.chronic_diseases || []).join(", ") || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium border-b">Injuries</td>
                    <td className="p-3 border-b">
                      {(patientData.injuries || []).join(", ") || "N/A"}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 font-medium border-b">Surgeries</td>
                    <td className="p-3 border-b">
                      {(patientData.surgeries || []).join(", ") || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contact */}
      {patientData?.emergency_contact && (
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>
          <table className="min-w-full text-sm border rounded-lg overflow-hidden text-gray-900">
            <tbody>
              <tr className="bg-gray-50">
                <td className="p-3 font-medium w-1/4 border-b">Name</td>
                <td className="p-3 border-b">
                  {patientData.emergency_contact.first_name}{" "}
                  {patientData.emergency_contact.last_name}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium border-b">Relationship</td>
                <td className="p-3 border-b">
                  {patientData.emergency_contact.relationship}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-medium border-b">Phone</td>
                <td className="p-3 border-b">
                  {patientData.emergency_contact.phone}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium border-b">Email</td>
                <td className="p-3 border-b">
                  {patientData.emergency_contact.email}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-medium border-b">City</td>
                <td className="p-3 border-b">
                  {patientData.emergency_contact.city}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium border-b">Address</td>
                <td className="p-3 border-b">
                  {patientData.emergency_contact.address}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Patient Documents / Uploads */}
      {patientDocuments.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Patient Documents / History
          </h2>
          <ul className="list-disc list-inside text-gray-800">
            {patientDocuments.map((doc, idx) => (
              <li key={idx}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {doc.name} ({doc.type || "file"})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Patient Records from Doctor */}
      {patientRecords.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Past Appointments</h2>
          {patientRecords.map((record) => (
            <div
              key={record._id}
              className="border p-4 rounded-lg mb-4 bg-gray-50"
            >
              <p>
                <strong>Visit Date:</strong>{" "}
                {record.visit_date?.split("T")[0] || "N/A"}
              </p>
              <p>
                <strong>Symptoms:</strong>{" "}
                {(record.symptoms || []).join(", ") || "N/A"}
              </p>
              <p>
                <strong>Diagnosis:</strong> {record.diagnosis || "N/A"}
              </p>
              <p>
                <strong>Notes:</strong> {record.notes || "N/A"}
              </p>
              <p>
                <strong>Recommended Tests:</strong>{" "}
                {(record.recommended_tests || []).join(", ") || "N/A"}
              </p>
              {record.prescription?.length > 0 && (
                <div className="mt-2">
                  <strong>Prescription:</strong>
                  <ul className="list-disc list-inside">
                    {record.prescription.map((med) => (
                      <li key={med._id}>
                        {med.medicine_name} - {med.dosage}, {med.frequency},{" "}
                        {med.duration}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
