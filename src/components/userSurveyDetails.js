import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Header, Footer } from "./HeaderFooter";
import Navbar from "./navbar";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchActive, setSearchActive] = useState(""); // Empty string means no filter
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(2); // Default limit to 10
  const [offset, setOffset] = useState(0); // Default offset to 0
  const navigate = useNavigate();

  const fetchUsers = useCallback(
    async (reset = false) => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.post(
          "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getAllUsersWithRoleslimit",
          {
            mobileNumber: searchQuery || null,
            username: null,
            role: searchRole || null,
            isActive: searchActive !== "" ? searchActive === "true" : null,
            limit,
            offset: reset ? 0 : offset,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          const fetchedUsers = response.data.users;

          if (reset) {
            setUsers(fetchedUsers); // Reset the user list
            setOffset(limit); // Reset the offset
          } else {
            setUsers((prevUsers) => [...prevUsers, ...fetchedUsers]); // Append new users
            setOffset((prevOffset) => prevOffset + limit); // Increment the offset
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
    [searchQuery, searchRole, searchActive, limit, offset]
  );

  // Separate API call for the initial load
  useEffect(() => {
    const fetchInitialUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.post(
          "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getAllUsersWithRoleslimit",
          {
            limit: 3,
            offset: 0,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          setUsers(response.data.users); // Set the initial user list
          setOffset(5); // Set the offset to match the initial limit
        } else {
          setError(response.data.message || "No users found");
        }
      } catch (err) {
        setError("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    // Ensure the mobile number is fully entered before making the API call
    if (searchQuery && searchQuery.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError(""); // Clear any previous error
    fetchUsers(true); // Fetch users with filters and reset the data
  };

  const handleLoadMore = () => {
    const newLimit = limit + 3; // Increment the limit by 3
    setLimit(newLimit);
    fetchUsers(true); // Fetch users with the new limit and reset the data
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    fetchUsers(true); // Fetch users with the new limit and reset the data
  };

  const handleEdit = (mobileNumber) => {
    navigate("/SurveyData", {
      state: { mobileNumber },
    });
  };

  return (
    <div>
      <Header />
      <Navbar />
      <div className="users-list-container">
        <h1>Users Details</h1>

        {/* Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Enter Mobile Number"
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

        {/* Error Message */}
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
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Admin</th>
                  <th>Active</th>
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
                    <td>{user.EmailID || "N/A"}</td>
                    <td>{user.RoleName || "No roles"}</td>
                    <td>{user.IsAdmin ? "Yes" : "No"}</td>
                    <td>{user.IsActive ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(user.MobileNo)}
                        disabled={loading}
                      >
                        Edit
                      </button>
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
    onChange={async (e) => {
      const newLimit = parseInt(e.target.value);
      setLimit(newLimit); // Update the limit state

      // Call the API with the new limit to fetch data
      setLoading(true);
      setError("");

      try {
        const response = await axios.post(
          "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getAllUsersWithRoleslimit",
          {
            limit: newLimit,
            offset: 0, // Reset offset to 0 for new limit
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          setUsers(response.data.users); // Update the user list with the new data
          setOffset(newLimit); // Update the offset to match the new limit
        } else {
          setError(response.data.message || "No users found");
        }
      } catch (err) {
        setError("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    }}
    className="limit-dropdown"
  >
    {[2, 3, 20, 50, 100].map((value) => (
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

export default UsersList;