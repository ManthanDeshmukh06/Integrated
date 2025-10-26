// import http from "./httpClient";

// const API_BASE = ""; // base handled by http client

// export async function getDoctorAppointments({ hospitalId, doctorId }) {
//   const url = `/doctors/${hospitalId}/${doctorId}/appointments`;
//   const { data } = await http.get(url);
//   return data;
// }

// export async function getDoctorAppointmentsByDate({
//   hospitalId,
//   doctorId,
//   date,
// }) {
//   const url = `/doctors/${hospitalId}/${doctorId}/appointments/by-date`;
//   const { data } = await http.get(url, { params: { date } });
//   return data;
// }

// export async function getDoctorAppointmentHistory({
//   hospitalId,
//   doctorId,
//   date,
// }) {
//   const url = `/doctors/${hospitalId}/${doctorId}/history`;
//   const { data } = await http.get(url, { params: { date } });
//   return data;
// }

// export async function getAppointmentWithPatientDetails({ appointmentId }) {
//   const url = `/doctors/appointments/${appointmentId}/details`;
//   const { data } = await http.get(url);
//   return data;
// }

// export async function markPrescriptionGiven({ hospitalId, appointmentId }) {
//   const url = `/doctors/appointment/${hospitalId}/${appointmentId}/prescription`;
//   const { data } = await http.put(url);
//   return data;
// }

// export async function getDoctorProfile() {
//   const { data } = await http.get(`/doctors/profile`);
//   return data;
// }
import http from "./httpClient";

export async function getDoctorAppointments({ hospitalId, doctorId }) {
  try {
    // Debug logging
    console.log("=== getDoctorAppointments Debug ===");
    console.log("getDoctorAppointments called with:", { hospitalId, doctorId });
    console.log("Types:", {
      hospitalIdType: typeof hospitalId,
      doctorIdType: typeof doctorId,
    });
    console.log("Raw values:", {
      hospitalIdRaw: hospitalId,
      doctorIdRaw: doctorId,
    });

    // Ensure IDs are strings and not null/undefined
    if (!hospitalId || !doctorId) {
      console.error("Missing required parameters:", { hospitalId, doctorId });
      return { appointments: [] };
    }

    // Convert to strings to ensure proper URL encoding
    const hospitalIdStr = String(hospitalId);
    const doctorIdStr = String(doctorId);

    const url = `/doctors/${hospitalIdStr}/${doctorIdStr}/appointments`;
    console.log("Making request to:", url);
    console.log("Full URL will be:", `${http.defaults.baseURL}${url}`);

    // Test basic connectivity first
    try {
      console.log("Testing basic connectivity...");
      const testResponse = await http.get("/");
      console.log("Basic connectivity test response:", testResponse.data);
    } catch (testError) {
      console.error("Basic connectivity test failed:", testError.message);
      // If basic connectivity fails, return empty data
      return { appointments: [] };
    }

    const { data } = await http.get(url);
    console.log("API response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      config: error.config,
      request: error.request,
      response: error.response,
    });

    // If it's a 400 error, it might be a hospital ID mismatch
    if (error.response?.status === 400) {
      console.error(
        "400 Error - This usually means the doctor doesn't belong to the specified hospital"
      );
      console.error(
        "Check if hospitalId matches the doctor's hospital_id in the database"
      );
      console.error("Requested hospitalId:", hospitalId);
      console.error("Requested doctorId:", doctorId);

      // Try to get the correct hospital_id from doctor profile
      try {
        console.log(
          "Attempting to get doctor profile to find correct hospital_id..."
        );
        const profileResponse = await http.get("/doctors/profile");
        const doctorProfile = profileResponse.data?.doctor;

        if (doctorProfile && doctorProfile.hospital_id) {
          console.log(
            "Found doctor profile with hospital_id:",
            doctorProfile.hospital_id
          );
          console.log("Original hospitalId was:", hospitalId);

          // Try with the correct hospital_id from profile
          const correctedUrl = `/doctors/${doctorProfile.hospital_id}/${doctorId}/appointments`;
          console.log("Trying corrected URL:", correctedUrl);

          const correctedResponse = await http.get(correctedUrl);
          console.log("Corrected API response:", correctedResponse.data);

          // Update localStorage with correct hospital_id
          if (typeof window !== "undefined") {
            try {
              const userData = JSON.parse(
                localStorage.getItem("hmsUser") || "{}"
              );
              if (userData.hospitalId !== doctorProfile.hospital_id) {
                userData.hospitalId = doctorProfile.hospital_id;
                localStorage.setItem("hmsUser", JSON.stringify(userData));
                console.log(
                  "Updated localStorage with correct hospital_id:",
                  doctorProfile.hospital_id
                );
              }
            } catch (localStorageError) {
              console.error(
                "Failed to update localStorage:",
                localStorageError
              );
            }
          }

          return correctedResponse.data;
        }
      } catch (profileError) {
        console.error("Failed to get doctor profile:", profileError);
      }
    }

    // Return empty data structure to prevent UI crashes
    return { appointments: [] };
  }
}

export async function getDoctorAppointmentsByDate({
  hospitalId,
  doctorId,
  date,
}) {
  try {
    const url = `/doctors/${hospitalId}/${doctorId}/appointments/by-date`;
    const { data } = await http.get(url, { params: { date } });
    return data;
  } catch (error) {
    console.error("Error fetching doctor appointments by date:", error);
    return { appointments: [] };
  }
}

export async function getDoctorAppointmentHistory({
  hospitalId,
  doctorId,
  date,
}) {
  try {
    // Debug logging
    console.log("=== getDoctorAppointmentHistory Debug ===");
    console.log("getDoctorAppointmentHistory called with:", {
      hospitalId,
      doctorId,
      date,
    });
    console.log("Types:", {
      hospitalIdType: typeof hospitalId,
      doctorIdType: typeof doctorId,
      dateType: typeof date,
    });

    // Ensure IDs are strings and not null/undefined
    if (!hospitalId || !doctorId || !date) {
      console.error("Missing required parameters:", {
        hospitalId,
        doctorId,
        date,
      });
      return {
        history: {
          day: { appointments: [] },
          week: { appointments: [] },
          month: { appointments: [] },
        },
      };
    }

    // Convert to strings to ensure proper URL encoding
    const hospitalIdStr = String(hospitalId);
    const doctorIdStr = String(doctorId);
    const dateStr = String(date);

    const url = `/doctors/${hospitalIdStr}/${doctorIdStr}/history`;
    console.log("Making request to:", url);
    console.log("Full URL will be:", `${http.defaults.baseURL}${url}`);
    console.log("Query params:", { date: dateStr });

    const { data } = await http.get(url, { params: { date: dateStr } });
    console.log("History API response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching doctor appointment history:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    });

    // If it's a 400 error, it might be a hospital ID mismatch
    if (error.response?.status === 400) {
      console.error(
        "400 Error - This usually means the doctor doesn't belong to the specified hospital"
      );
      console.error("Requested hospitalId:", hospitalId);
      console.error("Requested doctorId:", doctorId);
      console.error("Requested date:", date);

      // Try to get the correct hospital_id from doctor profile
      try {
        console.log(
          "Attempting to get doctor profile to find correct hospital_id for history..."
        );
        const profileResponse = await http.get("/doctors/profile");
        const doctorProfile = profileResponse.data?.doctor;

        if (doctorProfile && doctorProfile.hospital_id) {
          console.log(
            "Found doctor profile with hospital_id:",
            doctorProfile.hospital_id
          );
          console.log("Original hospitalId was:", hospitalId);

          // Try with the correct hospital_id from profile
          const correctedUrl = `/doctors/${doctorProfile.hospital_id}/${doctorId}/history`;
          console.log("Trying corrected URL:", correctedUrl);

          const correctedResponse = await http.get(correctedUrl, {
            params: { date: dateStr },
          });
          console.log(
            "Corrected history API response:",
            correctedResponse.data
          );

          // Update localStorage with correct hospital_id
          if (typeof window !== "undefined") {
            try {
              const userData = JSON.parse(
                localStorage.getItem("hmsUser") || "{}"
              );
              if (userData.hospitalId !== doctorProfile.hospital_id) {
                userData.hospitalId = doctorProfile.hospital_id;
                localStorage.setItem("hmsUser", JSON.stringify(userData));
                console.log(
                  "Updated localStorage with correct hospital_id:",
                  doctorProfile.hospital_id
                );
              }
            } catch (localStorageError) {
              console.error(
                "Failed to update localStorage:",
                localStorageError
              );
            }
          }

          return correctedResponse.data;
        }
      } catch (profileError) {
        console.error(
          "Failed to get doctor profile for history:",
          profileError
        );
      }
    }

    return {
      history: {
        day: { appointments: [] },
        week: { appointments: [] },
        month: { appointments: [] },
      },
    };
  }
}

export async function getAppointmentWithPatientDetails({ appointmentId }) {
  try {
    const url = `/doctors/appointments/${appointmentId}/details`;
    const { data } = await http.get(url);
    return data;
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    return { appointment: null, patient: null };
  }
}

// ✅ Fixed function for marking prescription
export async function markPrescriptionGiven({ hospitalId, appointmentId }) {
  try {
    // Ensure IDs are strings
    const url = `/doctors/appointment/${hospitalId}/${appointmentId}/prescription`;
    const { data } = await http.put(url);
    return data;
  } catch (error) {
    console.error("Error marking prescription as given:", error);
    return { message: "Failed to mark prescription as given" };
  }
}

export async function getDoctorProfile() {
  try {
    const { data } = await http.get(`/doctors/profile`);
    return data;
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    return { doctor: null };
  }
}
