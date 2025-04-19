import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header, Footer } from "./HeaderFooter"; // Import Header and Footer
import "../App.css";
import Navbar from "./navbar";

const ComplainDetailsPage = () => {
  const location = useLocation(); // Access the state passed via navigate
  const navigate = useNavigate();
  const complaint = location.state; // Extract complaint from state

  // Debugging logs
  console.log("Location State:", location.state); // Log the entire location state
  console.log("Complaint Details:", complaint); // Log the complaint details

  // Check if complaint is available
  if (!complaint) {
    console.error("No complaint data received."); // Log an error if no data is received
    return <div className="loading">No complaint details available.</div>;
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <Header /> {/* Add Header */}
      <Navbar /> {/* Add Navbar */}
      <div className="complaint-details-container">
        <div className="complaint-details">
          <h2>Complaint Details</h2>

          <div className="details-info">
            <p><strong>Complaint ID:</strong> {complaint.ComplaintID || "N/A"}</p>
            <p><strong>Registration No:</strong> {complaint.ComplaintRegistrationNo || "N/A"}</p>
            <p><strong>User ID:</strong> {complaint.UserID || "N/A"}</p>
            <p><strong>Complaint Type:</strong> {complaint.ComplaintsType || "N/A"}</p>
            <p><strong>Complaint Status:</strong> {complaint.ComplaintsStatus || "N/A"}</p>
            <p><strong>Mobile No:</strong> {complaint.MobileNo || "N/A"}</p>
            <p><strong>Description:</strong> {complaint.Description || "N/A"}</p>
            <p><strong>Location:</strong> {complaint.Location || "N/A"}</p>
            <p><strong>Created By:</strong> {complaint.CreatedBy || "N/A"}</p>
            <p><strong>Created Date:</strong> {formatDate(complaint.CreatedDate) || "N/A"}</p>

            {/* Optional fields */}
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
                <p><strong>Photo:</strong></p>
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
            <button className="action-btn back-btn" onClick={() => navigate(-1)}>Back</button>
          </div>
        </div>
      </div>
      <Footer /> {/* Add Footer */}
    </div>
  );
};

export default ComplainDetailsPage;