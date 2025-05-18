import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Use memory storage for attachments
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Report route
router.post(
  "/",
  upload.single("screenshot"), // optional screenshot upload
  async (req, res) => {
    try {
      const {
        reportType, // "user" or "post"
        reportedUser,
        reportedPostId,
        reason,
        details,
        submittedBy,
        submittedEmail,
      } = req.body;

      const screenshot = req.file;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"Real Estate App Reports" <${process.env.EMAIL_USER}>`,
        to: process.env.REPORT_RECEIVER_EMAIL || process.env.EMAIL_USER,
        subject: `⚠️ Report - ${reportType.toUpperCase()} | Submitted by ${submittedBy}`,
        html: `
          <b>Report Type:</b> ${reportType}<br/>
          ${
            reportType === "user"
              ? `<b>Reported User:</b> ${reportedUser}<br/>`
              : ""
          }
          ${
            reportType === "post"
              ? `<b>Reported Post ID:</b> ${reportedPostId}<br/>`
              : ""
          }
          <b>Submitted By:</b> ${submittedBy} (${submittedEmail})<br/>
          <b>Reason:</b> ${reason}<br/>
          <b>Details:</b> ${details || "N/A"}<br/>
        `,
        attachments: screenshot
          ? [
              {
                filename: screenshot.originalname,
                content: screenshot.buffer,
              },
            ]
          : [],
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json("Report submitted successfully.");
    } catch (err) {
      console.error(err);
      res.status(500).json("Failed to submit report.");
    }
  }
);

export default router;
