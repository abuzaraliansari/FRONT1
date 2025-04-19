import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Header, Footer } from "./HeaderFooter";
import Navbar from "./navbar";
import "../App.css";

const ComplainDetails = () => {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const today = new Date();
  const defaultStartDate =
    new Date(today.setDate(today.getDate() - 30)).toISOString().split("T")[0] +
    "T04:12:19.180Z";
  const defaultEndDate =
    new Date().toISOString().split("T")[0] + "T04:12:19.180Z";
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [filterMobileNumber, setFilterMobileNumber] = useState("");
  const [limit, setLimit] = useState(3);
  const [tempLimit, setTempLimit] = useState(3);
  const [page, setPage] = useState(1);
  const [hasMoreComplaints, setHasMoreComplaints] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  const fetchComplaints = useCallback(
    async (pageNum, reset = false) => {
      console.log("fetchComplaints called, page:", pageNum, "reset:", reset);
      setLoading(true);
      setError("");
      const controller = new AbortController();
      try {
        const requestBody = {
          mobileNumber: authData.user.isAdmin
            ? filterMobileNumber
            : authData.user.mobileNumber,
          createdBy: authData.user.username,
          isAdmin: authData.user.isAdmin || false,
          startDate,
          endDate,
          complaintType: selectedType,
          complaintStatus: selectedStatus,
          complaintID: "",
          limit: limit * pageNum,
        };

        const response = await fetch(
          "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complainlimit",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authData.token}`,
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected API response format");
        }

        const sortedComplaints = data.sort(
          (a, b) => new Date(a.CreatedDate) - new Date(b.CreatedDate)
        );

        if (reset) {
          setComplaints(sortedComplaints);
        } else {
          setComplaints((prevComplaints) => {
            const newComplaints = sortedComplaints.slice(prevComplaints.length);
            return [...prevComplaints, ...newComplaints];
          });
        }

        setHasMoreComplaints(sortedComplaints.length === limit * pageNum);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
          return;
        }
        console.error("Error fetching complaints:", error);
        setError(`Failed to fetch complaints: ${error.message}`);
        setHasMoreComplaints(false);
      } finally {
        setLoading(false);
      }
      return () => controller.abort();
    },
    [
      authData,
      startDate,
      endDate,
      selectedType,
      selectedStatus,
      filterMobileNumber,
      limit,
    ]
  );

  useEffect(() => {
    const controller = new AbortController();
    const initialFetch = async () => {
      setLoading(true);
      setError("");
      try {
        const requestBody = {
          mobileNumber: authData.user.isAdmin ? "" : authData.user.mobileNumber,
          createdBy: authData.user.username,
          isAdmin: authData.user.isAdmin || false,
          startDate: defaultStartDate,
          endDate: defaultEndDate,
          complaintType: "",
          complaintStatus: "Open",
          complaintID: "",
          limit,
        };

        const response = await fetch(
          "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complainlimit",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authData.token}`,
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected API response format");
        }

        const sortedComplaints = data.sort(
          (a, b) => new Date(a.CreatedDate) - new Date(b.CreatedDate)
        );

        setComplaints(sortedComplaints);
        setHasMoreComplaints(sortedComplaints.length === limit);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Initial fetch aborted");
          return;
        }
        console.error("Error fetching initial complaints:", error);
        setError(`Failed to fetch complaints: ${error.message}`);
        setHasMoreComplaints(false);
      } finally {
        setLoading(false);
      }
    };

    initialFetch();
    return () => controller.abort();
  }, [authData, defaultStartDate, defaultEndDate, limit]);

  const handleSearch = useCallback(() => {
    console.log("Search button clicked");
    setComplaints([]);
    setPage(1);
    fetchComplaints(1, true);
  }, [fetchComplaints]);

  const handlePreviousPage = () => {
    if (page > 1) {
      const previousPage = page - 1;
      setPage(previousPage);
      fetchComplaints(previousPage, true);
    }
  };

  const handleLimitChange = (newLimit) => {
    if (newLimit >= 1) {
      setTempLimit(newLimit);
      setLimit(newLimit);
      setComplaints([]);
      setPage(1);
      fetchComplaints(1, true);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComplaints(nextPage, false);
  };

  return (
    <div>
      <Header />
      <Navbar />
      <div className="complaints-list">
        <h2>Complaint Details</h2>
        <div className="filters-row">
          <div>
            <label className="text-label">Start Date:</label>
            <input
              type="date"
              value={startDate.split("T")[0]}
              onChange={(e) => setStartDate(e.target.value + "T04:12:19.180Z")}
              className="date-input"
            />
          </div>
          <div>
            <label className="text-label">End Date:</label>
            <input
              type="date"
              value={endDate.split("T")[0]}
              onChange={(e) => setEndDate(e.target.value + "T04:12:19.180Z")}
              className="date-input"
            />
          </div>
          <div>
            <label className="text-label">Complaint Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="select-box"
            >
              <option value="">All</option>
              <option value="electricity">Electricity</option>
              <option value="water">Water</option>
              <option value="road">Road</option>
              <option value="waste">Waste</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-label">Complaint Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="select-box"
            >
              <option value="">All</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="mobile-number-search">
            <label className="text-label">Mobile Number:</label>
            <input
              type="text"
              value={filterMobileNumber}
              onChange={(e) => setFilterMobileNumber(e.target.value)}
              placeholder="Enter Mobile No."
              className="text-input"
            />
            <button
              className="search-button"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        <div className="complaint-card-container">
          {loading && complaints.length === 0 && (
            <div className="loading">Loading complaints...</div>
          )}
          {loading && complaints.length > 0 && (
            <div className="loading">Loading more complaints...</div>
          )}
          {error && <div className="error">{error}</div>}
          {!loading && complaints.length > 0 ? (
            complaints.map((complaint) => (
              <div key={complaint.ComplaintID} className="complaint-card">
                <p>
                  <strong>Registration No:</strong>{" "}
                  <button
                    className="navigate-btn"
                    onClick={() =>
                      navigate(`/ComplainDetailsPage/${complaint.ComplaintID}`, {
                        state: complaint,
                      })
                    }
                  >
                    {complaint.ComplaintRegistrationNo}
                  </button>
                </p>
                <p>
                  <strong>Type:</strong> {complaint.ComplaintsType}
                </p>
                <p>
                  <strong>Status:</strong> {complaint.ComplaintsStatus}
                </p>
                <p>
                  <strong>Mobile No:</strong> {complaint.MobileNo}
                </p>
                <p>
                  <strong>Created Date:</strong> {formatDate(complaint.CreatedDate)}
                </p>
                <p>
                  <strong>Zone:</strong> {complaint.zone}
                </p>
                <p>
                  <strong>Locality:</strong> {complaint.locality}
                </p>
              </div>
            ))
          ) : !loading && complaints.length === 0 ? (
            <p>No complaints found for the selected filters.</p>
          ) : null}
        </div>

        <div className="pagination-controls">
          <div className="pagination-buttons">
            <button
              className="previous-button"
              onClick={handlePreviousPage}
              disabled={loading || page === 1}
            >
              Previous Page
            </button>
            <p>
              Page: <strong>{page}</strong>
            </p>
            <div className="limit-section">
              <label htmlFor="limit-input">Set Limit:</label>
              <input
                id="limit-input"
                type="number"
                value={tempLimit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="limit-input"
                min="1"
                disabled={loading}
              />
            </div>
            {!loading && hasMoreComplaints && (
              <button
                className="more-button"
                onClick={handleLoadMore}
                disabled={loading}
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ComplainDetails;