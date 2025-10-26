// "use client";
// import { createContext, useState } from "react";

// // Create context
// export const DoctorModuleContext = createContext(null);

// // Provider
// export function DoctorModuleProvider({ children }) {
//   const [appointments, setAppointments] = useState([]);
//   const [prescriptionContext, setPrescriptionContext] = useState(null);
//   const [prescriptionTab, setPrescriptionTab] = useState("history"); // "history" or "new"

//   const value = {
//     appointments,
//     setAppointments,
//     prescriptionContext,
//     setPrescriptionContext,
//     prescriptionTab,
//     setPrescriptionTab,
//   };

//   return (
//     <DoctorModuleContext.Provider value={value}>
//       {children}
//     </DoctorModuleContext.Provider>
//   );
// }

"use client";
import { createContext, useState } from "react";

export const DoctorModuleContext = createContext();

export function DoctorModuleProvider({ children }) {
  const [prescriptionContext, setPrescriptionContext] = useState(null);
  const [prescriptionTab, setPrescriptionTab] = useState("history");

  const handleNavigateToPrescription = (context) => {
    // Save full context including IDs
    setPrescriptionContext(context);
    localStorage.setItem("prescriptionContext", JSON.stringify(context));
    setPrescriptionTab("new");
  };

  return (
    <DoctorModuleContext.Provider
      value={{
        prescriptionContext,
        setPrescriptionContext,
        prescriptionTab,
        setPrescriptionTab,
        handleNavigateToPrescription,
      }}
    >
      {children}
    </DoctorModuleContext.Provider>
  );
}
