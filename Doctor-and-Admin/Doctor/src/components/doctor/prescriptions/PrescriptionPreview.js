"use client";
import { useRef } from "react";
import PrintTemplate from "../shared/PrintTemplate";
import PDFGenerator from "../shared/PDFGenerator";

export default function PrescriptionPreview({ prescription, onPrint, onClose }) {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    
    // Restore the scroll position and re-render
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Prescription Preview</h2>
            <div className="flex items-center gap-2">
              <PDFGenerator 
                contentRef={printRef}
                fileName={`prescription-${prescription.prescriptionId}`}
                onGenerate={() => console.log("PDF generated successfully")}
              />
              <button 
                onClick={handlePrint}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <i className="bi bi-printer"></i>
                Print
              </button>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="bi bi-x-lg text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Printable Content */}
        <div ref={printRef} className="p-6">
          {/* Print-only styles */}
          <style jsx>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-prescription, #printable-prescription * {
                visibility: visible;
              }
              #printable-prescription {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                background: white;
              }
              .no-print {
                display: none !important;
              }
              @page {
                margin: 0.5in;
                size: letter;
              }
            }
          `}</style>

          <PrintTemplate prescription={prescription} isPrintable={true} />
        </div>

        {/* Action Buttons (Non-printable) */}
        <div className="no-print p-6 border-t border-gray-200">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Close Preview
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
            >
              <i className="bi bi-printer"></i>
              Print Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}