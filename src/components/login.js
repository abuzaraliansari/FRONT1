import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { Header, Footer, Banner } from './HeaderFooter';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setOtpError('');
    setOtpSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOtpError('');
    setOtpSuccess('');
    // Call login API
    try {
      const response = await fetch('https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/loginC', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });
      const result = await response.json();
      console.log('Login API response:', result); // Show API response in console
      if (result.success) {
        setAuthData(result); // Store auth data in context/localStorage
        setShowOtp(true);
        setResendTimer(60);
        setCanResend(false);
        setFieldsDisabled(true);
      } else {
        setError('Invalid username or password');
        setShowOtp(false);
      }
    } catch {
      setError('Login failed, please try again.');
      setShowOtp(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError('OTP must be exactly 6 digits');
      return;
    }
    // Simulate OTP API call (replace with real API if needed)
    if (otp === '444444') {
      setOtpSuccess('OTP is correct!');
      setOtpError('');
      setTimeout(() => {
        navigate('/Home');
      }, 800);
    } else {
      setOtpError('Invalid or expired OTP');
      setOtpSuccess('');
    }
  };

  const handleResendOtp = () => {
    if (canResend) {
      setOtp('');
      setOtpError('');
      setOtpSuccess('');
      setResendTimer(60);
      setCanResend(false);
      setFieldsDisabled(true);
    }
  };

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (resendTimer === 0 && showOtp) {
      setCanResend(true);
      setFieldsDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, showOtp]);

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
            {!showOtp ? (
              <form onSubmit={handleSubmit}>
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
                  <button type="submit" className="login-btn">Get OTP</button>
                </div>
                {error && <p className="login-error">{error}</p>}
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <div className="login-form">
                  <input
                    type="text"
                    className="login-input"
                    id="otp"
                    placeholder="Enter OTP (444444)"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength={6}
                  />
                  <button type="submit" className="login-btn">Login</button>
                </div>
                {otpError && <p className="login-error">{otpError}</p>}
                {otpSuccess && <p className="login-success">{otpSuccess}</p>}
                <div style={{ marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="resend-btn"
                    onClick={handleResendOtp}
                    disabled={!canResend}
                    style={{ background: canResend ? '#4caf50' : '#ccc', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: canResend ? 'pointer' : 'not-allowed' }}
                  >
                    {canResend ? 'Resend OTP' : `Resend OTP (${resendTimer}s)`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;