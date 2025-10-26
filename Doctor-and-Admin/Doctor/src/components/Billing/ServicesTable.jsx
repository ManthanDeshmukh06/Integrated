import React, { useState } from "react";

export default function ServicesTable({ services, setServices }) {
  // Predefined hospital services with fixed prices
  const availableServices = [
    { name: "Consultation", price: 500 },
    { name: "Follow-up", price: 300 },
    { name: "X-Ray", price: 800 },
    { name: "Blood Test", price: 400 },
    { name: "MRI Scan", price: 2500 },
    { name: "Sonography", price: 1200 },
    { name: "Bed Charges", price: 1000 },
    { name: "ECG", price: 600 },
    { name: "Injection", price: 150 },
    { name: "Operation Theatre", price: 5000 },
  ];

  const [selectedService, setSelectedService] = useState("");
  const [price, setPrice] = useState("");

  const handleAddService = () => {
    if (!selectedService) {
      alert("Please select a service first!");
      return;
    }

    const newService = {
      name: selectedService,
      price: parseFloat(price || 0),
    };

    setServices([...services, newService]);
    setSelectedService("");
    setPrice("");
  };

  // When user selects service from dropdown
  const handleServiceSelect = (e) => {
    const name = e.target.value;
    setSelectedService(name);
    const selected = availableServices.find((s) => s.name === name);
    setPrice(selected ? selected.price : "");
  };

  return (
    <div className="mt-6 bg-blue-50 border border-blue-300 rounded-lg p-5 shadow-md">
      <h2 className="text-lg font-semibold text-blue-700 mb-3">
        Add Services Used
      </h2>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={selectedService}
          onChange={handleServiceSelect}
          className="border border-blue-300 rounded-lg p-2 w-1/2 focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Service</option>
          {availableServices.map((s, i) => (
            <option key={i} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border border-blue-300 rounded-lg p-2 w-1/4"
        />

        <button
          onClick={handleAddService}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + Add
        </button>
      </div>

      {/* Display Added Services */}
      {services.length > 0 && (
        <table className="w-full border border-blue-300 mt-4">
          <thead className="bg-blue-200">
            <tr>
              <th className="border p-2 text-left">Service</th>
              <th className="border p-2 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={i}>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2 text-right">{s.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
