import { useState, useEffect } from "react";
import apiRequest from "../../components/lib/apiRequest";
import "./agencyDashboard.scss";

export default function AgencyDashboard({ currentUser }) {
  const [tourRequests, setTourRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [error, setError] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [selectedDeclineId, setSelectedDeclineId] = useState(null);
  const [confirmCompleteId, setConfirmCompleteId] = useState(null);

  useEffect(() => {
    fetchTourRequests();
  }, []);

  const fetchTourRequests = async () => {
    try {
      const response = await apiRequest.get("/tours/agency");
      setTourRequests(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tour requests");
    } finally {
      setLoading(false);
    }
  };

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 4000);
  };

  const handleUpdateRequest = async (requestId, updateData) => {
    try {
      const response = await apiRequest.put(`/tours/${requestId}`, updateData);

      setTourRequests((prev) =>
        prev.map((request) =>
          request.id === requestId ? response.data : request
        )
      );

      showPopup("Tour request updated successfully.");
    } catch (err) {
      console.error(err);
      showPopup("Failed to update tour request.");
    }
  };

  const handleAcceptRequest = (request) => {
    handleUpdateRequest(request.id, {
      status: "confirmed",
      confirmedDate: request.preferredDate,
      confirmedTime: request.preferredTime,
    });
  };

  const handleDeclineRequest = (requestId) => {
    setSelectedDeclineId(requestId);
    setShowDeclineModal(true);
  };

  const submitDeclineReason = () => {
    if (declineReason.trim()) {
      handleUpdateRequest(selectedDeclineId, {
        status: "declined",
        declineReason,
      });
      setDeclineReason("");
      setSelectedDeclineId(null);
      setShowDeclineModal(false);
    } else {
      showPopup("Please enter a decline reason.");
    }
  };

  const handleCompleteRequest = (requestId) => {
    setConfirmCompleteId(requestId);
  };

  const confirmComplete = () => {
    handleUpdateRequest(confirmCompleteId, {
      status: "completed",
    });
    setConfirmCompleteId(null);
  };

  const cancelComplete = () => {
    setConfirmCompleteId(null);
  };

  const filteredRequests = tourRequests.filter((request) => {
    if (statusFilter !== "all" && request.status !== statusFilter) return false;
    if (dateFilter && request.preferredDate !== dateFilter) return false;
    return true;
  });

  const stats = {
    pending: tourRequests.filter((r) => r.status === "pending").length,
    confirmed: tourRequests.filter((r) => r.status === "confirmed").length,
    thisWeek: tourRequests.filter((r) => {
      const requestDate = new Date(r.preferredDate);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return requestDate >= now && requestDate <= weekFromNow;
    }).length,
    declined: tourRequests.filter((r) => r.status === "declined").length,
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
      <div className="agency-dashboard">
        <div className="loading">Loading tour requests...</div>
      </div>
    );
  }

  return (
    <div className="agency-dashboard">
      <div className="dashboard-header">
        <h1>Tour Requests Dashboard</h1>
        <p>Manage tour requests for your properties</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {popupMessage && <div className="popup-message">{popupMessage}</div>}

      <div className="stats-grid">
        <div className="stat-card pending">
          <div className="stat-icon">🕐</div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card confirmed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.confirmed}</h3>
            <p>Confirmed</p>
          </div>
        </div>
        <div className="stat-card thisweek">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.thisWeek}</h3>
            <p>This Week</p>
          </div>
        </div>
        <div className="stat-card declined">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{stats.declined}</h3>
            <p>Declined</p>
          </div>
        </div>
      </div>

      <div className="filters">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="declined">Declined</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <div className="requests-container">
        <h2>Recent Tour Requests</h2>

        {filteredRequests.length === 0 ? (
          <div className="no-requests">
            <div className="no-requests-icon">📅</div>
            <h3>No tour requests</h3>
            <p>
              {statusFilter !== "all" || dateFilter
                ? "No tour requests match your current filters."
                : "You haven't received any tour requests yet."}
            </p>
          </div>
        ) : (
          <div className="requests-list">
            {filteredRequests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <div className="client-info">
                    <div className="client-avatar">
                      {request.client?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="client-details">
                      <h4>{request.client?.username || "Unknown Client"}</h4>
                      <p>{request.client?.email || "No email provided"}</p>
                    </div>
                    <div
                      className={`status-badge ${getStatusClass(
                        request.status
                      )}`}
                    >
                      {request.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="request-content">
                  <h5>{request.property?.title || "Property"}</h5>
                  {request.message && (
                    <p className="request-message">{request.message}</p>
                  )}
                  <div className="request-details">
                    <div className="detail-item">
                      <span className="icon">📅</span>
                      <span>{formatDate(request.preferredDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">🕐</span>
                      <span>{formatTime(request.preferredTime)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">📞</span>
                      <span>{request.contactPhone}</span>
                    </div>
                  </div>
                  {request.status === "confirmed" && request.confirmedDate && (
                    <div className="confirmation-info">
                      <strong>Confirmed for:</strong>{" "}
                      {formatDate(request.confirmedDate)} at{" "}
                      {formatTime(request.confirmedTime)}
                    </div>
                  )}
                  {request.status === "declined" && request.declineReason && (
                    <div className="decline-info">
                      <strong>Decline reason:</strong> {request.declineReason}
                    </div>
                  )}
                </div>

                <div className="request-actions">
                  {request.status === "pending" && (
                    <>
                      <button
                        className="accept-btn"
                        onClick={() => handleAcceptRequest(request)}
                      >
                        ✅ Accept
                      </button>
                      <button
                        className="decline-btn"
                        onClick={() => handleDeclineRequest(request.id)}
                      >
                        ❌ Decline
                      </button>
                    </>
                  )}
                  {request.status === "confirmed" && (
                    <>
                      <button className="contact-btn">📞 Contact</button>
                      <button
                        className="complete-btn"
                        onClick={() => handleCompleteRequest(request.id)}
                      >
                        ✅ Complete
                      </button>
                    </>
                  )}
                  {(request.status === "completed" ||
                    request.status === "declined") && (
                    <button className="disabled-btn" disabled>
                      {request.status === "completed"
                        ? "✅ Completed"
                        : "❌ Declined"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeclineModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Decline Tour Request</h3>
            <textarea
              placeholder="Enter reason for declining..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn btn-submit" onClick={submitDeclineReason}>
                📨 Submit
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => setShowDeclineModal(false)}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmCompleteId && (
        <div className="modal">
          <div className="modal-content">
            <h3>Mark as Completed?</h3>
            <p>Are you sure you want to mark this tour request as completed?</p>
            <div className="modal-actions">
              <button className="btn btn-confirm" onClick={confirmComplete}>
                ✅ Yes
              </button>
              <button className="btn btn-cancel" onClick={cancelComplete}>
                ❌ No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
