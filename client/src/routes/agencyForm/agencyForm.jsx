import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./agencyForm.scss";

function AgencyApplicationForm() {
  const { currentUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    agencyName: "",
    representativeName: "",
    email: "",
    phone: "",
    address: "",
    registrationNumber: "",
    message: "",
    files: {
      license: null,
      registrationPaper: null,
      idProof: null,
    },
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [name]: files[0] || null,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("agencyName", formData.agencyName);
    data.append("representativeName", formData.representativeName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("registrationNumber", formData.registrationNumber);
    data.append("message", formData.message);
    data.append("submittedBy", currentUser?.username || "");
    data.append("submittedEmail", currentUser?.email || "");

    if (formData.files.license) data.append("license", formData.files.license);
    if (formData.files.registrationPaper)
      data.append("registrationPaper", formData.files.registrationPaper);
    if (formData.files.idProof) data.append("idProof", formData.files.idProof);

    try {
      const res = await fetch("http://localhost:8800/api/apply", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Failed to submit application");

      setShowPopup(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 5000); // Redirect after 5 seconds
    } catch (err) {
      console.error("Submission error:", err);
      alert("There was an error submitting the application.");
    }
  };

  return (
    <div className="agencyFormPage">
      {showPopup && (
        <div className="popup">
          <p>
            ✅ Application submitted successfully! Redirecting to homepage in 5
            seconds...
          </p>
        </div>
      )}

      <div className="formContainer">
        <h1>Agency Application</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* All form fields remain unchanged */}
          <div className="item">
            <label htmlFor="agencyName">Agency Name</label>
            <input
              id="agencyName"
              name="agencyName"
              type="text"
              value={formData.agencyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="item">
            <label htmlFor="representativeName">Representative Name</label>
            <input
              id="representativeName"
              name="representativeName"
              type="text"
              value={formData.representativeName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="item">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="item">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="item">
            <label htmlFor="registrationNumber">Registration Number</label>
            <input
              id="registrationNumber"
              name="registrationNumber"
              type="text"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="item">
            <label htmlFor="message">Message (Optional)</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any additional information..."
            />
          </div>

          {/* File Inputs */}
          <div className="item">
            <label htmlFor="license">License Document</label>
            <input
              id="license"
              name="license"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.png"
              required
            />
          </div>
          <div className="item">
            <label htmlFor="registrationPaper">Registration Paper</label>
            <input
              id="registrationPaper"
              name="registrationPaper"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.png"
              required
            />
          </div>
          <div className="item">
            <label htmlFor="idProof">ID Proof</label>
            <input
              id="idProof"
              name="idProof"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.png"
              required
            />
          </div>

          <button className="sendButton" type="submit">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}

export default AgencyApplicationForm;
