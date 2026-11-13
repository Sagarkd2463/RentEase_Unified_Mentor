import {
  getCartService,
  addCartItemService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
} from "../services/cartService.js";

// GET /api/cart
export const getCart = async (req, res) => {
  const cart = await getCartService(req.user._id);

  res.status(200).json({
    success: true,
    data: cart,
  });
};

// POST /api/cart/items
export const addCartItem = async (req, res) => {
  const { productId, tenureMonths, quantity = 1 } = req.body;

  const cart = await addCartItemService(
    req.user._id,
    productId,
    tenureMonths,
    quantity,
  );

  res.status(201).json({
    success: true,
    message: "Product added to cart successfully",
    data: cart,
  });
};

// PATCH /api/cart/items/:productId
export const updateCartItem = async (req, res) => {
  const cart = await updateCartItemService(
    req.user._id,
    req.params.productId,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Cart item updated successfully",
    data: cart,
  });
};

// DELETE /api/cart/items/:productId
export const removeCartItem = async (req, res) => {
  const cart = await removeCartItemService(req.user._id, req.params.productId);

  res.status(200).json({
    success: true,
    message: "Product removed from cart successfully",
    data: cart,
  });
};

// DELETE /api/cart
export const clearCart = async (req, res) => {
  await clearCartService(req.user._id);

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
  });
};
