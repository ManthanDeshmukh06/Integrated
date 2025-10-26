// "use client";
// import { useState, useEffect } from "react";
// import { addPrescriptionToPatientRecord } from "@/services/patientRecordApi";
// import { markPrescriptionGiven } from "@/services/doctorAppointmentsApi";

// const initialFormData = {
//   patientEmail: "",
//   patientName: "",
//   symptoms: [""],
//   diagnosis: [""],
//   medicines: [],
//   tests: [],
//   notes: "",
// };

// const commonTests = [
//   "Complete Blood Count (CBC)",
//   "Lipid Profile",
//   "Liver Function Test",
//   "Kidney Function Test",
//   "Thyroid Profile",
//   "Blood Glucose Test",
//   "Urine Analysis",
//   "ECG",
//   "X-Ray Chest",
//   "Ultrasound Abdomen",
//   "CT Scan",
//   "MRI",
//   "Blood Pressure Monitoring",
//   "Cholesterol Test",
// ];

// export default function PrescriptionForm({
//   initialPatientData,
//   onSubmit,
//   onCancel,
// }) {
//   const [formData, setFormData] = useState(initialFormData);
//   const [currentMedicine, setCurrentMedicine] = useState({
//     medicine_name: "",
//     dosage: "",
//     frequency: "Once daily",
//     duration: "",
//     instructions: "",
//   });
//   const [customTest, setCustomTest] = useState("");
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     console.log("initialPatientData:", initialPatientData);
//     if (initialPatientData) {
//       setFormData((prev) => ({
//         ...prev,
//         patientEmail: initialPatientData.patientEmail || "",
//         patientName: initialPatientData.patientName || "",
//       }));
//     }
//   }, [initialPatientData]);

//   const frequencyOptions = [
//     "Once daily",
//     "Twice daily",
//     "Three times daily",
//     "Four times daily",
//     "Every 6 hours",
//     "Every 8 hours",
//     "Every 12 hours",
//     "As needed",
//     "Before meals",
//     "After meals",
//     "At bedtime",
//     "Weekly",
//     "Monthly",
//   ];

//   const durationOptions = [
//     "1 day",
//     "2 days",
//     "3 days",
//     "5 days",
//     "7 days",
//     "10 days",
//     "14 days",
//     "21 days",
//     "30 days",
//     "60 days",
//     "90 days",
//     "As directed",
//     "Until finished",
//   ];

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.patientEmail.trim())
//       newErrors.patientEmail = "Patient email is required";
//     if (!formData.patientName.trim())
//       newErrors.patientName = "Patient name is required";
//     if (!formData.symptoms.some((s) => s.trim() !== ""))
//       newErrors.symptoms = "At least one symptom is required";
//     if (!formData.diagnosis.some((d) => d.trim() !== ""))
//       newErrors.diagnosis = "At least one diagnosis is required";
//     if (formData.medicines.length === 0)
//       newErrors.medicines = "At least one medicine is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Symptom handlers
//   const handleSymptomChange = (index, value) => {
//     const updated = [...formData.symptoms];
//     updated[index] = value;
//     setFormData((prev) => ({ ...prev, symptoms: updated }));
//   };
//   const addSymptom = () =>
//     setFormData((prev) => ({ ...prev, symptoms: [...prev.symptoms, ""] }));
//   const removeSymptom = (index) => {
//     if (formData.symptoms.length > 1) {
//       setFormData((prev) => ({
//         ...prev,
//         symptoms: prev.symptoms.filter((_, i) => i !== index),
//       }));
//     }
//   };

//   // Diagnosis handlers
//   const handleDiagnosisChange = (index, value) => {
//     const updated = [...formData.diagnosis];
//     updated[index] = value;
//     setFormData((prev) => ({ ...prev, diagnosis: updated }));
//   };
//   const addDiagnosis = () =>
//     setFormData((prev) => ({ ...prev, diagnosis: [...prev.diagnosis, ""] }));
//   const removeDiagnosis = (index) => {
//     if (formData.diagnosis.length > 1) {
//       setFormData((prev) => ({
//         ...prev,
//         diagnosis: prev.diagnosis.filter((_, i) => i !== index),
//       }));
//     }
//   };

//   // Medicines handlers
//   const handleAddMedicine = () => {
//     if (
//       !currentMedicine.medicine_name ||
//       !currentMedicine.dosage ||
//       !currentMedicine.duration
//     ) {
//       alert("Please fill medicine name, dosage, and duration");
//       return;
//     }
//     setFormData((prev) => ({
//       ...prev,
//       medicines: [...prev.medicines, { ...currentMedicine }],
//     }));
//     setCurrentMedicine({
//       medicine_name: "",
//       dosage: "",
//       frequency: "Once daily",
//       duration: "",
//       instructions: "",
//     });
//   };
//   const handleRemoveMedicine = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       medicines: prev.medicines.filter((_, i) => i !== index),
//     }));
//   };

//   // Tests handlers
//   const handleTestToggle = (test) => {
//     setFormData((prev) => ({
//       ...prev,
//       tests: prev.tests.includes(test)
//         ? prev.tests.filter((t) => t !== test)
//         : [...prev.tests, test],
//     }));
//   };
//   const addCustomTest = () => {
//     if (customTest.trim() && !formData.tests.includes(customTest.trim())) {
//       setFormData((prev) => ({
//         ...prev,
//         tests: [...prev.tests, customTest.trim()],
//       }));
//       setCustomTest("");
//     }
//   };
//   const removeTest = (test) =>
//     setFormData((prev) => ({
//       ...prev,
//       tests: prev.tests.filter((t) => t !== test),
//     }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     // Clean up empty symptoms and diagnosis
//     const cleanedFormData = {
//       ...formData,
//       symptoms: formData.symptoms.filter((s) => s.trim() !== ""),
//       diagnosis: formData.diagnosis.filter((d) => d.trim() !== ""),
//     };

//     try {
//       // Get token from localStorage
//       const raw = localStorage.getItem("hmsUser");
//       const user = raw ? JSON.parse(raw) : null;
//       const token = user?.token;

//       if (!token) {
//         alert("You are not authenticated!");
//         return;
//       }

//       // Call API
//       const response = await addPrescriptionToPatientRecord(
//         cleanedFormData,
//         token
//       );

//       if (response?.data) {
//         alert("Prescription created successfully!");
//         onSubmit(cleanedFormData); // trigger parent callback
//         setFormData(initialFormData); // reset form
//       }
//     } catch (err) {
//       console.error("Error creating prescription:", err);
//       alert("Failed to create prescription. Please try again.");
//     }
//   };
//   return (
//     <div className="max-w-4xl mx-auto">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Patient Info */}
//         <div className="bg-white rounded-xl border p-6">
//           <h3 className="text-lg font-semibold mb-4 text-black">
//             Patient Information
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block mb-2 text-black">Patient Email *</label>
//               <input
//                 type="email"
//                 value={formData.patientEmail}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     patientEmail: e.target.value,
//                   }))
//                 }
//                 className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 ${
//                   errors.patientEmail ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="patient@example.com"
//               />
//               {errors.patientEmail && (
//                 <p className="text-red-600 text-sm mt-1">
//                   {errors.patientEmail}
//                 </p>
//               )}
//             </div>
//             <div>
//               <label className="block mb-2 text-black">Patient Name *</label>
//               <input
//                 type="text"
//                 value={formData.patientName}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     patientName: e.target.value,
//                   }))
//                 }
//                 className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 ${
//                   errors.patientName ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter patient name"
//               />
//               {errors.patientName && (
//                 <p className="text-red-600 text-sm mt-1">
//                   {errors.patientName}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Symptoms */}
//         <div className="bg-white rounded-xl border p-6">
//           <h3 className="text-lg font-semibold mb-4 text-black">Symptoms</h3>
//           {errors.symptoms && (
//             <p className="text-red-600 text-sm mb-3">{errors.symptoms}</p>
//           )}
//           <div className="space-y-3">
//             {formData.symptoms.map((symptom, i) => (
//               <div key={i} className="flex gap-3">
//                 <input
//                   type="text"
//                   value={symptom}
//                   onChange={(e) => handleSymptomChange(i, e.target.value)}
//                   className="flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500"
//                   placeholder={`Symptom ${i + 1}`}
//                 />
//                 {formData.symptoms.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeSymptom(i)}
//                     className="px-4 py-3 bg-red-100 text-red-600 rounded-lg"
//                   >
//                     <i className="bi bi-trash"></i>
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button
//             type="button"
//             onClick={addSymptom}
//             className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
//           >
//             <i className="bi bi-plus-lg"></i> Add Symptom
//           </button>
//         </div>

//         {/* Diagnosis */}
//         <div className="bg-white rounded-xl border p-6">
//           <h3 className="text-lg font-semibold mb-4 text-black">Diagnosis</h3>
//           {errors.diagnosis && (
//             <p className="text-red-600 text-sm mb-3">{errors.diagnosis}</p>
//           )}
//           <div className="space-y-3">
//             {formData.diagnosis.map((diag, i) => (
//               <div key={i} className="flex gap-3">
//                 <input
//                   type="text"
//                   value={diag}
//                   onChange={(e) => handleDiagnosisChange(i, e.target.value)}
//                   className="flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500"
//                   placeholder={`Diagnosis ${i + 1}`}
//                 />
//                 {formData.diagnosis.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeDiagnosis(i)}
//                     className="px-4 py-3 bg-red-100 text-red-600 rounded-lg"
//                   >
//                     <i className="bi bi-trash"></i>
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button
//             type="button"
//             onClick={addDiagnosis}
//             className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
//           >
//             <i className="bi bi-plus-lg"></i> Add Diagnosis
//           </button>
//         </div>

//         {/* Medicines */}
//         <div className="bg-white rounded-xl border p-6">
//           <h3 className="text-lg font-semibold mb-4 text-black">Medicines</h3>
//           {errors.medicines && (
//             <p className="text-red-600 text-sm mb-3">{errors.medicines}</p>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block mb-2 text-black">Medicine Name *</label>
//               <input
//                 type="text"
//                 value={currentMedicine.medicine_name}
//                 onChange={(e) =>
//                   setCurrentMedicine((prev) => ({
//                     ...prev,
//                     medicine_name: e.target.value,
//                   }))
//                 }
//                 className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500"
//                 placeholder="Enter medicine name"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 text-black">Dosage *</label>
//               <input
//                 type="text"
//                 value={currentMedicine.dosage}
//                 onChange={(e) =>
//                   setCurrentMedicine((prev) => ({
//                     ...prev,
//                     dosage: e.target.value,
//                   }))
//                 }
//                 className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500"
//                 placeholder="e.g., 1 tablet, 10ml"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 text-black">Frequency</label>
//               <select
//                 value={currentMedicine.frequency}
//                 onChange={(e) =>
//                   setCurrentMedicine((prev) => ({
//                     ...prev,
//                     frequency: e.target.value,
//                   }))
//                 }
//                 className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500"
//               >
//                 {frequencyOptions.map((opt) => (
//                   <option key={opt} value={opt}>
//                     {opt}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block mb-2 text-black">Duration *</label>
//               <select
//                 value={currentMedicine.duration}
//                 onChange={(e) =>
//                   setCurrentMedicine((prev) => ({
//                     ...prev,
//                     duration: e.target.value,
//                   }))
//                 }
//                 className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500"
//               >
//                 {durationOptions.map((opt) => (
//                   <option key={opt} value={opt}>
//                     {opt}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="md:col-span-2">
//               <label className="block mb-2 text-black">Instructions</label>
//               <input
//                 type="text"
//                 value={currentMedicine.instructions}
//                 onChange={(e) =>
//                   setCurrentMedicine((prev) => ({
//                     ...prev,
//                     instructions: e.target.value,
//                   }))
//                 }
//                 className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500"
//                 placeholder="Any special instructions"
//               />
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={handleAddMedicine}
//             className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg mb-4"
//           >
//             Add Medicine
//           </button>

//           <div className="space-y-2">
//             {formData.medicines.map((med, i) => (
//               <div
//                 key={i}
//                 className="flex justify-between items-center border rounded-lg p-2"
//               >
//                 <span>
//                   {med.medicine_name} - {med.dosage} - {med.frequency} -{" "}
//                   {med.duration} {med.instructions && `(${med.instructions})`}
//                 </span>
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveMedicine(i)}
//                   className="px-2 py-1 bg-red-100 text-red-600 rounded-lg"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Tests */}
//         <div className="bg-white rounded-xl border p-6">
//           <h3 className="text-lg font-semibold mb-4 text-black">Tests</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
//             {commonTests.map((test, i) => (
//               <label
//                 key={i}
//                 className=" text-black flex items-center gap-2 border p-2 rounded-lg cursor-pointer"
//               >
//                 <input
//                   type="checkbox"
//                   checked={formData.tests.includes(test)}
//                   onChange={() => handleTestToggle(test)}
//                 />
//                 {test}
//               </label>
//             ))}
//           </div>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={customTest}
//               onChange={(e) => setCustomTest(e.target.value)}
//               placeholder="Custom Test"
//               className="flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500"
//             />
//             <button
//               type="button"
//               onClick={addCustomTest}
//               className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
//             >
//               Add Test
//             </button>
//           </div>
//           <div className="mt-3 space-y-2">
//             {formData.tests.map((t, i) => (
//               <div
//                 key={i}
//                 className="flex justify-between items-center border rounded-lg p-2"
//               >
//                 <span>{t}</span>
//                 <button
//                   type="button"
//                   onClick={() => removeTest(t)}
//                   className="px-2 py-1 bg-red-100 text-red-600 rounded-lg"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Notes */}
//         <div className="bg-white rounded-xl border p-6">
//           <h3 className="text-lg font-semibold mb-4 text-black">Notes</h3>
//           <textarea
//             value={formData.notes}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, notes: e.target.value }))
//             }
//             placeholder="Additional notes..."
//             className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500"
//             rows={4}
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-4 justify-end">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-6 py-3 border rounded-lg text-black"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={async () => {
//               console.log("Create Prescription button clicked");
//               try {
//                 // 1️⃣ Validate the form
//                 if (!validateForm()) {
//                   console.warn("Form validation failed", errors);
//                   return;
//                 }

//                 // 2️⃣ Clean up empty symptoms and diagnosis
//                 const cleanedFormData = {
//                   ...formData,
//                   symptoms: formData.symptoms.filter((s) => s.trim() !== ""),
//                   diagnosis: formData.diagnosis.filter((d) => d.trim() !== ""),
//                 };
//                 console.log("Cleaned form data prepared:", cleanedFormData);

//                 // 3️⃣ Get user token and IDs from localStorage
//                 const rawUser = localStorage.getItem("hmsUser");
//                 console.log("Raw hmsUser from localStorage:", rawUser);
//                 const user = rawUser ? JSON.parse(rawUser) : null;

//                 if (!user) {
//                   console.error("User object missing in localStorage!");
//                   return;
//                 }

//                 const token = user?.token;
//                 const doctor_id = user?.doctorid;
//                 const hospital_id = user?.hospitalId;

//                 console.log("Token:", token);
//                 console.log("Doctor ID:", doctor_id);
//                 console.log("Hospital ID:", hospital_id);

//                 if (!token || !doctor_id || !hospital_id) {
//                   throw new Error("User authentication data incomplete");
//                 }

//                 // 4️⃣ Get prescription context from localStorage
//                 const rawContext = localStorage.getItem("prescriptionContext");
//                 console.log(
//                   "Raw prescriptionContext from localStorage:",
//                   rawContext
//                 );

//                 let context = null;
//                 try {
//                   context = rawContext ? JSON.parse(rawContext) : null;
//                   console.log("Parsed prescriptionContext object:", context);
//                 } catch (parseError) {
//                   console.error(
//                     "Error parsing prescriptionContext:",
//                     parseError
//                   );
//                 }

//                 if (!context) {
//                   console.error(
//                     "Prescription context missing in localStorage!"
//                   );
//                   return;
//                 }

//                 // Optional: print individual context fields
//                 console.log("Patient ID:", context.patient_id);
//                 console.log("Appointment ID:", context.appointment_id);
//                 console.log("Patient Name:", context.patientName);
//                 console.log("Patient Email:", context.patientEmail);
//                 console.log("Date:", context.date);
//                 console.log("Slot Start:", context.slotStart);
//                 console.log("Slot End:", context.slotEnd);
//                 console.log("Session Type:", context.sessionType);
//                 console.log("Status:", context.status);

//                 const patient_id = context.patient_id;
//                 const appointment_id = context.appointment_id;

//                 if (!patient_id || !appointment_id) {
//                   throw new Error("Patient or appointment ID missing");
//                 }

//                 // 5️⃣ Prepare final payload
//                 // 5️⃣ Prepare final payload
//                 const dataToSend = {
//                   ...cleanedFormData,
//                   diagnosis: cleanedFormData.diagnosis.join(", "), // array → single string
//                   symptoms: cleanedFormData.symptoms, // array is fine
//                   recommended_tests: cleanedFormData.tests, // rename field
//                   prescription: cleanedFormData.medicines.map((med) => ({
//                     medicine_name: med.medicine_name,
//                     dosage: med.dosage,
//                     frequency: med.frequency,
//                     duration: med.duration,
//                     // instructions is not in schema, so omit
//                   })),
//                   patient_id,
//                   doctor_id,
//                   hospital_id,
//                   appointment_id,
//                 };

//                 console.log("Final payload to send:", dataToSend);

//                 // 6️⃣ Call API to create prescription
//                 console.log("Sending request to create prescription...");
//                 await addPrescriptionToPatientRecord(dataToSend, token);
//                 console.log("Prescription successfully added!");

//                 // 7️⃣ Success feedback & reset form
//                 alert("Prescription created successfully!");
//                 onSubmit(dataToSend);
//                 setFormData(initialFormData);
//               } catch (err) {
//                 console.error("Error in creating prescription:", err);
//                 alert("Failed to create prescription. " + err.message);
//               }
//             }}
//             className="px-6 py-3 bg-green-600 text-white rounded-lg"
//           >
//             Create Prescription
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { addPrescriptionToPatientRecord } from "@/services/patientRecordApi";
import { markPrescriptionGiven } from "@/services/doctorAppointmentsApi";

const initialFormData = {
  patientEmail: "",
  patientName: "",
  symptoms: [""],
  diagnosis: [""],
  medicines: [],
  tests: [],
  notes: "",
};

const commonTests = [
  "Complete Blood Count (CBC)",
  "Lipid Profile",
  "Liver Function Test",
  "Kidney Function Test",
  "Thyroid Profile",
  "Blood Glucose Test",
  "Urine Analysis",
  "ECG",
  "X-Ray Chest",
  "Ultrasound Abdomen",
  "CT Scan",
  "MRI",
  "Blood Pressure Monitoring",
  "Cholesterol Test",
];

export default function PrescriptionForm({
  initialPatientData,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [currentMedicine, setCurrentMedicine] = useState({
    medicine_name: "",
    dosage: "",
    frequency: "Once daily",
    duration: "",
    instructions: "",
  });
  const [customTest, setCustomTest] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialPatientData) {
      setFormData((prev) => ({
        ...prev,
        patientEmail: initialPatientData.patientEmail || "",
        patientName: initialPatientData.patientName || "",
      }));
    }
  }, [initialPatientData]);

  const frequencyOptions = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
    "Before meals",
    "After meals",
    "At bedtime",
    "Weekly",
    "Monthly",
  ];

  const durationOptions = [
    "1 day",
    "2 days",
    "3 days",
    "5 days",
    "7 days",
    "10 days",
    "14 days",
    "21 days",
    "30 days",
    "60 days",
    "90 days",
    "As directed",
    "Until finished",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientEmail.trim())
      newErrors.patientEmail = "Patient email is required";
    if (!formData.patientName.trim())
      newErrors.patientName = "Patient name is required";
    if (!formData.symptoms.some((s) => s.trim() !== ""))
      newErrors.symptoms = "At least one symptom is required";
    if (!formData.diagnosis.some((d) => d.trim() !== ""))
      newErrors.diagnosis = "At least one diagnosis is required";
    if (formData.medicines.length === 0)
      newErrors.medicines = "At least one medicine is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Handlers for form fields
  const handleSymptomChange = (index, value) => {
    const updated = [...formData.symptoms];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, symptoms: updated }));
  };

  const addSymptom = () =>
    setFormData((prev) => ({ ...prev, symptoms: [...prev.symptoms, ""] }));

  const removeSymptom = (index) => {
    if (formData.symptoms.length > 1) {
      setFormData((prev) => ({
        ...prev,
        symptoms: prev.symptoms.filter((_, i) => i !== index),
      }));
    }
  };

  const handleDiagnosisChange = (index, value) => {
    const updated = [...formData.diagnosis];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, diagnosis: updated }));
  };

  const addDiagnosis = () =>
    setFormData((prev) => ({ ...prev, diagnosis: [...prev.diagnosis, ""] }));

  const removeDiagnosis = (index) => {
    if (formData.diagnosis.length > 1) {
      setFormData((prev) => ({
        ...prev,
        diagnosis: prev.diagnosis.filter((_, i) => i !== index),
      }));
    }
  };

  const handleAddMedicine = () => {
    if (
      !currentMedicine.medicine_name ||
      !currentMedicine.dosage ||
      !currentMedicine.duration
    ) {
      alert("Please fill medicine name, dosage, and duration");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { ...currentMedicine }],
    }));
    setCurrentMedicine({
      medicine_name: "",
      dosage: "",
      frequency: "Once daily",
      duration: "",
      instructions: "",
    });
  };

  const handleRemoveMedicine = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const handleTestToggle = (test) => {
    setFormData((prev) => ({
      ...prev,
      tests: prev.tests.includes(test)
        ? prev.tests.filter((t) => t !== test)
        : [...prev.tests, test],
    }));
  };

  const addCustomTest = () => {
    if (customTest.trim() && !formData.tests.includes(customTest.trim())) {
      setFormData((prev) => ({
        ...prev,
        tests: [...prev.tests, customTest.trim()],
      }));
      setCustomTest("");
    }
  };

  const removeTest = (test) =>
    setFormData((prev) => ({
      ...prev,
      tests: prev.tests.filter((t) => t !== test),
    }));

  // 🔹 Main submission logic
  const handleSubmit = async () => {
    try {
      console.log("🟩 Create Prescription button clicked");

      if (!validateForm()) {
        console.warn("Form validation failed", errors);
        return;
      }

      const cleanedFormData = {
        ...formData,
        symptoms: formData.symptoms.filter((s) => s.trim() !== ""),
        diagnosis: formData.diagnosis.filter((d) => d.trim() !== ""),
      };

      // Get user info
      const rawUser = localStorage.getItem("hmsUser");
      const user = rawUser ? JSON.parse(rawUser) : null;

      if (!user) throw new Error("User data missing in localStorage");

      const token = user?.token;
      const doctor_id = user?.doctorid;
      const hospital_id = user?.hospitalId;

      // 🔹 Log doctor and hospital IDs
      console.log("🆔 Doctor ID:", doctor_id);
      console.log("🏥 Hospital ID:", hospital_id);

      if (!token || !doctor_id || !hospital_id)
        throw new Error("User authentication data incomplete");

      // Get prescription context
      const rawContext = localStorage.getItem("prescriptionContext");
      const context = rawContext ? JSON.parse(rawContext) : null;

      if (!context)
        throw new Error("Prescription context missing in localStorage");

      const patient_id = context.patientId; // matches the button storage key
      const appointment_id = context.appointmentId; // if stored similarly

      // 🔹 Log patient and appointment IDs
      console.log("🆔 Patient ID:", patient_id);
      console.log("📅 Appointment ID:", appointment_id);

      if (!patient_id || !appointment_id)
        throw new Error("Patient or appointment ID missing");

      // Prepare final payload
      const dataToSend = {
        ...cleanedFormData,
        diagnosis: cleanedFormData.diagnosis.join(", "),
        symptoms: cleanedFormData.symptoms,
        recommended_tests: cleanedFormData.tests,
        prescription: cleanedFormData.medicines.map((med) => ({
          medicine_name: med.medicine_name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
        })),
        patient_id,
        doctor_id,
        hospital_id,
        appointment_id,
      };

      console.log("📦 Final payload to send:", dataToSend);

      // 1️⃣ Add prescription to patient record
      await addPrescriptionToPatientRecord(dataToSend, token);
      console.log("✅ Prescription successfully added!");

      // 2️⃣ Mark prescription as given for the appointment
      const markResult = await markPrescriptionGiven({
        hospitalId: hospital_id,
        appointmentId: appointment_id,
      });
      console.log("✅ Appointment marked as prescription given:", markResult);

      alert("Prescription created and appointment updated successfully!");
      onSubmit(dataToSend);

      // Reset form
      setFormData(initialFormData);
    } catch (err) {
      console.error("❌ Error creating prescription:", err);
      alert("Failed to create prescription: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form className="space-y-6">
        {/* Patient Info */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">
            Patient Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-black">Patient Email *</label>
              <input
                type="email"
                value={formData.patientEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    patientEmail: e.target.value,
                  }))
                }
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.patientEmail ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="patient@example.com"
              />
              {errors.patientEmail && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.patientEmail}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-black">Patient Name *</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    patientName: e.target.value,
                  }))
                }
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.patientName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter patient name"
              />
              {errors.patientName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.patientName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">Symptoms</h3>
          {formData.symptoms.map((symptom, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <input
                type="text"
                value={symptom}
                onChange={(e) => handleSymptomChange(i, e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border"
                placeholder={`Symptom ${i + 1}`}
              />
              {formData.symptoms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSymptom(i)}
                  className="px-4 py-3 bg-red-100 text-red-600 rounded-lg"
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSymptom}
            className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
          >
            + Add Symptom
          </button>
        </div>

        {/* Diagnosis */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">Diagnosis</h3>
          {formData.diagnosis.map((diag, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <input
                type="text"
                value={diag}
                onChange={(e) => handleDiagnosisChange(i, e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border"
                placeholder={`Diagnosis ${i + 1}`}
              />
              {formData.diagnosis.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDiagnosis(i)}
                  className="px-4 py-3 bg-red-100 text-red-600 rounded-lg"
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addDiagnosis}
            className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
          >
            + Add Diagnosis
          </button>
        </div>

        {/* Medicines */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">Medicines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={currentMedicine.medicine_name}
              onChange={(e) =>
                setCurrentMedicine((prev) => ({
                  ...prev,
                  medicine_name: e.target.value,
                }))
              }
              className="w-full px-4 py-3 rounded-lg border"
              placeholder="Medicine Name *"
            />
            <input
              type="text"
              value={currentMedicine.dosage}
              onChange={(e) =>
                setCurrentMedicine((prev) => ({
                  ...prev,
                  dosage: e.target.value,
                }))
              }
              className="w-full px-4 py-3 rounded-lg border"
              placeholder="Dosage *"
            />
            <select
              value={currentMedicine.frequency}
              onChange={(e) =>
                setCurrentMedicine((prev) => ({
                  ...prev,
                  frequency: e.target.value,
                }))
              }
              className="w-full px-4 py-3 rounded-lg border"
            >
              {frequencyOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <select
              value={currentMedicine.duration}
              onChange={(e) =>
                setCurrentMedicine((prev) => ({
                  ...prev,
                  duration: e.target.value,
                }))
              }
              className="w-full px-4 py-3 rounded-lg border"
            >
              {durationOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleAddMedicine}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg mb-4"
          >
            Add Medicine
          </button>

          {formData.medicines.map((med, i) => (
            <div
              key={i}
              className="flex justify-between items-center border p-2 rounded-lg mb-2 text-black"
            >
              <span>
                {med.medicine_name} - {med.dosage} ({med.frequency},{" "}
                {med.duration})
              </span>
              <button
                type="button"
                onClick={() => handleRemoveMedicine(i)}
                className="px-2 py-1 bg-red-100 text-red-600 rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Tests */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">Tests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {commonTests.map((test, i) => (
              <label
                key={i}
                className="flex items-center gap-2 border p-2 rounded-lg cursor-pointer text-black"
              >
                <input
                  type="checkbox"
                  checked={formData.tests.includes(test)}
                  onChange={() => handleTestToggle(test)}
                />
                {test}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTest}
              onChange={(e) => setCustomTest(e.target.value)}
              placeholder="Custom Test"
              className="flex-1 px-4 py-3 rounded-lg border"
            />
            <button
              type="button"
              onClick={addCustomTest}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
            >
              Add Test
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">Notes</h3>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Additional notes..."
            className="w-full px-4 py-3 rounded-lg border"
            rows={4}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border rounded-lg text-black"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-lg"
          >
            Create Prescription
          </button>
        </div>
      </form>
    </div>
  );
}
