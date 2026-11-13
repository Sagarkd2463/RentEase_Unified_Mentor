import express from "express";

import {
  listCategories,
  listAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route
router.get("/", listCategories);

// Admin routes
router.use(authenticateUser, authorizeRoles("admin"));

router.get("/admin/all", listAllCategories);

router.post("/", createCategory);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

export default router;
