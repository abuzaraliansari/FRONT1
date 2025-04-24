import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "./navbar";
import { Header, Footer } from "./HeaderFooter";
import "../App.css";

const ComplainSubmit = () => {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    complaintType: "",
    description: "",
    userId: "",
    mobile: "",
    email: "",
    geoLocation: "",
    document: null,
    photo: null,
    ipAddress: "0.0.0.0",
    zone: "",
    locality: "",
    colony: "",
  });

  const [localities, setLocalities] = useState([]);
  const [colonies, setColonies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [complaintRegistrationNo, setComplaintRegistrationNo] = useState("");

  const isAdmin = authData?.user?.roles?.includes("Admin") || false;

  const fetchUserData = async (mobileNumber) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getAllUsersWithRoleslimit",
        { mobileNumber },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.token}`,
          },
        }
      );

      if (response.data.success) {
        const user = response.data.users[0];
        setFormData((prevData) => ({
          ...prevData,
          userId: user.userID || "",
          mobile: user.mobileNumber || "",
          email: user.emailID || "",
          geoLocation: user.geoLocation || "",
          zone: user.zoneName || "",
          locality: user.localityName || "",
          colony: user.colonyName || "",
        }));
      } else {
        setError("No user found with the provided mobile number.");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      description: value,
    }));
  };

  const handleMobileChange = (e) => {
    const mobileNumber = e.target.value;
    setFormData((prevData) => ({ ...prevData, mobile: mobileNumber }));

    if (isAdmin && mobileNumber.length === 10) {
      fetchUserData(mobileNumber);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setComplaintRegistrationNo("");

    if (!formData.complaintType || !formData.description) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const submitComplaint = {
        colony: formData.colony,
        complaintStatus: "Open",
        complaintType: formData.complaintType,
        createdBy: authData.user.username || "Anonymous",
        createdDate: new Date().toISOString(),
        description: formData.description,
        ipAddress: formData.ipAddress,
        isAdmin: isAdmin,
        locality: formData.locality,
        localityID: authData.user.localityID || 1,
        location: formData.geoLocation,
        mobileNumber: formData.mobile,
        userID: formData.userId,
        zone: formData.zone,
        zoneID: authData.user.zoneID || 1,
      };

      const complaintResponse = await axios.post(
        "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complaints",
        submitComplaint,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.token}`,
          },
        }
      );

      if (complaintResponse.data.success) {
        const { complaintID, complaintRegistrationNo } = complaintResponse.data;
        setComplaintRegistrationNo(complaintRegistrationNo);

        if (formData.document || formData.photo) {
          const submitFiles = new FormData();
          if (formData.document)
            submitFiles.append("attachmentDoc", formData.document);
          if (formData.photo) submitFiles.append("userImage", formData.photo);
          submitFiles.append("userID", formData.userId);
          submitFiles.append("complaintID", complaintID);

          const fileUploadResponse = await axios.post(
            "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/submitFiles",
            submitFiles,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${authData?.token}`,
              },
            }
          );

          if (!fileUploadResponse.data.success) {
            setError(
              "Complaint submitted but file upload failed: " +
                (fileUploadResponse.data.message || "Unknown error")
            );
            setLoading(false);
            return;
          }
        }

        alert(
          `Complaint Submitted Successfully! Registration No: ${complaintRegistrationNo}`
        );
        navigate("/Home", {
          state: {
            userId: formData.userId,
            complaintRegistrationNo,
          },
        });
      } else {
        setError(
          "Failed to submit complaint: " +
            (complaintResponse.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unexpected error occurred"
      );
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
          <div className="success-message">
            Complaint Registration No: {complaintRegistrationNo}
          </div>
        )}


        <div className="search-section1">
        <div className="search-form1">
  <label htmlFor="searchInput">Search by Mobile Number   </label>
  <input
    type="text"
    id="searchInput"
    value={formData.searchMobile || ""}
    onChange={(e) => {
      const mobileNumber = e.target.value;
      setFormData((prevData) => ({ ...prevData, searchMobile: mobileNumber }));

      // Trigger fetchUserData when the mobile number is 10 digits
      if (mobileNumber.length === 10) {
        fetchUserData(mobileNumber);
      }
    }}
    placeholder="Enter Mobile Number"
    className="search-input"
  />
</div>
        </div>
        
        <div className="submit-row grouped-fields">

        


          {isAdmin && (
            <>
              <div className="submit-group">
                <label className="admin-details-label">User ID</label>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId || ""}
                  onChange={handleChange}
                  readOnly
                  className="admin-details-input"
                />
              </div>
              <div className="submit-group">
                <label className="admin-details-label">Mobile No</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile || ""}
                  onChange={handleMobileChange}
                  className="admin-details-input"
                />
              </div>
              <div className="submit-group">
                <label className="admin-details-label">Email ID</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="admin-details-input"
                />
              </div>
              <div className="submit-group">
                <label className="admin-details-label">Location</label>
                <input
                  type="text"
                  name="geoLocation"
                  value={formData.geoLocation || ""}
                  onChange={handleChange}
                  className="admin-details-input"
                />
              </div>
              <div className="submit-group">
                <label className="admin-details-label">Zone</label>
                <input
                  type="text"
                  name="zone"
                  value={formData.zone || ""}
                  onChange={handleChange}
                  className="admin-details-input"
                />
              </div>
              <div className="submit-group">
                <label className="admin-details-label">Locality</label>
                <input
                  type="text"
                  name="locality"
                  value={formData.locality || ""}
                  onChange={handleChange}
                  className="admin-details-input"
                />
              </div>
              <div className="submit-group">
                <label className="admin-details-label">Colony</label>
                <input
                  type="text"
                  name="colony"
                  value={formData.colony || ""}
                  onChange={handleChange}
                  className="admin-details-input"
                />
              </div>
            </>
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
          
        </div>

        <div className="submit-row upload-description">
          
          <div className="description-box">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Enter your complaint description"
              required
              className="submit-textarea"
              rows="10"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default ComplainSubmit;
