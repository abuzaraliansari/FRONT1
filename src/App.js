import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/login';
import Homepage from './components/home';
import ComplainSubmit from './components/complainSubmit';
import ComplainDetails from './components/complainDetails';
import ComplainDetailsPage from './components/complainDetailsPage';
import ReplyPage from './components/ReplyPage';
import LocationPage from './components/locationPage';
import Payment from './components/payment';
import UsersList from './components/userSurveyDetails';
import SurveyData from './components/surveyData';
import TaxCalculator from './components/taxcalculator';
import TaxSurvey from './components/tax';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
        
          <Route path="/Home" element={<Homepage />} />
          <Route path="/ComplainSubmit" element={<ComplainSubmit />} />
          <Route path="/ComplainDetails" element={<ComplainDetails />} />
          <Route path="/complainDetailspage/:id" element={<ComplainDetailsPage />} />
          <Route path="/ReplyPage" element={<ReplyPage />} />
          <Route path="/locationPage" element={<LocationPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/UserSurveyDetails" element={<UsersList />} />
          <Route path="/SurveyData" element={<SurveyData />} />
          <Route path="/TaxCalculator" element={<TaxCalculator />} />
          <Route path="/TaxSurvey" element={<TaxSurvey />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;