import React, { useContext, useState } from "react";
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
  const [reason, setReason] = useState("");
  const [complaintStatus, setComplaintStatus] = useState(complaint.ComplaintsStatus); // State for live status update

  const API_URL = "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net";

  if (!complaint) {
    console.error("No complaint data received.");
    return <div className="loading">No complaint details available.</div>;
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleOpenComplaint = async () => {
    const reasonInput = prompt("Please provide a reason for opening the complaint:");
    if (!reasonInput || reasonInput.trim() === "") {
      alert("Reason is required to open the complaint.");
      return;
    }
  
    try {
      console.log("Submitting reason for opening the complaint...");
  
      // Submit the reason to the API
      const replyResponse = await axios.post(`${API_URL}/auth/submitReplyComment`, {
        complaintID: complaint.ComplaintID,
        commentDescription: reasonInput,
        status: "Open",
        createdBy: `${authData.user.firstName} ${authData.user.username}`,
        modifiedBy: `${authData.user.firstName} ${authData.user.username}`,
        isAdmin: authData.user.roles.includes("Admin") ? 1 : 0,
      });
  
      if (!replyResponse.data.success) {
        alert("Failed to submit the reason for opening the complaint.");
        return;
      }
  
      console.log("Updating complaint status to 'Open'...");
  
      // Update the complaint status to "Open"
      const statusResponse = await axios.post(`${API_URL}/auth/complaintsstatusopen`, {
        complaintno: complaint.ComplaintID,
        status: "Open",
        modifiedBy: authData.user.username,
      });
  
      if (statusResponse.data.success) {
        alert("Complaint opened successfully.");
        setComplaintStatus("Open"); // Update the status in the UI
  
        // Navigate to the ReplyPage
        navigate(`/ReplyPage`, {
          state: { 
            complaintID: complaint.ComplaintID,
            complaintStatus: "Open", // Pass the updated status
          },
        });
      } else {
        alert("Failed to open the complaint.");
      }
    } catch (error) {
      console.error("Error opening complaint:", error);
      alert("An error occurred while opening the complaint.");
    }
  };

  const handleReplyNavigation = () => {
    navigate(`/ReplyPage`, {
      state: { 
        complaintID: complaint.ComplaintID,
        complaintStatus: complaintStatus // Pass the live complaint status
      },
    });
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
              <strong>Registration No:</strong> {complaint.ComplaintRegistrationNo || "N/A"}
            </p>
            <p>
              <strong>User ID:</strong> {complaint.UserID || "N/A"}
            </p>
            <p>
              <strong>Complaint Type:</strong> {complaint.ComplaintsType || "N/A"}
            </p>
            <p>
              <strong>Complaint Status:</strong> {complaintStatus || "N/A"} {/* Live status */}
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
              <strong>Created Date:</strong> {formatDate(complaint.CreatedDate) || "N/A"}
            </p>
          </div>

          <div className="action-buttons">
          <button className="action-btn reply-btn" onClick={handleReplyNavigation}>
              Reply
            </button>
            {complaintStatus === "Closed" && (
              <button className="action-btn open-btn" onClick={handleOpenComplaint}>
                Open Complaint
              </button>
            )}
            <button className="action-btn back-btn" onClick={() => navigate(-1)}>
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