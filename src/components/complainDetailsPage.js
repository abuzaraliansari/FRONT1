import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Header, Footer } from "./HeaderFooter";
import "../App.css";
import Navbar from "./navbar";
import { AuthContext } from "../contexts/AuthContext";

const ComplainDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const complaint = location.state;
  const { authData } = useContext(AuthContext);

  const API_URL = "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net";

  if (!complaint) {
    console.error("No complaint data received.");
    return <div className="loading">No complaint details available.</div>;
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const updateComplaintStatus = async () => {
    const data = {
      complaintno: complaint.ComplaintID,
      status: "Closed",
      modifiedBy: authData.user.username,
    };

    console.log("API URL:", `${API_URL}/auth/updateComplaintStatus`);
    console.log("Request Body for Closing Complaint:", data);

    try {
      const response = await axios.post(`${API_URL}/auth/updateComplaintStatus`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
      });
      console.log("Response for Closing Complaint:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating complaint status:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
      }
      alert("Failed to close the complaint. Please try again.");
    }
  };

  const updateComplaintStatusOpen = async () => {
    const data = {
      complaintno: complaint.ComplaintID,
      status: "Open",
      modifiedBy: authData.user.username,
    };

    console.log("Request Body for Opening Complaint:", data);

    try {
      const response = await axios.post(`${API_URL}/auth/updateComplaintStatusOpen`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
      });
      console.log("Response for Opening Complaint:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating complaint status to open:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
      }
      alert("Failed to open the complaint. Please try again.");
    }
  };

  const handleCloseComplaint = async () => {
    const result = await updateComplaintStatus();
    if (result?.success) {
      alert("Complaint closed successfully.");
      navigate(0);
    }
  };

  const handleOpenComplaint = async () => {
    const result = await updateComplaintStatusOpen();
    if (result?.success) {
      alert("Complaint opened successfully.");
      navigate(0);
    }
  };

  return (
    <div>
      <Header />
      <Navbar />
      <div className="complaint-details-container">
        <div className="complaint-details">
          <h2>Complaint Details</h2>

          <div className="details-info">
            <p>
              <strong>Complaint ID:</strong> {complaint.ComplaintID || "N/A"}
            </p>
            <p>
              <strong>Registration No:</strong>{" "}
              {complaint.ComplaintRegistrationNo || "N/A"}
            </p>
            <p>
              <strong>User ID:</strong> {complaint.UserID || "N/A"}
            </p>
            <p>
              <strong>Complaint Type:</strong>{" "}
              {complaint.ComplaintsType || "N/A"}
            </p>
            <p>
              <strong>Complaint Status:</strong>{" "}
              {complaint.ComplaintsStatus || "N/A"}
            </p>
            <p>
              <strong>Mobile No:</strong> {complaint.MobileNo || "N/A"}
            </p>
            <p>
              <strong>Description:</strong> {complaint.Description || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {complaint.Location || "N/A"}
            </p>
            <p>
              <strong>Zone:</strong> {complaint.zone || "N/A"}
            </p>
            <p>
              <strong>Locality:</strong> {complaint.locality || "N/A"}
            </p>
            <p>
              <strong>Colony:</strong> {complaint.Colony || "N/A"}
            </p>
            <p>
              <strong>Created By:</strong> {complaint.CreatedBy || "N/A"}
            </p>
            <p>
              <strong>Created Date:</strong>{" "}
              {formatDate(complaint.CreatedDate) || "N/A"}
            </p>

            {complaint.document && (
              <p>
                <strong>Document:</strong>{" "}
                <a
                  href={complaint.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="doc-link"
                >
                  Download Document
                </a>
              </p>
            )}

            {complaint.photo && (
              <>
                <p>
                  <strong>Photo:</strong>
                </p>
                <img src={complaint.photo} alt="Complaint" className="photo" />
              </>
            )}
          </div>

          <div className="action-buttons">
            <button
              className="action-btn reply-btn"
              onClick={() =>
                navigate(`/ReplyPage`, {
                  state: { complaintID: complaint.ComplaintID },
                })
              }
            >
              Reply
            </button>

            

            <button
              className="action-btn back-btn"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ComplainDetailsPage;