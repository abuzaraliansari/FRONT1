import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';
import { Header, Footer, Banner } from './HeaderFooter';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    otp: ''
  });
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);
  const [mobileNumber, setMobileNumber] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleGetOtp = async (e) => {
    e.preventDefault();
    setError('');
    const data = {
      username: formData.username,
      password: formData.password,
    };
    try {
      const response = await fetch('https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/loginC', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setAuthData(result);
        const mobile = result.user?.MobileNumber || formData.username;
        setMobileNumber(mobile);
        const otpResponse = await fetch('https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/sendSms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobileNumber: mobile }),
        });
        const otpData = await otpResponse.json();
        if (otpData.success) {
          setOtpSent(true);
          setFieldsDisabled(true);
        } else {
          setError('Failed to send OTP');
        }
      } else {
        setError(result.message);
      }
    } catch {
      setError('Login failed, please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.otp.length !== 6) {
      setError('OTP must be exactly 6 digits');
      return;
    }
    try {
      const response = await fetch('https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/verifyOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, otp: formData.otp }),
      });
      const result = await response.json();
      if (result.success) {
        alert('OTP verified successfully');
        navigate('/Home', { state: { userDetails: { mobileNumber } } });
      } else {
        setError(result.message);
      }
    } catch {
      setError('Failed to verify OTP, please try again.');
    }
  };

  return (
    <div>
      <Header />
      <Banner />
      <div className="login-wrapper">
        <div className="image-box">
          <img src={`${process.env.PUBLIC_URL}/Images/about_bann.png`} alt="" />
        </div>
        <div className="login-container">
          <div className="login-box">
            <h1>Login</h1>
            <form onSubmit={otpSent ? handleVerifyOtp : handleGetOtp}>
              <div className="login-message">
                <p>Password: First 4 digits of Mobile No + <br /> Last 4 digits of Aadhaar No</p>
              </div>
              <div className="login-form">
                <input
                  type="text"
                  className="login-input"
                  id="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={fieldsDisabled}
                />
                <input
                  type="password"
                  className="login-input"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={fieldsDisabled}
                />
                {otpSent && (
                  <input
                    type="text"
                    className="login-input"
                    id="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength={6}
                  />
                )}
                <button type="submit" className="login-btn">
                  {otpSent ? 'Login' : 'Get OTP'}
                </button>
              </div>
              {error && <p className="login-error">{error}</p>}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;