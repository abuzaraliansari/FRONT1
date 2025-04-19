import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const maskAadhaarNumber = (aadhaarNumber) => {
  if (!aadhaarNumber || aadhaarNumber.length < 4) {
    return 'Invalid Aadhaar';
  }
  return aadhaarNumber.slice(0, aadhaarNumber.length - 4).replace(/\d/g, '*') + aadhaarNumber.slice(-4);
};

const UserSurveyDetails = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const response = await axios.post('https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getAllUsersWithRoles', {
        MobileNumber: mobileNumber || '',
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
  };

  const fetchAllData = async () => {
    setLoading(true);

    try {
      const response = await axios.get('https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getAllUsersWithRoles');

      if (response.data) {
        setData(response.data);
        console.log('All Data:', response.data);
      } else {
        alert('No data found.');
      }
    } catch (error) {
      console.error('Error fetching all data:', error);
      alert('An error occurred while fetching all data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="container">
      <div className="content">
        <h1>Find Owner Details</h1>
        <input
          className="input"
          placeholder="Enter Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          type="text"
        />
        <button className="button" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>

        {data.length > 0 && (
          <div className="displayContent">
            <h2>Owner Info</h2>
            <div className="displayTable">
              {data.map((ownerData, index) => (
                <div key={index} className="ownerInfo">
                  <div className="displayRow">
                    <span className="displayCellHeader">First Name</span>
                    <span className="displayCell">{ownerData.owner.FirstName || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Middle Name</span>
                    <span className="displayCell">{ownerData.owner.MiddleName || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Last Name</span>
                    <span className="displayCell">{ownerData.owner.LastName || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Father Name</span>
                    <span className="displayCell">{ownerData.owner.FatherName || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Mobile Number</span>
                    <span className="displayCell">{ownerData.owner.MobileNumber || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Occupation</span>
                    <span className="displayCell">{ownerData.owner.Occupation || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Age</span>
                    <span className="displayCell">{ownerData.owner.Age || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">DOB</span>
                    <span className="displayCell">{ownerData.owner.DOB || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Gender</span>
                    <span className="displayCell">{ownerData.owner.Gender || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Income</span>
                    <span className="displayCell">{ownerData.owner.Income || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Religion</span>
                    <span className="displayCell">{ownerData.owner.Religion || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Category</span>
                    <span className="displayCell">{ownerData.owner.Category || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Email</span>
                    <span className="displayCell">{ownerData.owner.Email || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Pan Card Number</span>
                    <span className="displayCell">{ownerData.owner.PanNumber || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Adhar Card Number</span>
                    <span className="displayCell">{maskAadhaarNumber(ownerData.owner.AdharNumber)}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Number Of Members</span>
                    <span className="displayCell">{ownerData.owner.NumberOfMembers || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Created By</span>
                    <span className="displayCell">{ownerData.owner.CreatedBy || 'N/A'}</span>
                  </div>
                  <div className="displayRow">
                    <span className="displayCellHeader">Modified By</span>
                    <span className="displayCell">{ownerData.owner.UserModifiedBy || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSurveyDetails;