"use client";

export default function PrintTemplate({ prescription, isPrintable = false }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      id="printable-prescription"
      className={`bg-white ${isPrintable ? "p-8" : "p-6"}`}
    >
      {/* Hospital Header */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          MERAKI HOSPITAL
        </h1>
        <p className="text-gray-600">
          123 Healthcare Avenue, Medical City, MC 12345
        </p>
        <p className="text-gray-600">
          Phone: (555) 123-4567 | Email: info@merakihospital.com
        </p>
        <p className="text-gray-600">www.merakihospital.com</p>
      </div>

      {/* Prescription Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            MEDICAL PRESCRIPTION
          </h2>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              Prescription ID: <strong>{prescription.prescriptionId}</strong>
            </p>
            <p>
              Date: <strong>{formatDate(prescription.date)}</strong>
            </p>
            <p>
              Status:{" "}
              <strong
                className={`${
                  prescription.status === "active"
                    ? "text-green-600"
                    : "text-blue-600"
                }`}
              >
                {prescription.status ? prescription.status.toUpperCase() : ""}
              </strong>
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="w-20 h-20 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2 border-2 border-green-300">
            <i className="bi bi-heart-pulse text-green-600 text-xl"></i>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Valid Prescription
          </p>
        </div>
      </div>

      {/* Patient & Doctor Information */}
      <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-300 pb-1">
            PATIENT INFORMATION
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Full Name:</span>
              <span className="font-semibold text-gray-800">
                {prescription.patientName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Patient Email:</span>
              <span className="font-semibold text-gray-800">
                {prescription.patientEmail}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date of Visit:</span>
              <span className="font-semibold text-gray-800">
                {formatDate(prescription.date)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-300 pb-1">
            DOCTOR INFORMATION
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Doctor:</span>
              <span className="font-semibold text-gray-800">
                Dr. Sarah Wilson
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Qualification:</span>
              <span className="font-semibold text-gray-800">
                MBBS, MD - Cardiology
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">License No:</span>
              <span className="font-semibold text-gray-800">MED123456</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hospital:</span>
              <span className="font-semibold text-gray-800">
                Meraki Hospital
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-300 pb-1">
          DIAGNOSIS & CLINICAL FINDINGS
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            {prescription.diagnosis}
          </p>
        </div>
      </div>

      {/* Medicines Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-300 pb-1">
          PRESCRIBED MEDICATIONS
        </h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r border-gray-200">
                  Medicine
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 border-r border-gray-200 w-20">
                  Dosage
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 border-r border-gray-200 w-24">
                  Frequency
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 w-20">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(prescription.medicines)
                ? prescription.medicines
                : []
              ).map((medicine, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <td className="px-4 py-3 border-r border-gray-200">
                    <div className="font-semibold text-gray-800">
                      {medicine.name}
                    </div>
                    {medicine.instructions && (
                      <div className="text-xs text-gray-600 mt-1">
                        {medicine.instructions}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center border-r border-gray-200">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                      {medicine.dosage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center border-r border-gray-200 text-gray-700">
                    {medicine.frequency}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">
                    {medicine.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tests Section */}
      {prescription.tests && prescription.tests.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-300 pb-1">
            RECOMMENDED INVESTIGATIONS
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {prescription.tests.map((test, index) => (
                <li key={index}>{test}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Medical Advice */}
      {prescription.advice && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-300 pb-1">
            MEDICAL ADVICE & PRECAUTIONS
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {prescription.advice}
            </p>
          </div>
        </div>
      )}

      {/* Follow-up Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-300 pb-1">
          FOLLOW-UP INSTRUCTIONS
        </h3>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          {prescription.followUpDate ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Next Appointment:</span>
                <span className="font-semibold text-purple-700">
                  {formatDate(prescription.followUpDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Follow-up Type:</span>
                <span className="font-semibold text-gray-800">
                  Routine Check-up
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">
              No follow-up appointment scheduled. Please contact if symptoms
              persist.
            </p>
          )}
        </div>
      </div>

      {/* Important Notes */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-300 pb-1">
          IMPORTANT NOTES
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
            <li>Complete the full course of medication as prescribed</li>
            <li>Do not stop medications without consulting your doctor</li>
            <li>Report any adverse reactions immediately</li>
            <li>Keep this prescription for future reference</li>
            <li>This prescription is valid for 30 days from issue date</li>
          </ul>
        </div>
      </div>

      {/* Footer & Signatures */}
      <div className="mt-8 pt-6 border-t-2 border-gray-300">
        <div className="flex justify-between items-start">
          {/* Doctor Signature */}
          <div className="text-center">
            <div className="mb-2 border-t border-gray-400 pt-2 w-48 mx-auto">
              <p className="text-sm text-gray-600">
                Doctor's Signature & Stamp
              </p>
            </div>
            <p className="font-semibold text-gray-800">Dr. Sarah Wilson</p>
            <p className="text-sm text-gray-600">Consultant Cardiologist</p>
            <p className="text-sm text-gray-600">Meraki Hospital</p>
          </div>

          {/* Patient Signature */}
          <div className="text-center">
            <div className="mb-2 border-t border-gray-400 pt-2 w-48 mx-auto">
              <p className="text-sm text-gray-600">Patient's Signature</p>
            </div>
            <p className="text-sm text-gray-600">Date: ________________</p>
            <p className="text-sm text-gray-600 mt-2">Patient Consent Given</p>
          </div>
        </div>

        {/* Footer Information */}
        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">
            This is a computer-generated prescription. No physical signature
            required.
          </p>
          <p className="text-xs text-gray-500 mb-1">
            For emergencies: Call (555) 911-HELP | 24/7 Emergency Services
            Available
          </p>
          <p className="text-xs text-gray-500">
            Pharmacy Helpdesk: (555) 123-PHARM | Email:
            pharmacy@merakihospital.com
          </p>
        </div>

        {/* Prescription Validity */}
        <div className="text-center mt-4 p-2 bg-gray-100 rounded">
          <p className="text-xs text-gray-600">
            Prescription Valid Until:{" "}
            {new Date(
              new Date(prescription.date).setDate(
                new Date(prescription.date).getDate() + 30
              )
            ).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
