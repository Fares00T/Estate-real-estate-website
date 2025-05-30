import express from "express";
import {
  createTourRequest,
  getTourRequestsByClient,
  getTourRequestsByAgency,
  updateTourRequest,
  deleteTourRequest,
} from "../controllers/tour.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Create a new tour request (clients only)
router.post("/", verifyToken, createTourRequest);

// Get tour requests by client (for user profile)
router.get("/client", verifyToken, getTourRequestsByClient);

// Get tour requests by agency (for agency dashboard)
router.get("/agency", verifyToken, getTourRequestsByAgency);

// Update tour request status (agencies can confirm/decline, clients can cancel)
router.put("/:id", verifyToken, updateTourRequest);

// Delete tour request (clients only)
router.delete("/:id", verifyToken, deleteTourRequest);

export default router;
