import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Header, Footer } from "./HeaderFooter";
import Navbar from "./navbar";

const Payment = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchActive, setSearchActive] = useState(""); // Empty string means no filter
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(3); // Start with a default limit of 3
  const [calculatingTax, setCalculatingTax] = useState(null); // Track which user's tax is being calculated
  const navigate = useNavigate();

  const fetchUsers = useCallback(
    async (reset = false, newLimit = limit) => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.post(
          "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getAllUsersWithRoleslimit",
          {
            mobileNumber: searchQuery || null,
            username: searchQuery || null,
            role: searchRole || null,
            isActive: searchActive !== "" ? searchActive === "true" : null,
            limit: newLimit,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          const fetchedUsers = response.data.users.map((user) => {
            // Calculate Pending Tax
            const taxAmount = user.TaxAmount || 0;
            const taxPaidAmount = user.TaxPaidAmount || 0;
            const taxPending = user.TaxPending !== null ? user.TaxPending : taxAmount - taxPaidAmount;

            // Calculate Late Fee (15% of Pending Tax)
            const lateFee = (taxPending * 0.15).toFixed(2);

            // Calculate Total Amount
            const totalAmount = (taxPending + parseFloat(lateFee)).toFixed(2);

            return {
              ...user,
              pendingTax: taxPending || 0,
              discount: 100, // Default discount
              lateFee: parseFloat(lateFee), // Late fee auto-calculated
              totalAmount: parseFloat(totalAmount),
              showPayTax: false, // Initially hide the Pay Tax button
            };
          });

          if (reset) {
            setUsers(fetchedUsers); // Reset the user list
          } else {
            setUsers((prevUsers) => [...prevUsers, ...fetchedUsers]); // Append new users
          }
        } else {
          setError(response.data.message || "No users found");
        }
      } catch (err) { 
        setError("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, searchRole, searchActive, limit]
  );

  useEffect(() => {
    fetchUsers(true); // Fetch users on initial load
  }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLimit(3); // Reset the limit to the default value
    fetchUsers(true, 3); // Fetch users with filters and reset the data
  };

  const handleLoadMore = () => {
    const newLimit = limit + 3; // Increment the limit by 3
    setLimit(newLimit);
    fetchUsers(true, newLimit); // Refresh the data with the new limit
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    fetchUsers(true, newLimit); // Fetch users with the new limit and reset the data
  };

  const handleCalculateTax = (userId) => {
    setCalculatingTax(userId); // Disable the action column for this user
    setTimeout(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.UserID === userId
            ? { ...user, showPayTax: true } // Show the Pay Tax button
            : user
        )
      );
      setCalculatingTax(null); // Re-enable the action column
    }, 2000); // Simulate tax calculation delay
  };

  const handlePayTax = (user) => {
    navigate("/TaxCalculator", {
      state: { ...user }, // Send all user data to the parameters
    });
  };

  return (
    <div>
      <Header />
      <Navbar />
      <div className="users-list-container">
        <h1>Payment Details</h1>

        {/* Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Enter Mobile Number or Username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              disabled={loading}
            />
            <label htmlFor="role-select" className="search-label">
              Search by Role:
            </label>
            <select
              id="role-select"
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              className="search-select"
              disabled={loading}
            >
              <option value="">All</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            <label htmlFor="active-select" className="search-label">
              Search by Active Status:
            </label>
            <select
              id="active-select"
              value={searchActive}
              onChange={(e) => setSearchActive(e.target.value)}
              className="search-select"
              disabled={loading}
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {/* Status */}
        {loading && <div className="loading">Loading users...</div>}
        {error && <div className="error">{error}</div>}

        {/* Users Table */}
        {!loading && users.length > 0 && (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Mobile Number</th>
                  <th>Pending Tax</th>
                  <th>Discount</th>
                  <th>Late Fee</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.UserID}>
                    <td>{user.Username}</td>
                    <td>
                      {`${(user.FirstName || "").trim()} ${(user.MiddleName || "").trim()} ${(user.LastName || "").trim()}`.trim()}
                    </td>
                    <td>{user.MobileNo}</td>
                    <td>{user.pendingTax}</td>
                    <td>{user.discount}</td>
                    <td>{user.lateFee}</td>
                    <td>
                      {!user.showPayTax ? (
                        <button
                          className="calculate-tax-button"
                          onClick={() => handleCalculateTax(user.UserID)}
                          disabled={calculatingTax === user.UserID}
                        >
                          {calculatingTax === user.UserID ? "Calculating..." : "Calculate Tax"}
                        </button>
                      ) : (
                        <button
                          className="pay-tax-button"
                          onClick={() => handlePayTax(user)}
                        >
                          Pay Tax
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && users.length === 0 && !error && (
          <div className="no-results">No users found</div>
        )}

        {/* Pagination Controls */}
        <div className="pagination-buttons">
          {!loading && (
            <button
              className="more-button"
              onClick={handleLoadMore}
              disabled={loading}
            >
              Load More
            </button>
          )}
        </div>

        <div className="set-limit">
          <label className="set-limit-label">Set Limit:</label>
          <select
            value={limit}
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
            className="limit-dropdown"
          >
            {[3, 5, 10, 15, 20, 100, 200, 400].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;