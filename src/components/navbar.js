import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        {location.pathname !== '/Home' && (
          <button className="nav-btn" onClick={() => navigateTo('/Home')}>Home</button>
        )}
        <div className="dropdown">
          <button className="nav-btn">Complain</button>
          <div className="dropdown-content">
            <button className="dropdown-item" onClick={() => navigateTo('/ComplainSubmit')}>Submit Complain</button>
            <button className="dropdown-item" onClick={() => navigateTo('/ComplainDetails')}>Complain Status</button>
          </div>
        </div>
        <button className="nav-btn" onClick={() => navigateTo('/UserSurveyDetails')}>User Details</button>
        <button className="nav-btn" onClick={() => navigateTo('/payment')}>Payment</button>
      </nav>
    </div>
  );
};

export default Navbar;