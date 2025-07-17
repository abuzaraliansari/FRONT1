import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import { Header, Footer } from './HeaderFooter';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetails } = location.state || {};
  const { mobileNumber } = userDetails || {};
  console.log('Location state:', location.state);
  console.log('Location state in OtpVerification:', location.state);


  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('OTP must be exactly 6 digits');
      return;
    }

    try {
      const response = await axios.post(
        'https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/verifyOtp',
        { mobileNumber, otp }
      );

      if (response.data.success) {
        alert('OTP verified successfully');
        navigate('/Home', { state: { userDetails } }); // Navigate to the home page
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to verify OTP, please try again.');
    }
  };

  return (
    <div>
      <Header />
      <div className="otp-wrapper">
        <div className="otp-container">
          <h1>Verify OTP</h1>
          <p>Enter the 6-digit OTP sent to {mobileNumber}</p>
          <input
            type="text"
            className="otp-input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <button className="otp-btn" onClick={handleVerifyOtp}>
            Verify OTP
          </button>
          {error && <p className="otp-error">{error}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OtpVerification;