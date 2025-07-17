import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Header, Footer } from "./HeaderFooter";
import Navbar from "./navbar";
import { AuthContext } from "../contexts/AuthContext";

const Payment = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchActive, setSearchActive] = useState(""); // Empty string means no filter
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(3); // Default limit to 3
  const [calculatingTax, setCalculatingTax] = useState(null); // Track which user's tax is being calculated
  const [showTaxColumns, setShowTaxColumns] = useState(false); // Track visibility of tax columns
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
          } else {
            setError(response.data.message || "No users found");
          }
        })
        .catch(() => setError("Failed to fetch users. Please try again."))
        .finally(() => setLoading(false));
    }
  }, [isNormalUser, userMobile, limit]);

  const fetchUsers = useCallback(
    async (reset = false, newLimit = limit) => {
      if (isNormalUser) return;
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
          const fetchedUsers = response.data.users.map((user) => ({
            ...user,
            pendingTax: "00",
            discount: "00",
            lateFee: "00",
            totalAmount: "00",
            showPayTax: false,
          }));
          if (reset) {
            setUsers(fetchedUsers);
          } else {
            setUsers((prevUsers) => [...prevUsers, ...fetchedUsers]);
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
    [searchQuery, searchRole, searchActive, limit, isNormalUser]
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

  const handleCalculateTax = async (userId) => {
    setCalculatingTax(userId); // Disable the action column for this user
    setError(""); // Clear any previous error

    try {
      // Call the API to fetch tax details
      const response = await axios.post(
        "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getTaxSurveyByUserId", // Correct API URL
        { userId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        const taxData = response.data.taxSurveyData[0]; // Use the first record

        // Calculate pendingTax, discount, and lateFee
        const pendingTax = (taxData.TaxAmount || 0) - (taxData.TaxPaidAmount || 0) + (taxData.ReturnAmount || 0);
        const discount = (pendingTax * 0.1).toFixed(2); // 10% of pendingTax
        const lateFee = taxData.LateTaxFee || 0;

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.UserID === userId
              ? {
                ...user,
                pendingTax: pendingTax.toFixed(2), // Format to 2 decimal places
                discount: discount,
                lateFee: lateFee.toFixed(2),
                totalAmount: (pendingTax - discount + lateFee).toFixed(2), // Calculate total amount
                showPayTax: true, // Show the Pay Tax button
              }
              : user
          )
        );
        setShowTaxColumns(true); // Show the tax columns
      } else {
        // If no data is found, set all columns to "00"
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.UserID === userId
              ? {
                ...user,
                pendingTax: "00",
                discount: "00",
                lateFee: "00",
                totalAmount: "00",
                showPayTax: false, // Do not show the Pay Tax button
              }
              : user
          )
        );
        setError(response.data.message || "No tax survey data found.");
      }
    } catch (err) {
      setError("Failed to fetch tax details. Please try again.");
      console.error("Error fetching tax details:", err.message);

      // Set all columns to "00" in case of an error
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.UserID === userId
            ? {
              ...user,
              pendingTax: "00",
              discount: "00",
              lateFee: "00",
              totalAmount: "00",
              showPayTax: false, // Do not show the Pay Tax button
            }
            : user
        )
      );
    } finally {
      setCalculatingTax(null); // Re-enable the action column
    }
  };


  const handlePayTax = async (user) => {
    try {
      // Fetch additional tax survey data for the user
      const response = await axios.post(
        "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getTaxSurveyByUserId",
        { userId: user.UserID },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (response.data.success) {
        const taxSurveyData = response.data.taxSurveyData;
  
        // Calculate total tax, pending tax, discount, and late fee
        const totalTax = taxSurveyData.reduce((sum, item) => sum + (item.TaxAmount || 0), 0);
        const pendingTax = taxSurveyData.reduce((sum, item) => sum + ((item.TaxAmount || 0) - (item.TaxPaidAmount || 0) + (item.ReturnAmount || 0)), 0);
        const discount = (pendingTax * 0.1).toFixed(2); // 10% of pending tax
        const lateFee = taxSurveyData.reduce((sum, item) => sum + (item.LateTaxFee || 0), 0);
  
        // Print both userData and taxSurveyData in the console
        console.log("User Data:", user);
        console.log("Tax Survey Data:", taxSurveyData);
        console.log("Total Tax:", totalTax);
        console.log("Pending Tax:", pendingTax);
        console.log("Discount:", discount);
        console.log("Late Fee:", lateFee);
  
        // Navigate to the next page with user and tax survey data
        navigate("/TaxCalculator", {
          state: {
            userData: user, // Data from getAllUsersWithRoleslimit
            taxSurveyData: taxSurveyData, // Data from getTaxSurveyByUserId
            totalTax: totalTax.toFixed(2), // Total tax calculated
            pendingTax: pendingTax.toFixed(2), // Total pending tax
            discount: discount, // Discount
            lateFee: lateFee.toFixed(2), // Late fee
          },
        });
      } else {
        setError(response.data.message || "Failed to fetch tax survey data.");
      }
    } catch (err) {
      setError("Failed to fetch tax survey data. Please try again.");
      console.error("Error fetching tax survey data:", err.message);
    }
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
        <h1>Payment Details</h1>
        {/* Search Section (hide for normal user) */}
        {!isNormalUser && (
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
        )}
        {/* Status */}
        {loading && <div className="loading">Loading users...</div>}
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
                  {showTaxColumns && <th>Pending Tax</th>}
                  {showTaxColumns && <th>Discount</th>}
                  {showTaxColumns && <th>Late Fee</th>}
                  {showTaxColumns && <th>Total Amount</th>}
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
                    {showTaxColumns && <td>{user.pendingTax}</td>}
                    {showTaxColumns && <td>{user.discount}</td>}
                    {showTaxColumns && <td>{user.lateFee}</td>}
                    {showTaxColumns && <td>{user.totalAmount}</td>}
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
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Payment;