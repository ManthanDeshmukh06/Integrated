import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PdfGenerator({ patient, services, total }) {
  const handleDownload = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFont("helvetica");

    // Header
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 139);
    doc.text("CityCare Multispeciality Hospital", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(
      "Near MG Road, Pune – 411001 | Contact: +91 98765 43210 | Email: info@citycarehospital.in",
      105,
      26,
      { align: "center" }
    );

    doc.setDrawColor(0, 0, 139);
    doc.line(15, 30, 195, 30);

    // Title
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 139);
    doc.text("Patient Billing Summary", 105, 40, { align: "center" });

    // Patient Info
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const today = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    let y = 50;
    doc.text(`Name: ${patient.name}`, 15, y);
    doc.text(`Contact: ${patient.contact}`, 110, y);
    doc.text(`Gender: ${patient.gender}`, 15, y + 7);
    doc.text(`Age: ${patient.age}`, 110, y + 7);
    doc.text(`Doctor Name: ${patient.doctorName}`, 15, y + 14);
    doc.text(`Date: ${today}`, 110, y + 14);

    // Table data
    const body = services.map((s) => [s.name, `Rs. ${s.price}`]);
    body.push([
      { content: "Total Amount", styles: { halign: "right", fontStyle: "bold" } },
      { content: `Rs. ${total}`, styles: { halign: "right", fontStyle: "bold" } },
    ]);

    autoTable(doc, {
      startY: y + 25,
      head: [["Service", "Amount (Rs.)"]],
      body,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 11,
        halign: "right",
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [30, 136, 229],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { halign: "left", cellWidth: 120 },
        1: { halign: "right", cellWidth: 45 },
      },
      margin: { left: 20, right: 20 },
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 204);
    doc.text("Thank you for choosing CityCare Hospital!", 105, finalY, {
      align: "center",
    });

    doc.save(`${patient.name}_Bill.pdf`);
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow"
    >
      Generate PDF
    </button>
  );
}
