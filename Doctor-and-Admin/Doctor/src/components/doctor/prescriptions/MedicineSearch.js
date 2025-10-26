"use client";
import { useState, useEffect } from "react";

// Mock medicine database
const medicineDatabase = [
  { name: "Paracetamol", dosage: "500mg", type: "Analgesic" },
  { name: "Ibuprofen", dosage: "400mg", type: "NSAID" },
  { name: "Amoxicillin", dosage: "500mg", type: "Antibiotic" },
  { name: "Lisinopril", dosage: "10mg", type: "ACE Inhibitor" },
  { name: "Atorvastatin", dosage: "20mg", type: "Statin" },
  { name: "Metformin", dosage: "500mg", type: "Antidiabetic" },
  { name: "Salbutamol", dosage: "100mcg", type: "Bronchodilator" },
  { name: "Omeprazole", dosage: "20mg", type: "PPI" },
  { name: "Amlodipine", dosage: "5mg", type: "Calcium Channel Blocker" },
  { name: "Levothyroxine", dosage: "50mcg", type: "Thyroid Hormone" }
];

export default function MedicineSearch({ onMedicineSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const results = medicineDatabase.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm]);

  const handleMedicineSelect = (medicine) => {
    onMedicineSelect(medicine);
    setSearchTerm("");
    setShowResults(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Search Medicine Database
      </label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search medicines..."
          className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <i className="bi bi-search absolute left-3 top-3.5 text-gray-400"></i>
      </div>

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {searchResults.map((medicine, index) => (
            <button
              key={index}
              onClick={() => handleMedicineSelect(medicine)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-gray-800">{medicine.name}</div>
              <div className="text-sm text-gray-500">
                {medicine.dosage} • {medicine.type}
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && searchResults.length === 0 && searchTerm.length > 1 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
          <div className="text-gray-500 text-center">No medicines found</div>
        </div>
      )}
    </div>
  );
}