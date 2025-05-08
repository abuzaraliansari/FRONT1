import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Header, Footer } from "./HeaderFooter";
import Navbar from "./navbar";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRole, setSearchRole] = useState(""); // New state for role search
  const [searchActive, setSearchActive] = useState(""); // New state for active status search
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // Default limit
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = useCallback(
    async (
      pageNum,
      reset = false,
      query = "",
      role = "",
      active = "",
      currentUsers = [],
      fetchLimit = limit
    ) => {
      setLoading(true);
      setError("");

      try {
        const isMobileSearch = /^\d+$/.test(query);
        const response = await axios.post(
          "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getAllUsersWithRoleslimit",
          {
            mobileNumber: isMobileSearch ? query : null,
            role: role || null,
            isActive: active !== "" ? active === "true" : null,
            limit: fetchLimit * pageNum,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          let fetchedUsers = response.data.users;

          if (query && !isMobileSearch) {
            const lowerQuery = query.toLowerCase();
            fetchedUsers = fetchedUsers.filter((user) =>
              user.username?.toLowerCase().includes(lowerQuery)
            );
          }

          if (role) {
            fetchedUsers = fetchedUsers.filter((user) =>
              user.roles.includes(role)
            );
          }

          if (active !== "") {
            const isActive = active === "true";
            fetchedUsers = fetchedUsers.filter(
              (user) => user.isActive === isActive
            );
          }

          fetchedUsers.sort((a, b) => a.username.localeCompare(b.username));

          if (reset) {
            setUsers(fetchedUsers);
          } else {
            const newUsers = [
              ...currentUsers,
              ...fetchedUsers.slice(currentUsers.length),
            ];
            newUsers.sort((a, b) => a.username.localeCompare(b.username));
            setUsers(newUsers);
          }

          setHasMore(fetchedUsers.length === fetchLimit * pageNum);
        } else {
          setError(response.data.message || "No users found");
          setHasMore(false);
        }
      } catch (err) {
        setError("Failed to fetch users. Please try again.");
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchUsers(1, true, "", "", "", []);
  }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(1, true, searchQuery, searchRole, searchActive, []);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(
      nextPage,
      false,
      searchQuery,
      searchRole,
      searchActive,
      users,
      limit
    );
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit); // Update the limit
    setPage(1); // Reset to the first page
    fetchUsers(1, true, searchQuery, searchRole, searchActive, [], newLimit); // Fetch users with the new limit
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
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Admin</th>
                  <th>Active</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userID}>
                    <td>{user.username}</td>
                    <td>
                      {`${(user.firstName || "").trim()} ${(
                        user.middleName || ""
                      ).trim()} ${(user.lastName || "").trim()}`.trim()}
                    </td>
                    <td>{user.mobileNumber}</td>
                    <td>{user.emailID || "N/A"}</td>
                    <td>{user.roles.join(", ") || "No roles"}</td>
                    <td>{user.isAdmin ? "Yes" : "No"}</td>
                    <td>{user.isActive ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(user.mobileNumber)}
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
          {!loading && hasMore && (
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
            {[3, 5, 10, 15, 20, 100,200,400].map((value) => (
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
