import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
  profilePosts,
  getNotificationNumber,
  getAgency,
  getUserStatistics,
  bulkDeleteUsers,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getUsers);
//router.get("/search/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);
router.get("/agency", getAgency);
// Add these lines to user.route.js
router.get("/statistics", verifyToken, getUserStatistics);
router.delete("/bulk", verifyToken, bulkDeleteUsers);
export default router;
