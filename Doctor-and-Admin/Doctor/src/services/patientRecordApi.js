import httpClient from "./httpClient";

// Fetch prescription history for a doctor
export async function fetchPrescriptionHistory(doctorId, token) {
  return httpClient.get(`/patient-records/doctor/${doctorId}/prescriptions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Create a new patient record with prescription
export async function addPrescriptionToPatientRecord(data, token) {
  return httpClient.post(`/patient-records`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Get all patient records for a specific patient
export async function getPatientRecords(patientId, token) {
  return httpClient.get(`/patient-records/patient/${patientId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Get a single patient record by ID
export async function getSingleRecord(recordId, token) {
  return httpClient.get(`/patient-records/${recordId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Update a patient record
export async function updatePatientRecord(recordId, data, token) {
  return httpClient.put(`/patient-records/${recordId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Delete a patient record
export async function deletePatientRecord(recordId, token) {
  return httpClient.delete(`/patient-records/${recordId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
