import React, { useState } from 'react';
import '../App.css';
import { Header, Footer } from './HeaderFooter'; // Import Header and Footer
import Navbar from './navbar'; // Import Navbar

const Payment = () => {
  const [showQRCode, setShowQRCode] = useState(false);

  const toggleQR = () => {
    setShowQRCode(!showQRCode);
  };

  return (
    <div>
      <Header /> {/* Add Header */}
      <Navbar /> {/* Add Navbar */}
      <div className="payment-box">
        <h1>Payment Options</h1>
        <div className="payment-option">
          <label>Pay through UPI ID</label>
          <input name="UPI" type="text" id="upi-input" placeholder="Enter your UPI ID" />
          <button type="button" className="pay-btn">Pay</button>
        </div>
        <div className="payment-option">
          <label>Pay through Bank Transfer</label>
          <input name="Bank" type="text" id="bank-input" placeholder="Enter your Bank Details" />
          <button type="button" className="pay-btn">Pay</button>
        </div>
        <div className="qr-code">
          <label>Pay through QR Code</label>
          <button type="button" onClick={toggleQR}>
            {showQRCode ? "Hide QR Code" : "Show QR Code"}
          </button>
          {showQRCode && (
            <div className="qr-image">
              <img src={`${process.env.PUBLIC_URL}/Images/QRcode.png`} alt="QR Code" />
            </div>
          )}
        </div>
      </div>
      <Footer /> {/* Add Footer */}
    </div>
  );
};

export default Payment;