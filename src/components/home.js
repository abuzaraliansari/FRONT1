import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';
import Navbar from './navbar';
import { Header, Footer, Banner } from './HeaderFooter'; // Import Header and Footer

const Homepage = () => {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);

  console.log('authData:', authData);



  useEffect(() => {
    // Redirect to login page only if authData is null and not in the process of logging in
    if (!authData && window.location.pathname !== '/') {
      navigate('/');
    }
  }, [authData, navigate]);

  return (
    <div>
      <Header />
      <Navbar />
      <Banner />
      
      <Footer />
    </div>
  );
};

export default Homepage; 