import React, { useState, useContext, use } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Header, Footer } from './HeaderFooter';
import { AuthContext } from "../contexts/AuthContext";
import Navbar from './navbar';
import '../App.css';

// Mask Aadhaar except last 4 digits
const maskAadhaarNumber = (aadhaarNumber) => {
    if (aadhaarNumber && aadhaarNumber.length === 12) {
        return aadhaarNumber.slice(-4);
    }
    return aadhaarNumber || 'N/A';
};

// Updated occupation options to match the Picker in OwnerComponent
const occupationOptions = [
    { label: 'Select an occupation', value: '' },
    { label: 'Government Employee', value: 'Government Employee' },
    { label: 'Private Employee', value: 'Private Employee' },
    { label: 'Self-Employed', value: 'Self-Employed' },
    { label: 'Farmer', value: 'Farmer' },
    { label: 'Student', value: 'Student' },
    { label: 'Unemployed', value: 'Unemployed' },
    { label: 'Retired', value: 'Retired' },
    { label: 'Housewife', value: 'Housewife' },
    { label: 'Teacher', value: 'Teacher' },
    { label: 'Engineer', value: 'Engineer' },
    { label: 'Doctor', value: 'Doctor' },
    { label: 'Lawyer', value: 'Lawyer' },
    { label: 'Artist', value: 'Artist' },
    { label: 'Business Owner', value: 'Business Owner' },
    { label: 'Freelancer', value: 'Freelancer' },
    { label: 'Others', value: 'Others' },
];

// Updated age options to match the Picker in OwnerComponent
const ageOptions = [
    { label: 'Select age', value: '' },
    { label: '16-20', value: '16-20' },
    { label: '21-30', value: '21-30' },
    { label: '31-40', value: '31-40' },
    { label: '41-50', value: '41-50' },
    { label: '51-60', value: '51-60' },
    { label: '61-70', value: '61-70' },
    { label: '71-80', value: '71-80' },
    { label: '81-90', value: '81-90' },
    { label: '90+', value: '90+' },
];

const genderOptions = [
    { label: 'Select Gender', value: '' },
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },
];

const incomeOptions = [
    { label: 'Select an Income range', value: '0' },
    { label: 'Below 10,000', value: 'Below 10,000' },
    { label: '10,000 - 20,000', value: '10,000 - 20,000' },
    { label: '20,001 - 30,000', value: '20,001 - 30,000' },
    { label: '30,001 - 40,000', value: '30,001 - 40,000' },
    { label: '40,001 - 50,000', value: '40,001 - 50,000' },
    { label: '50,001 - 100,000', value: '50,001 - 100,000' },
    { label: '100,001 - 200,000', value: '100,001 - 200,000' },
    { label: '200,001 - 300,000', value: '200,001 - 300,000' },
    { label: '300,001 - 400,000', value: '300,001 - 400,000' },
    { label: '400,001 - 500,000', value: '400,001 - 500,000' },
    { label: '500,001 - 1,000,000', value: '500,001 - 1,000,000' },
    { label: '1,000,001 - 10,000,000', value: '1,000,001 - 10,000,000' },
    { label: '10,000,000+', value: '10,000,000+' },
];

const religionOptions = [
    { label: 'Select an Religion range', value: '' },
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Muslim', value: 'Muslim' },
    { label: 'Christian', value: 'Christian' },
    { label: 'Sikh', value: 'Sikh' },
    { label: 'Other', value: 'Other' },
];

const categoryOptions = [
    { label: 'Select an Category range', value: '' },
    { label: 'General', value: 'General' },
    { label: 'OBC', value: 'OBC' },
    { label: 'SC', value: 'SC' },
    { label: 'ST', value: 'ST' },
    { label: 'Other', value: 'Other' },
];

// Family member relation dropdown options
const relationOptions = [
  { label: 'Select Relation', value: '' },
  { label: 'Father', value: 'Father' },
  { label: 'Mother', value: 'Mother' },
  { label: 'Wife', value: 'Wife' },
  { label: 'Husband', value: 'Husband' },
  { label: 'Son', value: 'Son' },
  { label: 'Daughter', value: 'Daughter' },
  { label: 'Brother', value: 'Brother' },
  { label: 'Sister', value: 'Sister' },
  { label: 'Grandfather', value: 'Grandfather' },
  { label: 'Grandmother', value: 'Grandmother' },
];

// Special Consideration dropdown options
const considerationTypeOptions = [
  { label: 'Select Consideration Type', value: 'None' },
  { label: 'Senior Citizen', value: 'Senior Citizen' },
  { label: 'Freedom Fighter', value: 'Freedom Fighter' },
  { label: 'Armed Forces', value: 'Armed Forces' },
  { label: 'Handicapped', value: 'Handicapped' },
  { label: 'Widow', value: 'Widow' },
  { label: 'None', value: 'None' },
];

// Updated dropdown options for property fields to match mobile app
const propertyModeOptions = [
  { label: 'Select Property Mode', value: '' },
  { label: 'Residential', value: 'Residential' },
  { label: 'Commercial', value: 'Commercial' },
  { label: 'both Commercial & Residential', value: 'both Commercial & Residential' },
];
const propertyAgeOptions = [
  { label: 'Select Property Age', value: '' },
  { label: '1-5', value: '1-5' },
  { label: '5-10', value: '5-10' },
  { label: '10-15', value: '10-15' },
  { label: '15-20', value: '15-20' },
  { label: '20-30', value: '20-30' },
  { label: '30-40', value: '30-40' },
  { label: '40-50', value: '40-50' },
  { label: '50-60', value: '50-60' },
  { label: '60-70', value: '60-70' },
  { label: '70-80', value: '70-80' },
  { label: '80-90', value: '80-90' },
  { label: '90-100', value: '90-100' },
  { label: '100-110', value: '100-110' },
  { label: '110-120', value: '110-120' },
  { label: '120-130', value: '120-130' },
  { label: '130-140', value: '130-140' },
  { label: '140-150', value: '140-150' },
  { label: '150+', value: '150+' },
];
const roomCountOptions = [
  { label: 'Select Room Count', value: '' },
  ...Array.from({ length: 21 }, (_, i) => ({ label: String(i), value: String(i) }))
];
const floorCountOptions = [
  { label: 'Select Floor Count', value: '0' },
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
];
const shopCountOptions = [
  { label: 'Select Shop Count', value: '0' },
  ...Array.from({ length: 11 }, (_, i) => ({ label: String(i), value: String(i) }))
];
const houseTypeOptions = [
  { label: 'Select House Type', value: '' },
  { label: 'Kuchha', value: 'Kuchha' },
  { label: 'Pakka', value: 'Pakka' },
  { label: 'Khali plot', value: 'Khali plot' },
  { label: 'Semi-pakka', value: 'Semi-pakka' },
];
const roadSizeOptions = [
  { label: 'Select Road Size (In Feet)', value: '' },
  { label: '6', value: '6' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '12', value: '12' },
  { label: '18', value: '18' },
  { label: '24', value: '24' },
  { label: '24+', value: '24+' },
];

// Render two-column table with dropdowns/number inputs for edit mode
const renderTwoColumnTable = (fields, data, editMode = false, onChange = () => {}, context = 'owner') => (
  <table className="survey-data-table" style={{ width: '48%', display: 'inline-table', verticalAlign: 'top', margin: '0 1%' }}>
    <tbody>
      {fields.map(([label, key], idx) => (
        <tr key={idx}>
          <td className="survey-data-table-header" style={{ fontWeight: 'bold' }}>{label}</td>
          <td className="survey-data-table-cell">
            {editMode && key !== 'OwnerID' && !['DateModified', 'ModifiedBy', 'NumberOfMembers'].includes(key) ? (
              // Property dropdowns
              context === 'property' && key === 'PropertyMode' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {propertyModeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'property' && key === 'PropertyAge' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {propertyAgeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'property' && key === 'RoomCount' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {roomCountOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'property' && key === 'FloorCount' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {floorCountOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'property' && key === 'ShopCount' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {shopCountOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'property' && key === 'HouseType' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {houseTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'property' && key === 'RoadSize' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {roadSizeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              )
              // Owner edit dropdowns
              : context === 'owner' && key === 'Occupation' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {occupationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'owner' && key === 'Age' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {ageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'owner' && key === 'Gender' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {genderOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'owner' && key === 'Income' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {incomeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'owner' && key === 'Religion' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {religionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'owner' && key === 'Category' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : key === 'MobileNumber' ? (
                <input
                  type="number"
                  value={data[key] ?? ''}
                  onChange={e => {
                    // Only allow numbers
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    onChange(key, val);
                  }}
                  style={{ width: '95%' }}
                  min="0"
                  maxLength={10}
                />
              ) : key === 'NumberOfMembers' ? (
                <input
                  type="number"
                  value={data[key] ?? ''}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    onChange(key, val);
                  }}
                  style={{ width: '95%' }}
                  min="0"
                />
              ) : context === 'family' && key === 'Relation' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {relationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'family' && key === 'Gender' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {genderOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'family' && key === 'Age' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {ageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'family' && key === 'Occupation' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {occupationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : context === 'family' && key === 'Income' ? (
                <select value={data[key] ?? ''} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  {incomeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : key === 'DOB' ? (
                <input
                  type="date"
                  value={data[key] ?? ''}
                  onChange={e => onChange(key, e.target.value)}
                  style={{ width: '95%' }}
                />
              ) : key === 'IsActive' ? (
                <select value={data[key] ?? 1} onChange={e => onChange(key, e.target.value)} style={{ width: '95%' }}>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={data[key] ?? ''}
                  onChange={e => onChange(key, e.target.value)}
                  style={{ width: '95%' }}
                />
              )
            ) : (
              key === 'AdharNumber'
                ? maskAadhaarNumber(data[key])
                : key === 'DateModified'
                  ? formatDateDMY(data[key])
                  : data[key] ?? 'N/A'
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Helper: format date as dd-mm-yy
const formatDateDMY = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
};

// Owner fields for edit/view
const ownerFieldsLeft = [
    ['First Name', 'FirstName'],
    ['Middle Name', 'MiddleName'],
    ['Last Name', 'LastName'],
    ['Father Name', 'FatherName'],
    ['Mobile Number', 'MobileNumber'],
    ['Occupation', 'Occupation'],
    ['Age', 'Age'],
    ['DOB', 'DOB'],
    ['Gender', 'Gender'],
    ['Income', 'Income'],
];

const ownerFieldsRight = [
    ['Religion', 'Religion'],
    ['Category', 'Category'],
    ['Cast', 'Cast'],
    ['Aadhaar Number', 'AdharNumber'],
    ['Pan Card Number', 'PanNumber'],
    ['Email', 'Email'],
    ['No of Members', 'NumberOfMembers'],
    ['Modified By', 'ModifiedBy'],
    ['Date Modified', 'DateModified'],
];

// Family member fields for left and right columns
const familyFieldsLeft = [
  ['First Name', 'FirstName'],
  ['Last Name', 'LastName'],
  ['Relation', 'Relation'],
  ['Age', 'Age'],
  ['DOB', 'DOB'],
];
const familyFieldsRight = [
  ['Gender', 'Gender'],
  ['Occupation', 'Occupation'],
  ['Income', 'Income'],
  ['Modified By', 'ModifiedBy'],
  ['Date Modified', 'DateModified'],
];

// Special considerations fields
const considerationFields = [
  ['Type', 'ConsiderationType'],
  ['Description', 'Description'],
  ['Modified By', 'ModifiedBy'],
  ['Date Modified', 'DateModified'],
];


// Property fields for edit/view
const propertyFieldsLeft = [
  ['Property Mode', 'PropertyMode'],
  ['Property Age', 'PropertyAge'],
  ['Room Count', 'RoomCount'],
  ['Floor Count', 'FloorCount'],
  ['Shop Count', 'ShopCount'],
  ['Shop Area', 'ShopArea'],
  ['Tenant Yearly Rent', 'TenantYearlyRent'],
  
];
const propertyFieldsRight = [
  ['House Number', 'HouseNumber'],
  ['House Type', 'HouseType'],
  ['Open Area', 'OpenArea'],
  ['Constructed Area', 'ConstructedArea'],
  ['Modified By', 'ModifiedBy'],
  ['Date Modified', 'DateModified'],

];

const EditData = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { data } = location.state || {};
   const { authData, setAuthData } = useContext(AuthContext);
    const [editOwner, setEditOwner] = useState(false);
    const [ownerForm, setOwnerForm] = useState(data ? { ...data.owner } : {});
    const [editFamilyIdx, setEditFamilyIdx] = useState(null);
    const [familyForm, setFamilyForm] = useState({});
    const [editConsiderationIdx, setEditConsiderationIdx] = useState(null);
    const [considerationForm, setConsiderationForm] = useState({});
    const [editPropertyIdx, setEditPropertyIdx] = useState(null);
    const [propertyForm, setPropertyForm] = useState({});
    const [saving, setSaving] = useState(false);

    if (!data) return <div>No data to show.</div>;

    // Helper: get today's date in YYYY-MM-DD
    const getToday = () => {
        const d = new Date();
        return d.toISOString().split('T')[0];
    };

    // Fields that must not be null/empty
    const requiredFields = [
        'FirstName', 'LastName', 'FatherName', 'MobileNumber', 'Age', 'Gender', 'Religion', 'Category'
    ];

    const handleOwnerChange = (key, value) => {
        // Prevent editing of non-editable fields
        if (["DateModified", "ModifiedBy", "NumberOfMembers"].includes(key)) return;
        setOwnerForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Helper for family member change
    const handleFamilyChange = (key, value) => {
        setFamilyForm((prev) => ({ ...prev, [key]: value }));
    };

    // Helper for consideration change
    const handleConsiderationChange = (key, value) => {
      setConsiderationForm((prev) => ({ ...prev, [key]: value }));
    };

    // Helper for property change
    const handlePropertyChange = (key, value) => {
      setPropertyForm((prev) => ({ ...prev, [key]: value }));
    };

    // Use username from authData for ModifiedBy and h1
    const username = authData && authData.user ? authData.user.username : '';
    console.log('username:', username);

    const handleSaveOwner = async () => {
        // Validate required fields
        for (const field of requiredFields) {
            if (!ownerForm[field] || ownerForm[field].toString().trim() === '') {
                alert(`${field} is required and cannot be empty.`);
                return;
            }
        }
        setSaving(true);

        try {
            console.log(username);
            // Set DateModified and ModifiedBy before submit
            const payload = {
                ...ownerForm,
                DateModified: getToday(),
                ModifiedBy: username || 'Unknown',
            };
            await axios.post(
                'https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/updateOwner',
                payload
            );
            alert('Owner info updated successfully!');
            setEditOwner(false);
            setOwnerForm(payload); // update local state with new DateModified/ModifiedBy
            navigate(-1); // Go back to previous page (SurveyData)
        } catch (err) {
            alert('Failed to update owner info.');
        }
        setSaving(false);
    };

    // Save family member
    const handleSaveFamily = async (idx) => {
    setSaving(true);
    try {
      const payload = {
        ...familyForm,
        ModifiedBy: username || 'Unknown',
        DateModified: new Date().toISOString(),
      };
      await axios.post(
        'https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/updateFamily',
        payload
      );
      alert('Family member updated successfully!');
      setEditFamilyIdx(null);
       navigate(-1);
    } catch (err) {
      alert('Failed to update family member.');
    }
    setSaving(false);
  };

  // Save special consideration
  const handleSaveConsideration = async (idx) => {
    setSaving(true);
    try {
      const payload = {
        ...considerationForm,
        ModifiedBy: username || 'Unknown',
        DateModified: new Date().toISOString(),
      };
      await axios.post(
        'https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/updateSpecial',
        payload
      );
      alert('Special consideration updated successfully!');
      setEditConsiderationIdx(null);
      navigate(-1); // Go back to previous page (SurveyData)
    } catch (err) {
      alert('Failed to update special consideration.');
    }
    setSaving(false);
  };

  // Save property
  const handleSaveProperty = async (idx) => {
    setSaving(true);
    try {
      const payload = {
        ...propertyForm,
        ModifiedBy: username || 'Unknown',
        DateModified: new Date().toISOString(),
      };
      await axios.post(
        'https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/updateProperty',
        payload
      );
      alert('Property updated successfully!');
      setEditPropertyIdx(null);
      navigate(-1);
    } catch (err) {
      alert('Failed to update property.');
    }
    setSaving(false);
  };

    return (
        <div>
            <Header />
            <Navbar />
            <div className="survey-data-container">
                <div className="survey-data-content">
                    {/* Owner Info Section */}
                    <h1 style={{ textAlign: 'center' }}>User Info {username && (
                      <span style={{fontSize:'1.2rem', fontWeight:'normal', marginLeft:8}}>
                      </span>
                    )}</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2%' }}>
                        {renderTwoColumnTable(ownerFieldsLeft, editOwner ? ownerForm : data.owner, editOwner, handleOwnerChange)}
                        {renderTwoColumnTable(ownerFieldsRight, editOwner ? ownerForm : data.owner, editOwner, handleOwnerChange)}
                    </div>
                    <div style={{ textAlign: 'center', margin: '16px 0 40px 0' }}>
                        {editOwner ? (
                            <>
                                <button
                                    className="survey-data-edit-section-btn"
                                    onClick={handleSaveOwner}
                                    disabled={saving}
                                    style={{ marginRight: 10 }}
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    className="survey-data-edit-section-btn"
                                    onClick={() => {
                                        setEditOwner(false);
                                        setOwnerForm({ ...data.owner });
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                className="survey-data-edit-section-btn"
                                onClick={() => setEditOwner(true)}
                            >
                                Edit Owner Info
                            </button>
                        )}
                    </div>
                    <hr style={{ margin: '40px 0' }} />

                    {/* Family Members Section */}
                    <h2>Family Members</h2>
                    {data.familyMembers && data.familyMembers.length > 0 ? (
                        data.familyMembers.map((fm, idx) => (
                            <div key={idx} style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '2%' }}>
                                    {renderTwoColumnTable(familyFieldsLeft, editFamilyIdx === idx ? familyForm : fm, editFamilyIdx === idx, handleFamilyChange, 'family')}
                                    {renderTwoColumnTable(familyFieldsRight, editFamilyIdx === idx ? familyForm : fm, editFamilyIdx === idx, handleFamilyChange, 'family')}
                                </div>
                                <div style={{ textAlign: 'center', margin: '16px 0' }}>
                                  {editFamilyIdx === idx ? (
                                    <>
                                      <button
                                        className="survey-data-edit-section-btn"
                                        onClick={() => handleSaveFamily(idx)}
                                        disabled={saving}
                                        style={{ marginRight: 10 }}
                                      >
                                        {saving ? 'Saving...' : 'Save'}
                                      </button>
                                      <button
                                        className="survey-data-edit-section-btn"
                                        onClick={() => setEditFamilyIdx(null)}
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      className="survey-data-edit-section-btn"
                                      onClick={() => {
                                        setEditFamilyIdx(idx);
                                        setFamilyForm({ ...fm });
                                      }}
                                    >
                                      Edit Family Member
                                    </button>
                                  )}
                                </div>
                            </div>
                        ))
                    ) : <div>No family members found.</div>}
                    <hr style={{ margin: '40px 0' }} />

                    {/* Properties Section */}
                    <h2>Properties</h2>
                    {data.properties && data.properties.length > 0 ? (
                      data.properties.map((p, idx) => (
                        <div key={idx} style={{ marginBottom: 24 }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '2%' }}>
                            {renderTwoColumnTable(propertyFieldsLeft, editPropertyIdx === idx ? propertyForm : p, editPropertyIdx === idx, handlePropertyChange, 'property')}
                            {renderTwoColumnTable(propertyFieldsRight, editPropertyIdx === idx ? propertyForm : p, editPropertyIdx === idx, handlePropertyChange, 'property')}
                          </div>
                          <div style={{ textAlign: 'center', margin: '16px 0' }}>
                            {editPropertyIdx === idx ? (
                              <>
                                <button
                                  className="survey-data-edit-section-btn"
                                  onClick={() => handleSaveProperty(idx)}
                                  disabled={saving}
                                  style={{ marginRight: 10 }}
                                >
                                  {saving ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                  className="survey-data-edit-section-btn"
                                  onClick={() => setEditPropertyIdx(null)}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                className="survey-data-edit-section-btn"
                                onClick={() => {
                                  setEditPropertyIdx(idx);
                                  setPropertyForm({ ...p });
                                }}
                              >
                                Edit Property
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : <div>No properties found.</div>}
                    <hr style={{ margin: '40px 0' }} />

                    {/* Special Considerations Section */}
                   <h2>Special Considerations</h2>
{data.considerations && data.considerations.length > 0 ? (
  data.considerations.map((c, idx) => (
    <div key={idx} style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2%' }}>
        {/* Left column: Consideration Type (dropdown in edit mode) and Description */}
        <table className="survey-data-table" style={{ width: '48%', display: 'inline-table', verticalAlign: 'top', margin: '0 1%' }}>
          <tbody>
            <tr>
              <td className="survey-data-table-header" style={{ fontWeight: 'bold' }}>Consideration Type</td>
              <td className="survey-data-table-cell">
                {editConsiderationIdx === idx ? (
                  <select
                    value={(considerationForm.ConsiderationType ?? 'None')}
                    onChange={e => handleConsiderationChange('ConsiderationType', e.target.value)}
                    style={{ width: '95%' }}
                  >
                    {considerationTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  c.ConsiderationType ?? 'N/A'
                )}
              </td>
            </tr>
            <tr>
              <td className="survey-data-table-header" style={{ fontWeight: 'bold' }}>Description</td>
              <td className="survey-data-table-cell">
                {editConsiderationIdx === idx ? (
                  <input
                    type="text"
                    value={considerationForm.Description ?? ''}
                    onChange={e => handleConsiderationChange('Description', e.target.value)}
                    style={{ width: '95%' }}
                  />
                ) : (
                  c.Description ?? 'N/A'
                )}
              </td>
            </tr>
          </tbody>
        </table>
        {/* Right column: Modified By and Date Modified */}
        <table className="survey-data-table" style={{ width: '48%', display: 'inline-table', verticalAlign: 'top', margin: '0 1%' }}>
          <tbody>
            <tr>
              <td className="survey-data-table-header" style={{ fontWeight: 'bold' }}>Modified By</td>
              <td className="survey-data-table-cell">
                {editConsiderationIdx === idx
                  ? (considerationForm.ModifiedBy ?? 'N/A')
                  : (c.ModifiedBy ?? 'N/A')}
              </td>
            </tr>
            <tr>
              <td className="survey-data-table-header" style={{ fontWeight: 'bold' }}>Date Modified</td>
              <td className="survey-data-table-cell">
                {editConsiderationIdx === idx
                  ? (formatDateDMY(considerationForm.DateModified))
                  : (formatDateDMY(c.DateModified))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: 'center', margin: '16px 0' }}>
        {editConsiderationIdx === idx ? (
          <>
            <button
              className="survey-data-edit-section-btn"
              onClick={() => handleSaveConsideration(idx)}
              disabled={saving}
              style={{ marginRight: 10 }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              className="survey-data-edit-section-btn"
              onClick={() => setEditConsiderationIdx(null)}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="survey-data-edit-section-btn"
            onClick={() => {
              setEditConsiderationIdx(idx);
              setConsiderationForm({ ...c });
            }}
          >
            Edit Consideration
          </button>
        )}
      </div>
    </div>
  ))
) : <div>No special considerations found.</div>}
<hr style={{ margin: '40px 0' }} />

                    {/* Files Section
                    <h2>Files</h2>
                    {data.files && data.files.length > 0 ? (
                        data.files.map((f, idx) => (
                            <div key={idx} style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '2%' }}>
                                    {renderTwoColumnTable([
                                        ['Original Name', 'OriginalName'],
                                        ['File Name', 'FileName'],
                                        ['File Path', 'FilePath'],
                                        ['File Size', 'FileSize'],
                                    ], f)}
                                    {renderTwoColumnTable([
                                        ['Created By', 'CreatedBy'],
                                        ['Date Created', 'DateCreated'],
                                        ['Modified By', 'ModifiedBy'],
                                        ['Date Modified', 'DateModified'],
                                        ['Active', 'IsActive'],
                                    ], f)}
                                </div>
                                <div style={{ textAlign: 'center', margin: '16px 0' }}>
                                    <button className="survey-data-edit-section-btn">Edit File</button>
                                </div>
                            </div>
                        ))
                    ) : <div>No files found.</div>}
                    <hr style={{ margin: '40px 0' }} /> */}

                    {/* Tenant Documents Section */}
                    {/* <h2>Tenant Documents</h2>
                    {data.TenantDocuments && data.TenantDocuments.length > 0 ? (
                        data.TenantDocuments.map((td, idx) => (
                            <div key={idx} style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '2%' }}>
                                    {renderTwoColumnTable([
                                        ['Tenant Name', 'tenantName'],
                                        ['Document Name', 'documentName'],
                                        ['Document Path', 'documentPath'],
                                        ['Document Size', 'documentSize'],
                                        ['Document Type', 'documentType'],
                                    ], td)}
                                    {renderTwoColumnTable([
                                        ['Created By', 'CreatedBy'],
                                        ['Date Created', 'DateCreated'],
                                        ['Modified By', 'ModifiedBy'],
                                        ['Date Modified', 'DateModified'],
                                        ['Active', 'IsActive'],
                                    ], td)}
                                </div>
                                <div style={{ textAlign: 'center', margin: '16px 0' }}>
                                    <button className="survey-data-edit-section-btn">Edit Tenant Document</button>
                                </div>
                            </div>
                        ))
                    ) : <div>No tenant documents found.</div>} */}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditData;