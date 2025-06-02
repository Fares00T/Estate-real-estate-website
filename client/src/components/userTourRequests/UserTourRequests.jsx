import { useState, useEffect } from "react";
import apiRequest from "../lib/apiRequest";
import "./userTourRequests.scss";

export default function UserTourRequests({ currentUser }) {
  const [tourRequests, setTourRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTourRequests();
  }, []);

  const fetchTourRequests = async () => {
    try {
      const response = await apiRequest.get("/tours/client");
      setTourRequests(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tour requests");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await apiRequest.put(`/tours/${requestId}`, { status: "cancelled" });

      // Update local state
      setTourRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? { ...request, status: "cancelled" }
            : request
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel tour request.");
    }
  };

  const handleAddToCalendar = (request) => {
    if (
      request.status === "confirmed" &&
      request.confirmedDate &&
      request.confirmedTime
    ) {
      // Create calendar event
      const startDate = new Date(
        `${request.confirmedDate}T${request.confirmedTime}`
      );
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

      const event = {
        title: `Property Tour - ${request.property?.title}`,
        start: startDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
        end: endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
        description: `Property tour at ${request.property?.address}`,
        location: request.property?.address,
      };

      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        event.title
      )}&dates=${event.start}/${event.end}&details=${encodeURIComponent(
        event.description
      )}&location=${encodeURIComponent(event.location || "")}`;

      window.open(calendarUrl, "_blank");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "confirmed":
        return "status-confirmed";
      case "declined":
        return "status-declined";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="user-tour-requests">
        <div className="loading">Loading your tour requests...</div>
      </div>
    );
  }

  return (
    <div className="user-tour-requests">
      <div className="section-header">
        <h2>My Tour Requests</h2>
        <p>Track your property tour requests and their status</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {tourRequests.length === 0 ? (
        <div className="no-requests">
          <div className="no-requests-icon">📅</div>
          <h3>No tour requests yet</h3>
          <p>Start exploring properties and request tours to see them here.</p>
        </div>
      ) : (
        <div className="requests-list">
          {tourRequests.map((request) => (
            <div
              key={request.id}
              className={`request-card ${
                request.status === "completed" || request.status === "cancelled"
                  ? "completed"
                  : ""
              }`}
            >
              <div className="request-header">
                <div className="property-info">
                  <h4>{request.property?.title || "Property"}</h4>
                  <p className="property-address">
                    {request.property?.address}, {request.property?.city}
                  </p>
                </div>
                <div
                  className={`status-badge ${getStatusClass(request.status)}`}
                >
                  {request.status.toUpperCase()}
                </div>
              </div>

              <div className="request-details">
                <div className="detail-row">
                  <div className="detail-group">
                    <label>
                      {request.status === "confirmed"
                        ? "Confirmed Tour Date"
                        : "Preferred Tour Date"}
                    </label>
                    <div className="detail-value">
                      📅{" "}
                      {request.status === "confirmed" && request.confirmedDate
                        ? formatDate(request.confirmedDate)
                        : formatDate(request.preferredDate)}
                    </div>
                  </div>
                  <div className="detail-group">
                    <label>
                      {request.status === "confirmed"
                        ? "Confirmed Time"
                        : "Preferred Time"}
                    </label>
                    <div className="detail-value">
                      🕐{" "}
                      {request.status === "confirmed" && request.confirmedTime
                        ? formatTime(request.confirmedTime)
                        : formatTime(request.preferredTime)}
                    </div>
                  </div>
                </div>

                {request.message && (
                  <div className="detail-group">
                    <label>Your Message</label>
                    <div className="message-content">{request.message}</div>
                  </div>
                )}

                <div className="detail-group">
                  <label>Requested</label>
                  <div className="detail-value">
                    {formatDate(request.createdAt)}
                  </div>
                </div>
              </div>

              {request.status === "confirmed" && (
                <div className="confirmation-info">
                  <div className="confirmation-header">
                    <span className="confirmation-icon">✅</span>
                    <strong>Tour Confirmed!</strong>
                  </div>
                  <p>
                    Your tour has been confirmed for{" "}
                    <strong>
                      {formatDate(request.confirmedDate)} at{" "}
                      {formatTime(request.confirmedTime)}
                    </strong>
                    . The agency will contact you shortly with additional
                    details.
                  </p>
                  <div className="agency-contact">
                    <strong>Contact:</strong>{" "}
                    {request.agency?.agencyName || request.agency?.username}
                    {request.agency?.phone && ` (${request.agency.phone})`}
                  </div>
                </div>
              )}

              {request.status === "declined" && request.declineReason && (
                <div className="decline-info">
                  <div className="decline-header">
                    <span className="decline-icon">❌</span>
                    <strong>Tour Declined</strong>
                  </div>
                  <p>
                    <strong>Reason:</strong> {request.declineReason}
                  </p>
                </div>
              )}

              <div className="request-footer">
                <div className="agency-info">
                  <span>Agency: </span>
                  <strong>
                    {request.agency?.agencyName ||
                      request.agency?.username ||
                      "Unknown Agency"}
                  </strong>
                </div>
                <div className="request-actions">
                  {request.status === "pending" && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelRequest(request.id)}
                    >
                      ❌ Cancel Request
                    </button>
                  )}

                  {request.status === "confirmed" && (
                    <>
                      <button
                        className="calendar-btn"
                        onClick={() => handleAddToCalendar(request)}
                      >
                        📅 Add to Calendar
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancelRequest(request.id)}
                      >
                        ❌ Cancel
                      </button>
                    </>
                  )}

                  {(request.status === "completed" ||
                    request.status === "declined" ||
                    request.status === "cancelled") && (
                    <button className="disabled-btn" disabled>
                      Cancelled
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
