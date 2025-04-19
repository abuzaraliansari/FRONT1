import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const LocationPage = () => {
  const [ipAddress, setIpAddress] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 5; // Maximum number of retry attempts

  const navigate = useNavigate();

  const fetchIpAddress = useCallback(async () => {
    try {
      console.log("Fetching IP address...");
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      console.log("IP address fetched:", data.ip);
      setIpAddress(data.ip);
    } catch (error) {
      console.error("Error fetching IP address:", error);
    }
  }, []);

  const fetchLocation = useCallback(() => {
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Location fetched:", position.coords);
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        // Check if accuracy is greater than 20 meters and we haven't exceeded max attempts
        if (position.coords.accuracy > 20 && attempts < MAX_ATTEMPTS) {
          setAttempts((prev) => prev + 1);
          setError(
            `Accuracy ${position.coords.accuracy.toFixed(1)}m is too low. Retrying (${
              attempts + 1
            }/${MAX_ATTEMPTS})...`
          );
          setTimeout(fetchLocation, 1000); // Wait 1 second before retrying
        } else {
          setLocation(newLocation);
          setAttempts(0); // Reset attempts on successful fetch
        }
      },
      (error) => {
        console.error("Error fetching location:", error);
        setError(error.message);
      },
      { enableHighAccuracy: true, timeout: 50000, maximumAge: 0 }
    );
  }, [attempts]);

  useEffect(() => {
    if (!ipAddress) fetchIpAddress();
    if (!location && attempts < MAX_ATTEMPTS) fetchLocation();
  }, [ipAddress, location, attempts, fetchIpAddress, fetchLocation]);

  const handleNavigate = () => {
    navigate("/complainSubmit");
  };

  return (
    <div className="location-box">
      <h1>Location Page</h1>
      {ipAddress && <p>IP Address: {ipAddress}</p>}
      {location ? (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Accuracy: {location.accuracy.toFixed(1)} meters</p>
          {location.accuracy > 20 && (
            <p style={{ color: "orange" }}>
              Warning: Accuracy is greater than 20 meters
            </p>
          )}
        </div>
      ) : (
        <p>Fetching location...</p>
      )}
      {error && (
        <div>
          <p style={{ color: "red" }}>Error: {error}</p>
          {attempts >= MAX_ATTEMPTS && <p>Maximum retry attempts reached</p>}
          <button onClick={fetchLocation}>Retry</button>
        </div>
      )}
      <button id="refresh-btn" onClick={fetchLocation}>
        Refresh Location
      </button>
      <button
        onClick={handleNavigate}
        disabled={!location || location.accuracy > 20}
      >
        Submit Location
      </button>
    </div>
  );
};

export default LocationPage;