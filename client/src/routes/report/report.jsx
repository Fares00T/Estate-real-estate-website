import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Snackbar,
} from "@mui/material";

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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate(); // useNavigate hook

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
    if (formData.screenshot) {
      data.append("screenshot", formData.screenshot);
    }

    try {
      const res = await axios.post("http://localhost:8800/api/report", data);
      setFeedback("Your report has been successfully submitted.");
      setOpenSnackbar(true); // Show Snackbar on success

      // Navigate to home after 10 seconds
      setTimeout(() => {
        navigate("/"); // Redirect to home page
      }, 1000);
    } catch (err) {
      setFeedback("Failed to submit the report. Please try again.");
      setOpenSnackbar(true); // Show Snackbar on error
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        minHeight: "100vh",
        overflowY: "auto",
        backgroundColor: "white",
      }}
    >
      <Paper elevation={3} sx={{ p: 2, maxWidth: 1000, width: "100%" }}>
        <Typography variant="h5" gutterBottom>
          Report a Post or User
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <FormControl fullWidth sx={{ flex: "1 1 45%" }}>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              label="Report Type"
              name="reportType"
            >
              <MenuItem value="post">Post</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>

          {reportType === "post" && (
            <TextField
              name="reportedPostId"
              label="Reported Post ID"
              fullWidth
              sx={{ flex: "1 1 45%" }}
              value={formData.reportedPostId}
              onChange={handleChange}
              required
            />
          )}

          {reportType === "user" && (
            <TextField
              name="reportedUser"
              label="Reported Username or ID"
              fullWidth
              sx={{ flex: "1 1 45%" }}
              value={formData.reportedUser}
              onChange={handleChange}
              required
            />
          )}

          <TextField
            name="reason"
            label="Reason"
            fullWidth
            sx={{ flex: "1 1 45%" }}
            value={formData.reason}
            onChange={handleChange}
            required
          />

          <TextField
            name="details"
            label="Additional Details"
            multiline
            rows={4}
            fullWidth
            sx={{ flex: "1 1 100%" }}
            value={formData.details}
            onChange={handleChange}
          />

          <TextField
            name="submittedBy"
            label="Your Name"
            fullWidth
            sx={{ flex: "1 1 45%" }}
            value={formData.submittedBy}
            onChange={handleChange}
            required
          />

          <TextField
            name="submittedEmail"
            label="Your Email"
            type="email"
            fullWidth
            sx={{ flex: "1 1 45%" }}
            value={formData.submittedEmail}
            onChange={handleChange}
            required
          />

          <Box
            sx={{ display: "flex", flexDirection: "column", flex: "1 1 100%" }}
          >
            <Button variant="contained" component="label">
              Upload Screenshot (optional)
              <input
                type="file"
                name="screenshot"
                hidden
                accept="image/*"
                onChange={handleChange}
              />
            </Button>
            {formData.screenshot && (
              <Typography variant="body2" mt={1}>
                Selected: {formData.screenshot.name}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="error"
              sx={{ flex: "1 1 100%", mt: 1 }}
            >
              Submit Report
            </Button>
          </Box>
        </Box>

        {/* Snackbar to show feedback message */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message={feedback}
        />
      </Paper>
    </Box>
  );
}
