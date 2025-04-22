import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';
import { Header, Footer, Banner } from './HeaderFooter'; // Import Header and Footer from HeaderFooter.js

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: formData.username,
      password: formData.password,
    };

    fetch('https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/loginC', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('API Response:', data);
          setAuthData(data); // Update authData with the API response
          navigate('/Home'); // Navigate to Home after setting authData
        } else {
          setError(data.message);
        }
      })
      .catch(() => {
        setError('Login failed, please try again.');
      });
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
                />
                <input
                  type="password"
                  className="login-input"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button type="submit" className="login-btn">Login</button>
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