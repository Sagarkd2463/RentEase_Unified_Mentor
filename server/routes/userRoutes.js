import express from "express";

import {
  getAllUsers,
  getUserById,
  getMyProfile,
  updateMyProfile,
  deleteUser,
} from "../controllers/userController.js";

import { authenticateUser, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/me", authenticateUser, getMyProfile);

// Update logged-in user's profile
router.put("/me", authenticateUser, updateMyProfile);

// Admin: Get all users
router.get("/", authenticateUser, adminOnly, getAllUsers);

// Admin: Get user by ID
router.get("/:id", authenticateUser, adminOnly, getUserById);

// Admin: Deactivate user
router.delete("/:id", authenticateUser, adminOnly, deleteUser);

export default router;
