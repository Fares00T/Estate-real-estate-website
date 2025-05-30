import { useState } from "react";
import apiRequest from "../lib/apiRequest";
import "./tourRequestModal.scss";

export default function TourRequestModal({ post, currentUser, onClose }) {
  const [formData, setFormData] = useState({
    preferredDate: "",
    preferredTime: "",
    contactPhone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.preferredDate ||
      !formData.preferredTime ||
      !formData.contactPhone
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiRequest.post("/tours", {
        propertyId: post.id,
        agencyId: post.userId,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        contactPhone: formData.contactPhone,
        message: formData.message,
      });

      if (response.status === 201) {
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to send tour request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="tour-modal-overlay" onClick={onClose}>
      <div className="tour-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tour-modal-header">
          <h3>Request Property Tour</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Property Info Summary */}
        <div className="property-summary">
          <h4>{post.title}</h4>
          <p>
            {post.address}, {post.city}
          </p>
          <p className="price">DZD {post.price.toLocaleString()}</p>
        </div>

        <form onSubmit={handleSubmit} className="tour-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="preferredDate">📅 Preferred Date *</label>
            <input
              id="preferredDate"
              name="preferredDate"
              type="date"
              min={today}
              value={formData.preferredDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferredTime">🕐 Preferred Time *</label>
            <select
              id="preferredTime"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleInputChange}
              required
            >
              <option value="">Select time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time === "09:00" && "9:00 AM"}
                  {time === "10:00" && "10:00 AM"}
                  {time === "11:00" && "11:00 AM"}
                  {time === "14:00" && "2:00 PM"}
                  {time === "15:00" && "3:00 PM"}
                  {time === "16:00" && "4:00 PM"}
                  {time === "17:00" && "5:00 PM"}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="contactPhone">📞 Contact Phone *</label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="tel"
              placeholder="+213 555 123 456"
              value={formData.contactPhone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">💬 Message (Optional)</label>
            <textarea
              id="message"
              name="message"
              placeholder="Any specific requirements or questions about the property..."
              rows="3"
              value={formData.message}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
