import React, { useRef } from "react";
import "../App.css"; // Import the CSS file for styling
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx"; // Import xlsx library

const TaxCalculator = () => {
  const invoiceRef = useRef();

  // Hardcoded user data from Users table
  const userData = {
    userID: 12,
    username: "Kanhaiya",
    mobileNumber: "7300610205",
    emailID: "",
    firstName: "Kanhaiya",
    middleName: "",
    lastName: "Varshney",
    adharNumber: "268744705658",
    houseNumber: "2",
    colonyName: "Colony 1A",
    localityName: "Locality Ward 1",
    zoneName: "North",
  };

  // Hardcoded tax data from TaxSurvey table
  const taxData = [
    {
      sno: 1,
      userID: 1001,
      taxAmount: 2500.0,
      taxCalculatedDate: "2025-03-01 10:00:00.000",
      taxPending: 0,
      taxModifiedDate: "2025-03-02 09:00:00.000",
      paidStatus: 1,
      updatedBy: "system",
      updatedDate: "2025-03-02 09:00:00.000",
      remark: "Paid on time via UPI",
      taxPaidAmount: 2500.0,
      taxPaidDate: "2025-03-02 09:30:00.000",
      taxPaidMode: "UPI",
      utrNo: "UTR1234567890",
      referenceNo: "REF123UPI",
      returnAmount: 0.0,
      returnReferenceNo: "NA",
      returnDate: null,
      lateTaxFee: 0.0,
      taxYear: 2025,
    },
  ];

  // Additional charges
  const gst = 18; // GST percentage
  const otherTax = 2; // Other tax percentage

  // Calculate remaining amount for each row
  const taxDataWithRemaining = taxData.map((row) => ({
    ...row,
    remainingAmount: row.taxAmount - (row.taxPaidAmount || 0),
  }));

  const totalTaxAmount = taxDataWithRemaining.reduce((sum, row) => sum + row.remainingAmount, 0);
  const gstAmount = (totalTaxAmount * gst) / 100;
  const otherTaxAmount = (totalTaxAmount * otherTax) / 100;
  const totalAmount = totalTaxAmount + gstAmount + otherTaxAmount;

  // Function to export the invoice as PDF
  const exportToPDF = async () => {
    const element = invoiceRef.current;

    // Hide the buttons before generating the PDF
    const exportButtons = document.querySelector(".export-buttons");
    exportButtons.style.display = "none";

    const canvas = await html2canvas(element, { scale: 2 }); // Higher scale for better quality
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");

    // Show the buttons again after generating the PDF
    exportButtons.style.display = "block";
  };

  // Function to export the data as Excel
  const exportToExcel = () => {
    const worksheetData = [
      ["Sno", "Tax Amount (INR)", "Tax Paid Amount (INR)", "Remaining Amount (INR)", "Tax Calculated Date", "Tax Pending", "Paid Status", "Tax Paid Date", "Tax Paid Mode", "UTR No", "Remark"],
      ...taxDataWithRemaining.map((row) => [
        row.sno,
        row.taxAmount,
        row.taxPaidAmount || "N/A",
        row.remainingAmount.toFixed(2),
        row.taxCalculatedDate,
        row.taxPending ? "Yes" : "No",
        row.paidStatus ? "Paid" : "Pending",
        row.taxPaidDate || "N/A",
        row.taxPaidMode || "N/A",
        row.utrNo || "N/A",
        row.remark || "N/A",
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
            <p><strong>INVOICE DATE:</strong> {taxData[0].taxCalculatedDate}</p>
            <p><strong>INVOICE NO.:</strong> {taxData[0].referenceNo}</p>
            <p><strong>DUE DATE:</strong> {taxData[0].taxModifiedDate}</p>
          </div>
        </div>

        <div className="invoice-details">
          <p><strong>INVOICE TO:</strong> {userData.firstName} {userData.lastName}</p>
          <p><strong>HOUSE NO.:</strong> {userData.houseNumber}</p>
          <p><strong>COLONY:</strong> {userData.colonyName}</p>
          <p><strong>LOCALITY:</strong> {userData.localityName}</p>
          <p><strong>ZONE:</strong> {userData.zoneName}</p>
          <p><strong>MOBILE NO.:</strong> {userData.mobileNumber}</p>
          <p><strong>EMAIL:</strong> {userData.emailID || "N/A"}</p>
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
            {taxDataWithRemaining.map((row) => (
              <tr key={row.sno}>
                <td>{row.sno}</td>
                <td>₹{row.taxAmount.toFixed(2)}</td>
                <td>₹{row.taxPaidAmount?.toFixed(2) || "N/A"}</td>
                <td>₹{row.remainingAmount.toFixed(2)}</td>
                <td>{row.taxCalculatedDate}</td>
                <td>{row.taxPending ? "Yes" : "No"}</td>
                <td>{row.paidStatus ? "Paid" : "Pending"}</td>
                <td>{row.taxPaidDate || "N/A"}</td>
                <td>{row.taxPaidMode || "N/A"}</td>
                <td>{row.utrNo || "N/A"}</td>
                <td>{row.remark || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-summary">
          <p><strong>Subtotal:</strong> ₹{totalTaxAmount.toFixed(2)}</p>
          <p><strong>GST ({gst}%):</strong> ₹{gstAmount.toFixed(2)}</p>
          <p><strong>Other Tax ({otherTax}%):</strong> ₹{otherTaxAmount.toFixed(2)}</p>
          <p><strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}</p>
        </div>

        <footer className="invoice-footer">
          <p>Amount in words: Two Thousand Five Hundred Rupees Only</p>
          <p>Powered by NoBrokerHood</p>
          <div className="export-buttons">
            <button onClick={exportToPDF}>Export to PDF</button>
            <button onClick={exportToExcel}>Export to Excel</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TaxCalculator;