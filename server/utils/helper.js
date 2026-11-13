import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import slugify from "slugify";

// Validate MongoDB ObjectId
export const validateId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw Error("Invalid product ID");
  }
};

// Generate slug
export const generateSlug = (name) => {
  const slug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  if (!slug) {
    throw Error("Category name must contain valid characters");
  }

  return slug;
};

// Validate category name
export const validateName = (name) => {
  if (typeof name !== "string" || !name.trim()) {
    throw Error("Category name is required");
  }

  const trimmedName = name.trim();

  if (trimmedName.length > 100) {
    throw Error("Category name cannot exceed 100 characters");
  }

  return trimmedName;
};

// Get populated cart
export const getPopulatedCart = async (userId) => {
  return Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select:
      "name slug images monthlyRent securityDeposit rentalPlans availableQuantity category status",
    populate: {
      path: "category",
      select: "name",
    },
  });
};

// Get existing cart or create a new one
export const getOrCreateCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    try {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    } catch (error) {
      // Handle simultaneous cart creation
      if (error.code !== 11000) throw error;

      cart = await Cart.findOne({ user: userId });
    }
  }

  return cart;
};

// Validate product and rental tenure
export const validateProduct = async (productId, tenureMonths) => {
  if (!mongoose.isValidObjectId(productId)) {
    throw Error("Invalid product ID");
  }

  const tenure = Number(tenureMonths);

  if (!Number.isSafeInteger(tenure) || tenure < 1) {
    throw Error("Rental tenure must be a positive integer");
  }

  const product = await Product.findById(productId);

  if (!product || product.status !== "active") {
    throw Error("Product not found or unavailable");
  }

  const rentalPlan = product.rentalPlans.find(
    (plan) => plan.tenureMonths === tenure,
  );

  if (!rentalPlan) {
    throw Error("Selected rental tenure is not available");
  }

  return product;
};

// Validate quantity
export const validateQuantity = (quantity) => {
  const qty = Number(quantity);

  if (!Number.isSafeInteger(qty) || qty < 1) {
    throw Error("Quantity must be a positive integer");
  }

  return qty;
};
