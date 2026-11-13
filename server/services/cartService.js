import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import {
  getOrCreateCart,
  getPopulatedCart,
  validateId,
  validateProduct,
  validateQuantity,
} from "../utils/helper.js";

// Get customer cart
export const getCartService = async (userId) => {
  await getOrCreateCart(userId);

  return getPopulatedCart(userId);
};

// Add product to cart
export const addCartItemService = async (
  userId,
  productId,
  tenureMonths,
  quantity = 1,
) => {
  const qty = validateQuantity(quantity);

  const product = await validateProduct(productId, tenureMonths);

  if (qty > product.availableQuantity) {
    throw Error("Requested quantity exceeds available stock");
  }

  const cart = await getOrCreateCart(userId);

  // Check whether product already exists
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + qty;

    if (newQuantity > product.availableQuantity) {
      throw Error("Requested new quantity exceeds available stock");
    }

    existingItem.quantity = newQuantity;
    existingItem.tenureMonths = Number(tenureMonths);
  } else {
    cart.items.push({
      product: productId,
      tenureMonths: Number(tenureMonths),
      quantity: qty,
    });
  }

  await cart.save();

  return getPopulatedCart(userId);
};

// Update cart item
export const updateCartItemService = async (userId, productId, updates) => {
  validateId(productId);

  const { quantity, tenureMonths } = updates;

  // Reject empty update
  if (quantity === undefined && tenureMonths === undefined) {
    throw Error("Provide quantity or rental tenure to update");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw Error("Cart not found");
  }

  const item = cart.items.find(
    (entry) => entry.product.toString() === productId,
  );

  if (!item) {
    throw Error("Cart item not found");
  }

  const product = await Product.findById(productId);

  if (!product || product.status !== "active") {
    throw Error("Product is no longer available");
  }

  // Update quantity
  if (quantity !== undefined) {
    item.quantity = validateQuantity(quantity);
  }

  // Update rental tenure
  if (tenureMonths !== undefined) {
    const tenure = Number(tenureMonths);

    if (!Number.isSafeInteger(tenure) || tenure < 1) {
      throw Error("Rental tenure must be a positive integer");
    }

    const plan = product.rentalPlans.find((p) => p.tenureMonths === tenure);

    if (!plan) {
      throw Error("Selected rental tenure is not available");
    }

    item.tenureMonths = tenure;
  }

  // Check current available stock
  if (item.quantity > product.availableQuantity) {
    throw Error("Requested current quantity exceeds available stock");
  }

  await cart.save();

  return getPopulatedCart(userId);
};

// Remove product from cart
export const removeCartItemService = async (userId, productId) => {
  validateId(productId);

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw Error("Cart not found");
  }

  const oldLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  if (oldLength === cart.items.length) {
    throw Error("Cart item not found");
  }

  await cart.save();

  return getPopulatedCart(userId);
};

// Clear entire cart
export const clearCartService = async (userId) => {
  const cart = await getOrCreateCart(userId);

  cart.items = [];

  await cart.save();

  return cart;
};
