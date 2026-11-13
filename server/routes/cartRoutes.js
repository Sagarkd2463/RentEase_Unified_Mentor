import express from "express";

import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer authentication
router.use(authenticateUser, authorizeRoles("customer"));

// Get cart
router.get("/", getCart);

// Add product to cart
router.post("/items", addCartItem);

// Update cart item
router.patch("/items/:productId", updateCartItem);

// Remove product from cart
router.delete("/items/:productId", removeCartItem);

// Clear cart
router.delete("/", clearCart);

export default router;
