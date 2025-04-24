// import React, { useState, useContext, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../contexts/AuthContext";
// import Navbar from "./navbar";
// import { Header, Footer } from "./HeaderFooter";
// import "../App.css";

// const ComplainSubmit = () => {
//   const { authData } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     complaintType: "",
//     description: "",
//     userId: "",
//     mobile: "",
//     email: "",
//     geoLocation: "",
//     document: null,
//     photo: null,
//     ipAddress: "0.0.0.0",
//     zone: "",
//     locality: "",
//     colony: "",
//   });

//   const [localities, setLocalities] = useState([]);
//   const [colonies, setColonies] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [complaintRegistrationNo, setComplaintRegistrationNo] = useState("");
//   const isAdmin = authData?.user?.roles?.includes("Admin") || false;

//   const fetchUserData = async (mobileNumber) => {
//     try {
//       const response = await axios.post(
//         "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getUserByMobile",
//         { mobileNumber },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${authData?.token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         const user = response.data.user;
//         setFormData({
//           userId: user.userID || "",
//           mobile: user.mobileNumber || "",
//           email: user.emailID || "",
//           geoLocation: user.geoLocation || "",
//           zone: user.zoneName || "",
//           locality: user.localityName || "",
//           colony: user.colonyName || "",
//           complaintType: "",
//           description: "",
//           document: null,
//           photo: null,
//           ipAddress: user.ipAddress || "0.0.0.0",
//         });
//       } else {
//         setError("No user found with the provided mobile number.");
//       }
//     } catch (err) {
//       console.error("Error fetching user data:", err);
//       setError("Failed to fetch user data. Please try again.");
//     }
//   };

//   const handleChange = async (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (name === "mobile" && isAdmin && value.length === 10) {
//       fetchUserData(value);
//     }

//     if (name === "zone") {
//       try {
//         const response = await axios.post(
//           "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/Locality",
//           { ZoneID: value }
//         );
//         setLocalities(response.data.locality[0] || []);
//         setFormData((prevData) => ({ ...prevData, locality: "", colony: "" }));
//         setColonies([]);
//       } catch (err) {
//         console.error("Error fetching localities:", err);
//         setError("Failed to fetch localities. Please try again.");
//       }
//     }

//     if (name === "locality") {
//       try {
//         const response = await axios.post(
//           "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/Colony",
//           { LocalityID: value }
//         );
//         setColonies(response.data.locality[0] || []);
//         setFormData((prevData) => ({ ...prevData, colony: "" }));
//       } catch (err) {
//         console.error("Error fetching colonies:", err);
//         setError("Failed to fetch colonies. Please try again.");
//       }
//     }
//   };

//   const handleAddColony = async () => {
//     const newColony = prompt("Enter the name of the new colony:");
//     if (!newColony) return;

//     try {
//       const response = await axios.post(
//         "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/AddColony",
//         {
//           Colony: newColony,
//           LocalityID: formData.locality,
//         }
//       );

//       if (response.data.success) {
//         alert("Colony added successfully!");
//         const coloniesResponse = await axios.post(
//           "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/Colony",
//           { LocalityID: formData.locality }
//         );
//         setColonies(coloniesResponse.data.locality[0] || []);
//       } else {
//         alert("Failed to add colony: " + response.data.message);
//       }
//     } catch (err) {
//       console.error("Error adding colony:", err);
//       alert("Failed to add colony. Please try again.");
//     }
//   };

//   const handleDescriptionChange = (e) => {
//     setFormData({ ...formData, description: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData({ ...formData, [name]: files[0] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setComplaintRegistrationNo("");

//     if (!formData.complaintType || !formData.description) {
//       setError("Please fill in all required fields.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const submitComplaint = {
//         colony: formData.colony,
//         complaintStatus: "Open",
//         complaintType: formData.complaintType,
//         createdBy: authData.user.username || "Anonymous",
//         createdDate: new Date().toISOString(),
//         description: formData.description,
//         ipAddress: formData.ipAddress,
//         isAdmin: isAdmin,
//         locality: formData.locality,
//         localityID: authData.user.localityID || 1,
//         location: formData.geoLocation,
//         mobileNumber: formData.mobile,
//         userID: formData.userId,
//         zone: formData.zone,
//         zoneID: authData.user.zoneID || 1,
//       };

//       const complaintResponse = await axios.post(
//         "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complaints",
//         submitComplaint,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${authData?.token}`,
//           },
//         }
//       );

//       if (complaintResponse.data.success) {
//         const { complaintID, complaintRegistrationNo } = complaintResponse.data;
//         setComplaintRegistrationNo(complaintRegistrationNo);

//         if (formData.document || formData.photo) {
//           const submitFiles = new FormData();
//           if (formData.document)
//             submitFiles.append("attachmentDoc", formData.document);
//           if (formData.photo) submitFiles.append("userImage", formData.photo);
//           submitFiles.append("userID", formData.userId);
//           submitFiles.append("complaintID", complaintID);

//           const fileUploadResponse = await axios.post(
//             "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/submitFiles",
//             submitFiles,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//                 Authorization: `Bearer ${authData?.token}`,
//               },
//             }
//           );

//           if (!fileUploadResponse.data.success) {
//             setError(
//               "Complaint submitted but file upload failed: " +
//                 (fileUploadResponse.data.message || "Unknown error")
//             );
//             setLoading(false);
//             return;
//           }
//         }

//         alert(
//           `Complaint Submitted Successfully! Registration No: ${complaintRegistrationNo}`
//         );
//         navigate("/Home", {
//           state: {
//             userId: formData.userId,
//             complaintRegistrationNo,
//           },
//         });
//       } else {
//         setError(
//           "Failed to submit complaint: " +
//             (complaintResponse.data.message || "Unknown error")
//         );
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       setError(
//         error.response?.data?.message || error.message || "Unexpected error occurred"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="submit-box">
//       <Header />
//       <Navbar />
//       <form onSubmit={handleSubmit} className="submit-form">
//         <h1>Submit Complaint</h1>

//         {error && <div className="error-message">{error}</div>}
//         {complaintRegistrationNo && (
//           <div className="success-message">
//             Complaint Registration No: {complaintRegistrationNo}
//           </div>
//         )}

//         <div className="submit-row grouped-fields">
//           {isAdmin && (
//             <>
//               <div className="submit-group">
//                 <label className="admin-details-label">User ID</label>
//                 <input
//                   type="text"
//                   name="userId"
//                   value={formData.userId || ""}
//                   onChange={handleChange}
//                   readOnly={!isAdmin}
//                   className="admin-details-input"
//                 />
//               </div>
//               <div className="submit-group">
//                 <label className="admin-details-label">Mobile No</label>
//                 <input
//                   type="text"
//                   name="mobile"
//                   value={formData.mobile || ""}
//                   onChange={handleChange}
//                   className="admin-details-input"
//                 />
//               </div>
//               <div className="submit-group">
//                 <label className="admin-details-label">Email ID</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email || ""}
//                   onChange={handleChange}
//                   readOnly={!isAdmin}
//                   className="admin-details-input"
//                 />
//               </div>
//               <div className="submit-group">
//                 <label className="admin-details-label">Location</label>
//                 <input
//                   type="text"
//                   name="geoLocation"
//                   value={formData.geoLocation || ""}
//                   onChange={handleChange}
//                   readOnly={!isAdmin}
//                   className="admin-details-input"
//                 />
//               </div>
          //     <div className="submit-group">
          //       <label className="admin-details-label">Zone</label>
          //       <select
          //         name="zone"
          //         value={formData.zone}
          //         onChange={handleChange}
          //         className="admin-details-input"
          //       >
          //         <option value="">Select Zone</option>
          //         <option value="1">North</option>
          //         <option value="2">South</option>
          //         <option value="3">East</option>
          //         <option value="4">West</option>
          //       </select>
          //     </div>
          //     <div className="submit-group">
          //       <label className="admin-details-label">Locality</label>
          //       <select
          //         name="locality"
          //         value={formData.locality}
          //         onChange={handleChange}
          //         className="admin-details-input"
          //         disabled={!formData.zone}
          //       >
          //         <option value="">Select Locality</option>
          //         {localities.map((locality) => (
          //           <option key={locality.LocalityID} value={locality.LocalityID}>
          //             {locality.Locality}
          //           </option>
          //         ))}
          //       </select>
          //     </div>
          //     <div className="submit-group">
          //       <label className="admin-details-label">Colony</label>
          //       <select
          //         name="colony"
          //         value={formData.colony}
          //         onChange={handleChange}
          //         className="admin-details-input"
          //         disabled={!formData.locality}
          //       >
          //         <option value="">Select Colony</option>
          //         {colonies.map((colony) => (
          //           <option key={colony.ColonyID} value={colony.ColonyID}>
          //             {colony.Colony}
          //           </option>
          //         ))}
          //       </select>
          //     </div>
          //   </>
          // )}
//           <div className="submit-group">
//             <label>Complaint Type</label>
//             <select
//               name="complaintType"
//               value={formData.complaintType}
//               onChange={handleChange}
//               required
//               className="submit-select"
//             >
//               <option value="">Select Complaint Type</option>
//               <option value="water">Water</option>
//               <option value="electricity">Electricity</option>
//               <option value="road">Road</option>
//               <option value="garbage">Garbage</option>
//               <option value="other">Other</option>
//             </select>
//           </div>
//         </div>

//         <div className="submit-row upload-description">
//           <div className="upload-fields">
//             <div className="submit-group">
//               <label>Upload Document</label>
//               <input
//                 type="file"
//                 name="document"
//                 accept=".pdf,.doc,.docx"
//                 onChange={handleFileChange}
//                 className="submit-file"
//               />
//             </div>
//             <div className="submit-group">
//               <label>Upload Photo</label>
//               <input
//                 type="file"
//                 name="photo"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="submit-file"
//               />
//             </div>
//           </div>
//           <div className="description-box">
//             <label>Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleDescriptionChange}
//               placeholder="Enter your complaint description"
//               required
//               className="submit-textarea"
//               rows="10"
//             />
//           </div>
//         </div>

//         <button type="submit" className="submit-btn" disabled={loading}>
//           {loading ? "Submitting..." : "Submit Complaint"}
//         </button>
//       </form>
//       <Footer />
//     </div>
//   );
// };

// export default ComplainSubmit;  









// import React, { useState, useEffect, useContext, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../contexts/AuthContext";
// import { Header, Footer } from "./HeaderFooter";
// import Navbar from "./navbar";
// import "../App.css";

// const ComplainDetails = () => {
//   const { authData } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [complaints, setComplaints] = useState([]);
//   const today = new Date();

//   const defaultEndDate =
//     new Date(today.setDate(today.getDate() + 1)).toISOString().split("T")[0] +
//     "T04:12:19.180Z";
//   const defaultStartDate =
//     new Date(today.setDate(today.getDate() - 30)).toISOString().split("T")[0] +
//     "T04:12:19.180Z";
//   const [startDate, setStartDate] = useState(defaultStartDate);
//   const [endDate, setEndDate] = useState(defaultEndDate);
//   const [selectedType, setSelectedType] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [filterMobileNumber, setFilterMobileNumber] = useState(""); // Default to no number for admin
//   const [limit, setLimit] = useState("4"); // Default limit
//   const [page, setPage] = useState(1);
//   const [hasMoreComplaints, setHasMoreComplaints] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
//     } catch {
//       return "Invalid Date";
//     }
//   };
//   const fetchComplaints = useCallback(
//     async (pageNum, reset = false) => {
//       setLoading(true);
//       setError("");
//       const controller = new AbortController();
//       try {
//         const isAdmin = authData.user.roles.includes("Admin"); // Check if the user is an admin
//         const requestBody = {
//           mobileNumber: isAdmin ? filterMobileNumber : authData.user.mobileNumber, // Use filterMobileNumber for admin
//           createdBy: isAdmin ? "" : authData.user.username, // Admin doesn't filter by username
//           isAdmin,
//           startDate,
//           endDate,
//           complaintType: selectedType || "", // Filter by complaint type if provided
//           complaintStatus: selectedStatus === "All" ? "" : selectedStatus, // Filter by complaint status if provided
//           zone: "",
//           locality: "",
//           complaintID: "",
//           limit: limit * pageNum,
//         };
  
//         const response = await fetch(
//           "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complainlimit",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${authData.token}`,
//             },
//             body: JSON.stringify(requestBody),
//             signal: controller.signal,
//           }
//         );
  
//         if (!response.ok) {
//           throw new Error(`API Error: ${response.status} ${response.statusText}`);
//         }
  
//         const data = await response.json();
//         if (!Array.isArray(data)) {
//           throw new Error("Unexpected API response format");
//         }
  
//         const sortedComplaints = data.sort(
//           (a, b) => new Date(a.CreatedDate) - new Date(b.CreatedDate)
//         );
  
//         if (reset) {
//           setComplaints(sortedComplaints);
//         } else {
//           setComplaints((prevComplaints) => [
//             ...prevComplaints,
//             ...sortedComplaints.slice(prevComplaints.length),
//           ]);
//         }
  
//         setHasMoreComplaints(sortedComplaints.length === limit * pageNum);
//       } catch (error) {
//         if (error.name === "AbortError") {
//           console.log("Fetch aborted");
//           return;
//         }
//         console.error("Error fetching complaints:", error);
//         setError(`Failed to fetch complaints: ${error.message}`);
//         setHasMoreComplaints(false);
//       } finally {
//         setLoading(false);
//       }
//       return () => controller.abort();
//     },
//     [
//       authData,
//       startDate,
//       endDate,
//       selectedType,
//       selectedStatus,
//       filterMobileNumber, // Include filterMobileNumber as a dependency
//       limit,
//     ]
//   );
//   useEffect(() => {
//     fetchComplaints(1, true);
//   }, [fetchComplaints]);

//   const handleSearch = useCallback(() => {
//     setComplaints([]); // Clear existing complaints
//     setPage(1); // Reset to the first page
//     fetchComplaints(1, true); // Fetch complaints with the current filters
//   }, [fetchComplaints, filterMobileNumber]); // Include filterMobileNumber as a dependency

//   const handlePreviousPage = () => {
//     if (page > 1) {
//       const previousPage = page - 1;
//       setPage(previousPage);
//       fetchComplaints(previousPage, true);
//     }
//   };

//   const handleNextPage = () => {
//     const nextPage = page + 1;
//     setPage(nextPage);
//     fetchComplaints(nextPage, false); // Load more instead of resetting
//   };

//   const handleLimitChange = (newLimit) => {
//     setLimit(newLimit);
//     setPage(1);
//     fetchComplaints(1, true);
//   };

//   return (
//     <div>
//       <Header />
//       <Navbar />

//       <div className="complaints-list">
//         <h2>Complaint Details</h2>
//         <div className="filters-row">
//           <div>
//             <label className="text-label">Start Date:</label>
//             <input
//               type="date"
//               value={startDate.split("T")[0]}
//               onChange={(e) => setStartDate(e.target.value + "T04:12:19.180Z")}
//               className="date-input"
//             />
//           </div>
//           <div>
//             <label className="text-label">End Date:</label>
//             <input
//               type="date"
//               value={endDate.split("T")[0]}
//               onChange={(e) => setEndDate(e.target.value + "T04:12:19.180Z")}
//               className="date-input"
//             />
//           </div>
//           {!authData.user.isAdmin && (
//             <div>
//               <label className="text-label">Complaint Type:</label>
//               <select
//                 value={selectedType}
//                 onChange={(e) => setSelectedType(e.target.value)}
//                 className="select-box"
//               >
//                 <option value="">All</option>
//                 <option value="electricity">Electricity</option>
//                 <option value="water">Water</option>
//                 <option value="road">Road</option>
//                 <option value="waste">Waste</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>
//           )}
//           {!authData.user.isAdmin && (
//             <div>
//               <label className="text-label">Complaint Status:</label>
//               <select
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//                 className="select-box"
//               >
//                 <option value="">All</option>
//                 <option value="Open">Open</option>
//                 <option value="Closed">Closed</option>
//               </select>
//             </div>
//           )}
//           {authData.user.roles.includes('Admin') && (
//             <div className="mobile-number-search">
//               <label className="text-label">Mobile Number:</label>
//               <input
//                 type="text"
//                 value={filterMobileNumber}
//                 onChange={(e) => setFilterMobileNumber(e.target.value)}
//                 placeholder="Enter Mobile No."
//                 className="text-input"
//               />
//             </div>
//           )}
//           <div>
//             <label className="text-label">
//               <button
//                 className="search-button"
//                 onClick={handleSearch}
//                 disabled={loading}
//               >
//                 {loading ? "Searching..." : "Search"}
//               </button>
//             </label>
//           </div>
//         </div>

//         <div className="complaint-card-container">
//           {loading && complaints.length === 0 && (
//             <div className="loading">Loading complaints...</div>
//           )}
//           {loading && complaints.length > 0 && (
//             <div className="loading">Loading more complaints...</div>
//           )}
//           {error && <div className="error">{error}</div>}
//           {!loading && complaints.length > 0 ? (
//             complaints.map((complaint) => (
//               <div key={complaint.ComplaintID} className="complaint-card">
//   <p>
//     <strong>Registration No:</strong>{" "}
//     <button
//       className="navigate-btn"
//       onClick={() =>
//         navigate(`/ComplainDetailsPage/${complaint.ComplaintID}`, {
//           state: complaint,
//         })
//       }
//     >
//       {complaint.ComplaintRegistrationNo}
//     </button>
//   </p>
//   <p>
//     <strong>Type:</strong> {complaint.ComplaintsType}
//   </p>
//   <p>
//     <strong>Status:</strong> {complaint.ComplaintsStatus}
//   </p>
//   <p>
//     <strong>Mobile No:</strong> {complaint.MobileNo}
//   </p>
//   <p>
//     <strong>Created Date:</strong> {formatDate(complaint.CreatedDate)}
//   </p>
//   <p>
//     <strong>Zone:</strong> {complaint.zone}
//   </p>
//   <p>
//     <strong>Locality:</strong> {complaint.locality}
//   </p>
//   <p>
//     <strong>Colony:</strong> {complaint.Colony}
//   </p>
// </div>
//             ))
//           ) : !loading && complaints.length === 0 ? (
//             <p>No complaints found for the selected filters.</p>
//           ) : null}
//         </div>

//         <div className="pagination-controls">
//           <div className="pagination-buttons">
//             <button
//               className="more-button"
//               onClick={handleNextPage}
//               disabled={loading || !hasMoreComplaints}
//             >
//               Load More
//             </button>
//           </div>
//         </div>
//         <div className="set-limit">
//           <label className="set-limit-label">Set Limit:</label>
//           <select
//             value={limit}
//             onChange={(e) => handleLimitChange(parseInt(e.target.value))}
//             className="limit-dropdown"
//           >
//             {[3, 5, 10, 15, 20, 100].map((value) => (
//               <option key={value} value={value}>
//                 {value}
//               </option>
//             ))}
//           </select>
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default ComplainDetails;


// import React, { useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Header, Footer } from "./HeaderFooter";
// import "../App.css";
// import Navbar from "./navbar";
// import { AuthContext } from "../contexts/AuthContext";

// const ComplainDetailsPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const complaint = location.state;
//   const { authData } = useContext(AuthContext);

//   const API_URL = "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net";

//   if (!complaint) {
//     console.error("No complaint data received.");
//     return <div className="loading">No complaint details available.</div>;
//   }

//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const updateComplaintStatus = async () => {
//     const data = {
//       complaintno: complaint.ComplaintID,
//       status: "Closed",
//       modifiedBy: authData.user.username,
//     };

//     console.log("API URL:", `${API_URL}/auth/updateComplaintStatus`);
//     console.log("Request Body for Closing Complaint:", data);

//     try {
//       const response = await axios.post(`${API_URL}/auth/updateComplaintStatus`, data, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authData.token}`,
//         },
//       });
//       console.log("Response for Closing Complaint:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error updating complaint status:", error);
//       if (error.response) {
//         console.error("Response Data:", error.response.data);
//         console.error("Response Status:", error.response.status);
//       }
//       alert("Failed to close the complaint. Please try again.");
//     }
//   };

//   const updateComplaintStatusOpen = async () => {
//     const data = {
//       complaintno: complaint.ComplaintID,
//       status: "Open",
//       modifiedBy: authData.user.username,
//     };

//     console.log("Request Body for Opening Complaint:", data);

//     try {
//       const response = await axios.post(`${API_URL}/auth/updateComplaintStatusOpen`, data, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authData.token}`,
//         },
//       });
//       console.log("Response for Opening Complaint:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error updating complaint status to open:", error);
//       if (error.response) {
//         console.error("Response Data:", error.response.data);
//         console.error("Response Status:", error.response.status);
//       }
//       alert("Failed to open the complaint. Please try again.");
//     }
//   };

//   const handleCloseComplaint = async () => {
//     const result = await updateComplaintStatus();
//     if (result?.success) {
//       alert("Complaint closed successfully.");
//       navigate(0);
//     }
//   };

//   const handleOpenComplaint = async () => {
//     const result = await updateComplaintStatusOpen();
//     if (result?.success) {
//       alert("Complaint opened successfully.");
//       navigate(0);
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <Navbar />
//       <div className="complaint-details-container">
//         <div className="complaint-details">
//           <h2>Complaint Details</h2>

//           <div className="details-info">
//             <p>
//               <strong>Complaint ID:</strong> {complaint.ComplaintID || "N/A"}
//             </p>
//             <p>
//               <strong>Registration No:</strong>{" "}
//               {complaint.ComplaintRegistrationNo || "N/A"}
//             </p>
//             <p>
//               <strong>User ID:</strong> {complaint.UserID || "N/A"}
//             </p>
//             <p>
//               <strong>Complaint Type:</strong>{" "}
//               {complaint.ComplaintsType || "N/A"}
//             </p>
//             <p>
//               <strong>Complaint Status:</strong>{" "}
//               {complaint.ComplaintsStatus || "N/A"}
//             </p>
//             <p>
//               <strong>Mobile No:</strong> {complaint.MobileNo || "N/A"}
//             </p>
//             <p>
//               <strong>Description:</strong> {complaint.Description || "N/A"}
//             </p>
//             <p>
//               <strong>Location:</strong> {complaint.Location || "N/A"}
//             </p>
//             <p>
//               <strong>Zone:</strong> {complaint.zone || "N/A"}
//             </p>
//             <p>
//               <strong>Locality:</strong> {complaint.locality || "N/A"}
//             </p>
//             <p>
//               <strong>Colony:</strong> {complaint.Colony || "N/A"}
//             </p>
//             <p>
//               <strong>Created By:</strong> {complaint.CreatedBy || "N/A"}
//             </p>
//             <p>
//               <strong>Created Date:</strong>{" "}
//               {formatDate(complaint.CreatedDate) || "N/A"}
//             </p>

//             {complaint.document && (
//               <p>
//                 <strong>Document:</strong>{" "}
//                 <a
//                   href={complaint.document}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="doc-link"
//                 >
//                   Download Document
//                 </a>
//               </p>
//             )}

//             {complaint.photo && (
//               <>
//                 <p>
//                   <strong>Photo:</strong>
//                 </p>
//                 <img src={complaint.photo} alt="Complaint" className="photo" />
//               </>
//             )}
//           </div>

//           <div className="action-buttons">
//             <button
//               className="action-btn reply-btn"
//               onClick={() =>
//                 navigate(`/ReplyPage`, {
//                   state: { complaintID: complaint.ComplaintID },
//                 })
//               }
//             >
//               Reply
//             </button>

            

//             <button
//               className="action-btn back-btn"
//               onClick={() => navigate(-1)}
//             >
//               Back
//             </button>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ComplainDetailsPage;


// import React, { useState, useEffect, useContext, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Header, Footer } from "./HeaderFooter";
// import Navbar from "./navbar";
// import { AuthContext } from "../contexts/AuthContext";
// import "../App.css";

// const ReplyPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { complaintID, complaintStatus } = location.state || {}; // Use complaintID and complaintStatus from navigation state
//   const { authData } = useContext(AuthContext);
//   const isAdmin = authData?.user?.roles?.includes("Admin") || false; // Check if the user is an admin
//   const [replies, setReplies] = useState([]);
//   const [replyDescription, setReplyDescription] = useState("");
//   const [ipAddress, setIpAddress] = useState("");
//   const [currentStatus, setCurrentStatus] = useState(complaintStatus); // Track the current status of the complaint

//   const fetchReplies = useCallback(async () => {
//     if (!complaintID) {
//       alert("Complaint ID is missing");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complaintsreplies",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${authData.token}`,
//           },
//           body: JSON.stringify({ complaintno: complaintID }),
//         }
//       );

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(
//           `API Error: ${response.status} ${response.statusText} - ${text}`
//         );
//       }

//       const data = await response.json();
//       if (data.success === false) {
//         throw new Error(data.message || "Failed to fetch replies");
//       }

//       setReplies(data);
//       console.log("Fetched replies:", data);
//     } catch (error) {
//       console.error("Error fetching replies:", error);
//       alert(`Failed to fetch replies: ${error.message}`);
//     }
//   }, [complaintID, authData.token]);

//   const fetchIpAddress = async () => {
//     try {
//       const response = await fetch("https://api.ipify.org?format=json");
//       const data = await response.json();
//       setIpAddress(data.ip);
//     } catch (error) {
//       console.error("Error fetching IP address:", error);
//     }
//   };

//   const handleReplySubmit = async () => {
//     if (!replyDescription.trim()) {
//       alert("Reply description cannot be empty");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complaintsreply",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${authData.token}`,
//           },
//           body: JSON.stringify({
//             complaintno: complaintID,
//             replyDescription,
//             isAdmin,
//             ipAddress,
//             userDetails: {
//               username: authData.user.username,
//             },
//           }),
//         }
//       );

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(
//           `API Error: ${response.status} ${response.statusText} - ${text}`
//         );
//       }

//       const data = await response.json();
//       if (data.success === false) {
//         throw new Error(data.message || "Failed to submit reply");
//       }

//       setReplyDescription("");
//       fetchReplies();
//       alert("Reply submitted successfully");
//     } catch (error) {
//       console.error("Error submitting reply:", error);
//       alert(`Failed to submit reply: ${error.message}`);
//     }
//   };

//   const handleUpdateStatus = async (status) => {
//     try {
//       console.log("Received complaintno:", complaintID);
//       console.log("Received status:", status);
//       console.log("Received modifiedBy:", authData.user.username);

//       const response = await fetch(
//         "https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complaintsstatus",
//         {
//           method: "POST", // Use POST as per the provided API
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${authData.token}`,
//           },
//           body: JSON.stringify({
//             complaintno: complaintID,
//             status,
//             modifiedBy: authData.user.username,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(
//           `API Error: ${response.status} ${response.statusText} - ${text}`
//         );
//       }

//       const data = await response.json();
//       if (data.success === false) {
//         throw new Error(
//           data.message || `Failed to ${status.toLowerCase()} complaint`
//         );
//       }

//       setCurrentStatus(status); // Update the current status
//       alert(`Complaint ${status.toLowerCase()} successfully`);
//     } catch (error) {
//       console.error(`Error updating complaint status to ${status}:`, error);
//       alert(`Failed to ${status.toLowerCase()} complaint: ${error.message}`);
//     }
//   };

//   useEffect(() => {
//     fetchReplies();
//     fetchIpAddress();
//   }, [fetchReplies]);

//   return (
//     <div>
//       <Header />
//       <Navbar />
//       <div className="reply-page-container">
//         <h2>Complaint Replies</h2>
//         <div className="replies-container">
//           {replies.length > 0 ? (
//             replies.map((reply, index) => (
//               <div
//                 key={index}
//                 className={`reply-card ${
//                   reply.IsAdmin ? "admin-reply" : "user-reply"
//                 }`}
//               >
//                 <p className="reply-text">{reply.ReplyDescription}</p>
//                 <p className="reply-meta">
//                   <strong>By:</strong> {reply.ReplyBy} |{" "}
//                   {new Date(reply.ReplyDate).toLocaleString()}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p>No replies found for this complaint.</p>
//           )}
//         </div>
//         <div className="reply-input-container">
//           <textarea
//             className="reply-input"
//             value={replyDescription}
//             onChange={(e) => setReplyDescription(e.target.value)}
//             placeholder="Type your reply..."
//           />
//           <div className="allButtons">
//             <button className="reply-button" onClick={handleReplySubmit}>
//               Submit Reply
//             </button>
//             {authData?.user?.roles?.includes("Admin") && currentStatus === "Open" && (
//     <button
//       className="close-button"
//       onClick={() => handleUpdateStatus("Closed")}
//     >
//       Close Complaint
//     </button>
//   )}

//             <button className="back-button" onClick={() => navigate(-1)}>
//               Back
//             </button>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ReplyPage;

