import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from './navbar';
import { Header, Footer } from './HeaderFooter';
import '../App.css';

const ComplainSubmit = () => {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    complaintType: '',
    description: '',
    userId: authData?.user?.userID || '',
    mobile: authData?.user?.mobileNumber || '',
    email: authData?.user?.emailID || '',
    geoLocation: authData?.user?.geoLocation || '',
    document: null,
    photo: null,
    ipAddress: authData?.user?.ipAddress || '0.0.0.0',
    zone: authData?.user?.zoneName || '',
    locality: authData?.user?.localityName || '',
    colony: authData?.user?.colonyName || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [complaintRegistrationNo, setComplaintRegistrationNo] = useState('');
  const isAdmin = authData?.user?.roles?.includes('Admin') || false;
  const userDetails = authData?.user || {};
  const location = userDetails.geoLocation ? userDetails.geoLocation.split(',') : null;

  useEffect(() => {
    if (authData) {
      setFormData((prevData) => ({
        ...prevData,
        userId: authData.user.userID || '',
        mobile: authData.user.mobileNumber || '',
        email: authData.user.emailID || '',
        geoLocation: authData.user.geoLocation || '',
        ipAddress: authData.user.ipAddress || '0.0.0.0',
        zone: authData.user.zoneName || '',
        locality: authData.user.localityName || '',
        colony: authData.user.colonyName || '',
      }));
    }
  }, [authData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (e) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setComplaintRegistrationNo('');

    if (!formData.complaintType || !formData.description) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!authData?.user?.userID) {
      setError('User authentication is required.');
      return;
    }

    setLoading(true);

    try {
      const localityRaw = authData.user.locality ?? '';
      const localityValue = String(localityRaw).replace(/\s+/g, '');

      if (!localityValue) {
        setError('Locality is required.');
        setLoading(false);
        return;
      }

      const submitComplaint = {
        colony: authData.user.colony || '',
        complaintStatus: 'Open',
        complaintType: formData.complaintType,
        createdBy: authData.user.username || 'Anonymous',
        createdDate: new Date().toISOString(),
        description: formData.description,
        ipAddress: authData.user.ipAddress || '0.0.0.0',
        isAdmin: authData.user.isAdmin ?? false,
        locality: localityValue,
        localityID: authData.user.localityID || 1,
        location: formData.geoLocation,
        mobileNumber: formData.mobile,
        userID: formData.userId,
        zone: authData.user.zone || '',
        zoneID: authData.user.zoneID || 1,
      };

      const complaintResponse = await axios.post(
        'https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complaints',
        submitComplaint,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData?.token}`,
          },
        }
      );

      if (complaintResponse.data.success) {
        const { complaintID, complaintRegistrationNo } = complaintResponse.data;
        setComplaintRegistrationNo(complaintRegistrationNo);

        if (formData.document || formData.photo) {
          const submitFiles = new FormData();
          if (formData.document) submitFiles.append('attachmentDoc', formData.document);
          if (formData.photo) submitFiles.append('userImage', formData.photo);
          submitFiles.append('userID', formData.userId);
          submitFiles.append('complaintID', complaintID);

          const fileUploadResponse = await axios.post(
            'https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/submitFiles',
            submitFiles,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authData?.token}`,
              },
            }
          );

          if (!fileUploadResponse.data.success) {
            setError('Complaint submitted but file upload failed: ' + 
              (fileUploadResponse.data.message || 'Unknown error'));
            setLoading(false);
            return;
          }
        }

        alert(`Complaint Submitted Successfully! Registration No: ${complaintRegistrationNo}`);
        navigate('/Home', { 
          state: { 
            userId: formData.userId,
            complaintRegistrationNo 
          } 
        });
      } else {
        setError('Failed to submit complaint: ' + 
          (complaintResponse.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.response?.data?.message || 
              error.request ? 'Network Error: No server response' : 
              error.message || 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-box">
      <Header />
      <Navbar />
      <form onSubmit={handleSubmit} className="submit-form">
        <h1>Submit Complaint</h1>

        {error && <div className="error-message">{error}</div>}
        {complaintRegistrationNo && (
          <div className="success-message">Complaint Registration No: {complaintRegistrationNo}</div>
        )}

        <div className="submit-row">
          {isAdmin && (
            <div className="submit-group">
              <label className="admin-details-label">User ID</label>
              <input
                type="text"
                value={userDetails.userID || ''}
                readOnly
                className="admin-details-input"
              />
            </div>
          )}
          {isAdmin && (
            <div className="submit-group">
              <label className="admin-details-label">Mobile No</label>
              <input
                type="text"
                value={userDetails.mobileNumber || ''}
                readOnly
                className="admin-details-input"
              />
            </div>
          )}
          {isAdmin && (
            <div className="submit-group">
              <label className="admin-details-label">Email ID</label>
              <input
                type="text"
                value={userDetails.emailID || ''}
                readOnly
                className="admin-details-input"
              />
            </div>
          )}
          {isAdmin && (
            <div className="submit-group">
              <label className="admin-details-label">Location</label>
              <input
                type="text"
                value={location ? `${location[0]}, ${location[1] || ''}` : ''}
                readOnly
                className="admin-details-input"
              />
            </div>
          )}
          {isAdmin && (
  <div className="submit-group">
    <label className="admin-details-label">Zone</label>
    <select
      name="zone"
      value={formData.zone}
      onChange={handleChange}
      className="admin-details-input"
    >
      <option value="">Select Zone</option>
      <option value="North">North</option>
      <option value="South">South</option>
      <option value="East">East</option>
      <option value="West">West</option>
    </select>
  </div>
)}
{isAdmin && (
  <div className="submit-group">
    <label className="admin-details-label">Locality Ward Sankhya</label>
    <input
      type="text"
      name="locality"
      value={formData.locality}
      onChange={handleChange}
      className="admin-details-input"
    />
  </div>
)}
{isAdmin && (
  <div className="submit-group">
    <label className="admin-details-label">Colony</label>
    <input
      type="text"
      name="colony"
      value={formData.colony}
      onChange={handleChange}
      className="admin-details-input"
    />
  </div>
)}
          <div className="submit-group">
            <label>Complaint Type</label>
            <select
              name="complaintType"
              value={formData.complaintType}
              onChange={handleChange}
              required
              className="submit-select"
            >
              <option value="">Select Complaint Type</option>
              <option value="water">Water</option>
              <option value="electricity">Electricity</option>
              <option value="road">Road</option>
              <option value="garbage">Garbage</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="submit-group">
            <label>Upload Document</label>
            <input
              type="file"
              name="document"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="submit-file"
            />
          </div>
          <div className="submit-group">
            <label>Upload Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="submit-file"
            />
          </div>
          <div className="submit-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Enter your complaint description"
              required
              className="submit-textarea"
              rows="5"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default ComplainSubmit;