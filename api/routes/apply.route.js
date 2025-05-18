import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Memory storage (for attaching to emails)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle form + files
router.post(
  "/",
  upload.fields([
    { name: "license" },
    { name: "registrationPaper" },
    { name: "idProof" },
  ]),
  async (req, res) => {
    try {
      const data = req.body;
      const files = req.files;

      // Create mail transporter
      const transporter = nodemailer.createTransport({
        service: "gmail", // or "hotmail", etc.
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"Real Estate App" <${process.env.EMAIL_USER}>`,
        to: data.email,
        subject: `New Agency Application: ${data.agencyName}`,
        text: `
Submitted By: ${data.submittedBy}
Submitted Email: ${data.submittedEmail}
Agency: ${data.agencyName}
Representative: ${data.representativeName}
Email: ${data.email}
Phone: ${data.phone}
Address: ${data.address}
Registration Number: ${data.registrationNumber}
Message: ${data.message || "N/A"}
      `,
        attachments: [
          {
            filename: files.license?.[0]?.originalname,
            content: files.license?.[0]?.buffer,
          },
          {
            filename: files.registrationPaper?.[0]?.originalname,
            content: files.registrationPaper?.[0]?.buffer,
          },
          {
            filename: files.idProof?.[0]?.originalname,
            content: files.idProof?.[0]?.buffer,
          },
        ].filter(Boolean),
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json("Email sent successfully.");
    } catch (err) {
      console.error(err);
      res.status(500).json("Email sending failed.");
    }
  }
);

export default router;
