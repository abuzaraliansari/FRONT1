import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../App.css"; // Import the CSS file for styling
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx"; // Import xlsx library

const TaxCalculator = () => {
  const location = useLocation();
  const { userData, taxSurveyData, totalTax, pendingTax, discount, lateFee } = location.state || {}; // Access passed data
  const invoiceRef = useRef();
  const [isPaid, setIsPaid] = useState(false); // Track if the payment is made

  // Additional charges
  const gst = 18; // GST percentage
  const otherTax = 2; // Other tax percentage

  const gstAmount = (pendingTax * gst) / 100;
  const otherTaxAmount = (pendingTax * otherTax) / 100;
  const totalAmount = parseFloat(pendingTax) + gstAmount + otherTaxAmount;

  // Function to handle payment
  const handlePayment = () => {
    alert(`Your tax amount ₹${totalAmount.toFixed(2)} has been paid.`);
    setIsPaid(true); // Mark payment as completed
  };

  // Function to export the invoice as PDF
  const exportToPDF = async () => {
    const element = invoiceRef.current;

    const canvas = await html2canvas(element, { scale: 2 }); // Higher scale for better quality
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  };

  // Function to export the data as Excel
  const exportToExcel = () => {
    const worksheetData = [
      ["Sno", "Tax Amount (INR)", "Tax Paid Amount (INR)", "Remaining Amount (INR)", "Tax Calculated Date", "Tax Pending", "Paid Status", "Tax Paid Date", "Tax Paid Mode", "UTR No", "Remark"],
      ...taxSurveyData.map((row) => [
        row.Sno,
        row.TaxAmount,
        row.TaxPaidAmount || "N/A",
        (row.TaxAmount - (row.TaxPaidAmount || 0)).toFixed(2),
        row.TaxCalculatedDate,
        row.TaxPending ? "Yes" : "No",
        row.PaidStatus ? "Paid" : "Pending",
        row.TaxPaidDate || "N/A",
        row.TaxPaidMode || "N/A",
        row.UtrNo || "N/A",
        row.Remark || "N/A",
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice Data");

    XLSX.writeFile(workbook, "invoice.xlsx");
  };

  return (
    <div className="invoice-container">
      <div className="invoice-box" ref={invoiceRef}>
        <header className="invoice-header">
          <h1>GOLF HOMES & KINGSWOOD</h1>
          <p>GH-2, Sector-04, Greater Noida (West), 201301</p>
          <h2>PROPERTY TAX INVOICE</h2>
        </header>

        <div className="invoice-meta">
          <div>
            <p><strong>GSTIN:</strong> NA</p>
            <p><strong>PAN No.:</strong> NA</p>
            <p><strong>REVERSE CHARGE:</strong> N.A.</p>
          </div>
          <div>
            <p><strong>INVOICE DATE:</strong> {taxSurveyData[0]?.TaxCalculatedDate || "N/A"}</p>
            <p><strong>INVOICE NO.:</strong> {taxSurveyData[0]?.ReferenceNo || "N/A"}</p>
            <p><strong>DUE DATE:</strong> {taxSurveyData[0]?.TaxModifiedDate || "N/A"}</p>
          </div>
        </div>

        <div className="invoice-details">
          <p><strong>INVOICE TO:</strong> {userData?.FirstName} {userData?.LastName}</p>
          <p><strong>HOUSE NO.:</strong> {userData?.HouseNumber}</p>
          <p><strong>COLONY:</strong> {userData?.Colony}</p>
          <p><strong>LOCALITY:</strong> {userData?.Locality}</p>
          <p><strong>ZONE:</strong> {userData?.ZoneID}</p>
          <p><strong>MOBILE NO.:</strong> {userData?.MobileNo}</p>
          <p><strong>EMAIL:</strong> {userData?.EmailID || "N/A"}</p>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Sno</th>
              <th>Tax Amount (INR)</th>
              <th>Tax Paid Amount (INR)</th>
              <th>Remaining Amount (INR)</th>
              <th>Tax Calculated Date</th>
              <th>Tax Pending</th>
              <th>Paid Status</th>
              <th>Tax Paid Date</th>
              <th>Tax Paid Mode</th>
              <th>UTR No</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {taxSurveyData.map((row) => (
              <tr key={row.Sno}>
                <td>{row.Sno}</td>
                <td>₹{row.TaxAmount.toFixed(2)}</td>
                <td>₹{row.TaxPaidAmount?.toFixed(2) || "N/A"}</td>
                <td>₹{(row.TaxAmount - (row.TaxPaidAmount || 0)).toFixed(2)}</td>
                <td>{row.TaxCalculatedDate}</td>
                <td>{row.TaxPending ? "Yes" : "No"}</td>
                <td>{row.PaidStatus ? "Paid" : "Pending"}</td>
                <td>{row.TaxPaidDate || "N/A"}</td>
                <td>{row.TaxPaidMode || "N/A"}</td>
                <td>{row.UtrNo || "N/A"}</td>
                <td>{row.Remark || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-summary">
          <p><strong>Subtotal:</strong> ₹{totalTax}</p>
          <p><strong>GST ({gst}%):</strong> ₹{gstAmount.toFixed(2)}</p>
          <p><strong>Other Tax ({otherTax}%):</strong> ₹{otherTaxAmount.toFixed(2)}</p>
          <p><strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}</p>
        </div>

        <footer className="invoice-footer">
          {!isPaid ? (
            <button onClick={handlePayment} className="pay-button">
              Pay ₹{totalAmount.toFixed(2)}
            </button>
          ) : (
            <div className="export-buttons">
              <button onClick={exportToPDF}>Export to PDF</button>
              <button onClick={exportToExcel}>Export to Excel</button>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};

export default TaxCalculator;