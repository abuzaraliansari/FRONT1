import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import { AuthContext } from '../contexts/AuthContext';
import { Header, Footer } from './HeaderFooter';
import Navbar from './navbar';

const maskAadhaarNumber = (aadhaarNumber) => {
  if (aadhaarNumber && aadhaarNumber.length === 12) {
    return '' + aadhaarNumber.slice(-4);
  }
  return 'N/A';
};

const SurveyData = () => {
  const { authData } = useContext(AuthContext);
  const [mobileNumber, setMobileNumber] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleSearch = useCallback(async (mobile = mobileNumber) => {
    if (!mobile) {
      alert('Please enter a mobile number.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/data', {
        MobileNumber: mobile,
      });

      if (response.data) {
        setData(response.data);
        console.log('Data:', response.data);
      } else {
        alert('No data found.');
      }
    } catch (error) {
      if (error.response && error.response.status === 204) {
        alert('No owner found.');
      } else {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching data.');
      }
    } finally {
      setLoading(false);
    }
  }, [mobileNumber]);

  useEffect(() => {
    const passedMobile = location.state?.mobileNumber;
    if (passedMobile && !mobileNumber) {
      setMobileNumber(passedMobile);
      handleSearch(passedMobile);
    }
  }, [location.state, mobileNumber, handleSearch]);

  const toggleActiveStatus = async () => {
    const newStatus = !data.owner.UserIsActive;
  
    const confirmChange = window.confirm(
      `Are you sure you want to change the status to ${newStatus ? 'Active' : 'Inactive'}?`
    );
  
    if (!confirmChange) {
      return;
    }
  
    try {
      const response = await axios.post('https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/updateUserStatus', {
        mobileNo: data.owner.MobileNumber,
        isActive: newStatus,
        modifiedBy: authData?.user?.username,
      });
  
      if (response.data.success) {
        setData((prevData) => ({
          ...prevData,
          owner: {
            ...prevData.owner,
            UserIsActive: newStatus,
            ModifiedBy: authData?.user?.username,
          },
        }));
        alert('Status updated successfully.');
        window.history.back(); // Navigate back to the previous page
      } else {
        alert('Failed to update status.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('An error occurred while updating status.');
    }
  };

  console.log('Data:', data);

  return (
    <div>
      <Header />
      <Navbar />
      <div className="survey-data-container">
        <div className="survey-data-content">
      
          
          
          

          {data && (
            <div className="survey-data-displayContent">
              <h1>User Info</h1>
              <div className="survey-data-table-container">
                <table className="survey-data-table">
                  <tbody>
                    <tr>
                      <td className="survey-data-table-header">First Name</td>
                      <td className="survey-data-table-cell">{data.owner.FirstName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">Middle Name</td>
                      <td className="survey-data-table-cell">{data.owner.MiddleName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">Last Name</td>
                      <td className="survey-data-table-cell">{data.owner.LastName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">Father Name</td>
                      <td className="survey-data-table-cell">{data.owner.FatherName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">Mobile Number</td>
                      <td className="survey-data-table-cell">{data.owner.MobileNumber || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">Occupation</td>
                      <td className="survey-data-table-cell">{data.owner.Occupation || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">Age</td>
                      <td className="survey-data-table-cell">{data.owner.Age || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">DOB</td>
                      <td className="survey-data-table-cell">{data.owner.DOB || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">Gender</td>
                      <td className="survey-data-table-cell">{data.owner.Gender || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">Income</td>
                      <td className="survey-data-table-cell">{data.owner.Income || 'N/A'}</td>
                    </tr>
                    
                  </tbody>
                </table>
                <table className="survey-data-table">
                  <tbody>
                    <tr>
                      <td className="survey-data-table-header">Religion</td>
                      <td className="survey-data-table-cell">{data.owner.Religion || 'N/A'}</td>
                    </tr>
                  <tr>
                      <td className="survey-data-table-header">Category</td>
                      <td className="survey-data-table-cell">{data.owner.Category || 'N/A'}</td>
                    </tr>
                    
                    <tr>
                      <td className="survey-data-table-header">Email</td>
                      <td className="survey-data-table-cell">{data.owner.Email || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">Pan Card Number</td>
                      <td className="survey-data-table-cell">{data.owner.PanNumber || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">Aadhaar Number</td>
                      <td className="survey-data-table-cell">{maskAadhaarNumber(data.owner.AdharNumber)}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">No of Members</td>
                      <td className="survey-data-table-cell">{data.owner.NumberOfMembers || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">Created By</td>
                      <td className="survey-data-table-cell">{data.owner.CreatedBy || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">Modified By</td>
                      <td className="survey-data-table-cell">{data.owner.UserModifiedBy || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">Active Status</td>
                      <td className="survey-data-table-cell">{data.owner.UserIsActive ? 'Active' : 'Inactive'}</td>
                    </tr>
                    <tr>
                      <td className="survey-data-table-header">Edit Status</td>
                      <td className="survey-data-table-cell">
                        <button
                          className={`survey-data-statusButton ${data.owner.UserIsActive ? 'survey-data-active' : 'survey-data-inactive'}`}
                          onClick={toggleActiveStatus}
                        >
                          {data.owner.UserIsActive ? 'Set Inactive' : 'Set Active'}
                        </button>
                      </td>
                    </tr>
                    
                  </tbody>

                  
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="survey-data-column">
        <button className="survey-data-back-button" onClick={() => window.history.back()}>
        Back
      </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SurveyData;