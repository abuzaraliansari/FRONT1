import React, { useState } from "react";
import axios from "axios";
import "../App.css";

const TaxSurvey = () => {
  const [userId, setUserId] = useState("");
  const [taxSurveyData, setTaxSurveyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTaxSurveyData = async () => {
    if (!userId) {
      setError("UserID must be provided");
      return;
    }

    setLoading(true);
    setError("");
    setTaxSurveyData(null);

    try {
      const response = await axios.post(
        "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getTaxSurveyByUserId",
        { userId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 204) {
        setError("No tax survey data found for the given UserID.");
      } else if (response.data.success) {
        setTaxSurveyData(response.data.taxSurveyData);
      } else {
        setError(response.data.message || "Failed to fetch tax survey data.");
      }
    } catch (err) {
      setError("Failed to fetch tax survey data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tax-survey-container">
      <h1>Tax Survey Data</h1>

      {/* Input Section */}
      <div className="input-section">
        <label htmlFor="userId" className="input-label">
          Enter UserID:
        </label>
        <input
          type="number"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="input-field"
          placeholder="Enter UserID"
        />
        <button onClick={fetchTaxSurveyData} className="fetch-button" disabled={loading}>
          {loading ? "Fetching..." : "Fetch Tax Data"}
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Tax Survey Data */}
      {taxSurveyData && (
        <div className="tax-survey-data">
          <h2>Survey Data for UserID: {userId}</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Sno</th>
                <th>Tax Amount</th>
                <th>Tax Calculated Date</th>
                <th>Tax Pending</th>
                <th>Paid Status</th>
                <th>Tax Paid Amount</th>
                <th>Tax Paid Date</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {taxSurveyData.map((item, index) => (
                <tr key={index}>
                  <td>{item.Sno}</td>
                  <td>₹{item.TaxAmount || 0}</td>
                  <td>{item.TaxCalculatedDate || "N/A"}</td>
                  <td>₹{item.TaxPending || 0}</td>
                  <td>{item.PaidStatus ? "Paid" : "Pending"}</td>
                  <td>₹{item.TaxPaidAmount || 0}</td>
                  <td>{item.TaxPaidDate || "N/A"}</td>
                  <td>{item.Remark || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaxSurvey;