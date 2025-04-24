import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header, Footer } from "./HeaderFooter";
import Navbar from "./navbar";
import { AuthContext } from "../contexts/AuthContext";
import "../App.css";

const ReplyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { complaintID, complaintStatus } = location.state || {}; // Use complaintID and complaintStatus from navigation state
  const { authData } = useContext(AuthContext);
  const isAdmin = authData?.user?.roles?.includes("Admin") || false; // Check if the user is an admin
  const [replies, setReplies] = useState([]);
  const [replyDescription, setReplyDescription] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [currentStatus, setCurrentStatus] = useState(complaintStatus); // Track the current status of the complaint

  const fetchReplies = useCallback(async () => {
    if (!complaintID) {
      alert("Complaint ID is missing");
      return;
    }

    try {
      const response = await fetch(
        "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complaintsreplies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
          body: JSON.stringify({ complaintno: complaintID }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `API Error: ${response.status} ${response.statusText} - ${text}`
        );
      }

      const data = await response.json();
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch replies");
      }

      setReplies(data);
      console.log("Fetched replies:", data);
    } catch (error) {
      console.error("Error fetching replies:", error);
      alert(`Failed to fetch replies: ${error.message}`);
    }
  }, [complaintID, authData.token]);

  const fetchIpAddress = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      setIpAddress(data.ip);
    } catch (error) {
      console.error("Error fetching IP address:", error);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyDescription.trim()) {
      alert("Reply description cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complaintsreply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
          body: JSON.stringify({
            complaintno: complaintID,
            replyDescription,
            isAdmin,
            ipAddress,
            userDetails: {
              username: authData.user.username,
            },
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `API Error: ${response.status} ${response.statusText} - ${text}`
        );
      }

      const data = await response.json();
      if (data.success === false) {
        throw new Error(data.message || "Failed to submit reply");
      }

      setReplyDescription("");
      fetchReplies();
      alert("Reply submitted successfully");
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert(`Failed to submit reply: ${error.message}`);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      console.log("Received complaintno:", complaintID);
      console.log("Received status:", status);
      console.log("Received modifiedBy:", authData.user.username);

      const response = await fetch(
        "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complaintsstatus",
        {
          method: "POST", // Use POST as per the provided API
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
          body: JSON.stringify({
            complaintno: complaintID,
            status,
            modifiedBy: authData.user.username,
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `API Error: ${response.status} ${response.statusText} - ${text}`
        );
      }

      const data = await response.json();
      if (data.success === false) {
        throw new Error(
          data.message || `Failed to ${status.toLowerCase()} complaint`
        );
      }

      setCurrentStatus(status); // Update the current status
      alert(`Complaint ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error(`Error updating complaint status to ${status}:`, error);
      alert(`Failed to ${status.toLowerCase()} complaint: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchReplies();
    fetchIpAddress();
  }, [fetchReplies]);

  return (
    <div>
      <Header />
      <Navbar />
      <div className="reply-page-container">
        <h2>Complaint Replies</h2>
        <div className="replies-container">
          {replies.length > 0 ? (
            replies.map((reply, index) => (
              <div
                key={index}
                className={`reply-card ${
                  reply.IsAdmin ? "admin-reply" : "user-reply"
                }`}
              >
                <p className="reply-text">{reply.ReplyDescription}</p>
                <p className="reply-meta">
                  <strong>By:</strong> {reply.ReplyBy} |{" "}
                  {new Date(reply.ReplyDate).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>No replies found for this complaint.</p>
          )}
        </div>
        <div className="reply-input-container">
          <textarea
            className="reply-input"
            value={replyDescription}
            onChange={(e) => setReplyDescription(e.target.value)}
            placeholder="Type your reply..."
          />
          <div className="allButtons">
            <button className="reply-button" onClick={handleReplySubmit}>
              Submit Reply
            </button>
            {authData?.user?.roles?.includes("Admin") && currentStatus === "Open" && (
    <button
      className="close-button"
      onClick={() => handleUpdateStatus("Closed")}
    >
      Close Complaint
    </button>
  )}
  {authData?.user?.roles?.includes("Admin") && currentStatus === "Closed" && (
    <button
      className="reopen-button"
      onClick={() => handleUpdateStatus("Open")}
    >
      Reopen Complaint
    </button>
  )}
            <button className="back-button" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReplyPage;
