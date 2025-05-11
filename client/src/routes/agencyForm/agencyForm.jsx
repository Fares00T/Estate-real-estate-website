import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // adjust path if needed

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

  const [submitting, setSubmitting] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      files: {
        ...formData.files,
        [e.target.name]: e.target.files[0],
      },
    });
  };

  const resetForm = () => {
    setFormData({
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "files") {
        form.append(key, formData[key]);
      }
    });

    form.append("license", formData.files.license);
    form.append("registrationPaper", formData.files.registrationPaper);
    form.append("idProof", formData.files.idProof);

    // Attach user data
    form.append("submittedBy", currentUser?.username || "");
    form.append("submittedEmail", currentUser?.email || "");

    try {
      const res = await fetch("http://localhost:8800/api/apply", {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        setSnackOpen(true);
        resetForm();
      } else {
        alert("Failed to submit application.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 700,
        mx: "auto",
        background: "#f9f9f9",
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Agency Application Form
      </Typography>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Grid container spacing={2}>
          {[
            { label: "Agency Name", name: "agencyName" },
            { label: "Representative Name", name: "representativeName" },
            { label: "Email", name: "email", type: "email", half: true },
            { label: "Phone", name: "phone", half: true },
            { label: "Address", name: "address", multiline: true, rows: 2 },
            { label: "Registration Number", name: "registrationNumber" },
          ].map((field, i) => (
            <Grid item xs={field.half ? 6 : 12} key={i}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                multiline={field.multiline || false}
                rows={field.rows || 1}
                type={field.type || "text"}
                required
              />
            </Grid>
          ))}

          {[
            { label: "Business License", name: "license" },
            { label: "Company Registration Paper", name: "registrationPaper" },
            { label: "Representative ID Proof", name: "idProof" },
          ].map((file, i) => (
            <Grid item xs={12} key={i}>
              <InputLabel>{file.label}</InputLabel>
              <input
                type="file"
                name={file.name}
                onChange={handleFileChange}
                required
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes"
              name="message"
              value={formData.message}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackOpen(false)}
          sx={{ width: "100%" }}
        >
          Application submitted! Your request to become an agency is under
          review.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AgencyApplicationForm;
