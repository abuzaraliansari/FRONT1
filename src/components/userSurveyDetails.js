import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Header, Footer } from "./HeaderFooter";
import Navbar from "./navbar";
import { AuthContext } from "../contexts/AuthContext";

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
  const { authData } = useContext(AuthContext);

  // Check if user is a normal user (roles: ['User'])
  const isNormalUser =
    authData &&
    Array.isArray(authData.user?.roles) &&
    authData.user.roles.length === 1 &&
    authData.user.roles[0] === "User";
  const userMobile = authData?.user?.mobileNumber || "9412564275";

  // Fetch users for normal user
  useEffect(() => {
    if (isNormalUser) {
      setLoading(true);
      setError("");
      axios
        .post(
          "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getAllUsersWithRoleslimit",
          {
            mobileNumber: userMobile,
            limit,
            offset: 0,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((response) => {
          if (response.data.success) {
            setUsers(response.data.users);
            setOffset(limit);
          } else {
            setError(response.data.message || "No users found");
          }
        })
        .catch(() => setError("Failed to fetch users. Please try again."))
        .finally(() => setLoading(false));
    }
  }, [isNormalUser, userMobile, limit]);

  const fetchUsers = useCallback(
    async (reset = false) => {
      if (isNormalUser) return; // Don't run for normal user
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
    [searchQuery, searchRole, searchActive, limit, offset, isNormalUser]
  );

  // Separate API call for the initial load (admin only)
  useEffect(() => {
    if (isNormalUser) return;
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
  }, [isNormalUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (isNormalUser) return;
    if (searchQuery && searchQuery.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    fetchUsers(true);
  };

  const handleLoadMore = () => {
    if (isNormalUser) return;
    const newLimit = limit + 3;
    setLimit(newLimit);
    fetchUsers(true);
  };

  const handleLimitChange = (newLimit) => {
    if (isNormalUser) return;
    setLimit(newLimit);
    fetchUsers(true);
  };

  const handleEdit = (mobileNumber) => {
    navigate("/SurveyData", {
      state: { mobileNumber },
    });
  };

  // Filter users in UI for normal user (roles: ['User'])
  const filteredUsers = isNormalUser
    ? users.filter(
        (u) =>
          u.MobileNo === userMobile ||
          u.mobileNumber === userMobile ||
          u.mobileNo === userMobile
      )
    : users;

  return (
    <div>
      <Header />
      <Navbar />
      <div className="users-list-container">
        <h1>Users Details</h1>
        {/* Search Section (hide for normal user) */}
        {!isNormalUser && (
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
        )}
        {/* Error Message */}
        {error && <div className="error">{error}</div>}
        {/* Users Table */}
        {!loading && filteredUsers.length > 0 && (
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
                {filteredUsers.map((user) => (
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
        {!loading && filteredUsers.length === 0 && !error && (
          <div className="no-results">No users found</div>
        )}
        {/* Pagination Controls (hide for normal user) */}
        {!isNormalUser && (
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
        )}
        {/* Set Limit Dropdown (hide for normal user) */}
        {!isNormalUser && (
          <div className="set-limit">
            <label className="set-limit-label">Set Limit:</label>
            <select
              value={limit}
              onChange={async (e) => {
                const newLimit = parseInt(e.target.value);
                setLimit(newLimit);
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
                      limit: newLimit,
                      offset: 0,
                    },
                    {
                      headers: { "Content-Type": "application/json" },
                    }
                  );
                  if (response.data.success) {
                    setUsers(response.data.users);
                    setOffset(newLimit);
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
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UsersList;