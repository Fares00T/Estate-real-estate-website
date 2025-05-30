import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Report.scss";

export default function ReportPage() {
  const [reportType, setReportType] = useState("post");
  const [formData, setFormData] = useState({
    reportedUser: "",
    reportedPostId: "",
    reason: "",
    details: "",
    submittedBy: "",
    submittedEmail: "",
    screenshot: null,
  });
  const [feedback, setFeedback] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("reportType", reportType);
    data.append("reportedUser", formData.reportedUser);
    data.append("reportedPostId", formData.reportedPostId);
    data.append("reason", formData.reason);
    data.append("details", formData.details);
    data.append("submittedBy", formData.submittedBy);
    data.append("submittedEmail", formData.submittedEmail);
    if (formData.screenshot) data.append("screenshot", formData.screenshot);

    try {
      await axios.post("http://localhost:8800/api/report", data);
      setFeedback("✅ Report submitted successfully.");
      setShowPopup(true);
      setTimeout(() => navigate("/"), 5000);
    } catch (err) {
      setFeedback("❌ Failed to submit. Try again.");
      setShowPopup(true);
      console.error(err);
    }
  };

  return (
    <div className="report-page">
      <form className="report-form" onSubmit={handleSubmit}>
        <h2>Report a Post or User</h2>

        <label>Report Type</label>
        <select
          name="reportType"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          required
        >
          <option value="post">Post</option>
          <option value="user">User</option>
        </select>

        {reportType === "post" && (
          <>
            <label>Reported Post ID</label>
            <input
              type="text"
              name="reportedPostId"
              value={formData.reportedPostId}
              onChange={handleChange}
              required
            />
          </>
        )}

        {reportType === "user" && (
          <>
            <label>Reported Username or ID</label>
            <input
              type="text"
              name="reportedUser"
              value={formData.reportedUser}
              onChange={handleChange}
              required
            />
          </>
        )}

        <label>Reason</label>
        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
        />

        <label>Details (optional)</label>
        <textarea
          name="details"
          rows={4}
          value={formData.details}
          onChange={handleChange}
        />

        <label>Your Name</label>
        <input
          type="text"
          name="submittedBy"
          value={formData.submittedBy}
          onChange={handleChange}
          required
        />

        <label>Your Email</label>
        <input
          type="email"
          name="submittedEmail"
          value={formData.submittedEmail}
          onChange={handleChange}
          required
        />

        <label>Upload Screenshot (optional)</label>
        <input
          type="file"
          name="screenshot"
          accept="image/*"
          onChange={handleChange}
        />
        {formData.screenshot && (
          <span className="filename">{formData.screenshot.name}</span>
        )}

        <button type="submit" className="submit-btn">
          Submit Report
        </button>
      </form>

      {showPopup && (
        <div className="popup">
          <p>
            ✅ report submitted successfully! Redirecting to homepage in 5
            seconds...
          </p>
        </div>
      )}
    </div>
  );
}
