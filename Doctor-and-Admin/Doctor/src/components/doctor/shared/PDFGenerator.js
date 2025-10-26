"use client";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PDFGenerator({ contentRef, fileName = "prescription", onGenerate, buttonText = "Download PDF" }) {
  const generatePDF = async () => {
    const element = contentRef.current;
    
    if (!element) {
      console.error("No content to generate PDF");
      alert("No content available for PDF generation");
      return;
    }

    try {
      // Show loading state
      const originalText = document.activeElement?.textContent;
      if (document.activeElement) {
        document.activeElement.innerHTML = '<i class="bi bi-hourglass-split"></i> Generating PDF...';
        document.activeElement.disabled = true;
      }

      // Hide non-printable elements
      const nonPrintableElements = element.querySelectorAll('.no-print');
      const originalDisplay = [];
      nonPrintableElements.forEach((el, index) => {
        originalDisplay[index] = el.style.display;
        el.style.display = 'none';
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      // Restore non-printable elements
      nonPrintableElements.forEach((el, index) => {
        el.style.display = originalDisplay[index];
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 height in mm

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`${fileName}-${new Date().getTime()}.pdf`);
      
      // Restore button state
      if (document.activeElement) {
        document.activeElement.innerHTML = `<i class="bi bi-file-pdf"></i> ${buttonText}`;
        document.activeElement.disabled = false;
      }

      if (onGenerate) {
        onGenerate();
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Restore button state on error
      if (document.activeElement) {
        document.activeElement.innerHTML = `<i class="bi bi-file-pdf"></i> ${buttonText}`;
        document.activeElement.disabled = false;
      }
      
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 no-print"
    >
      <i className="bi bi-file-pdf"></i>
      {buttonText}
    </button>
  );
}