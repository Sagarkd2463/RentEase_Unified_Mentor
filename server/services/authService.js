import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import generateToken from "../utils/token.js";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register customer or vendor
export const registerService = async (userData) => {
  const { name, email, password, phone } = userData;

  // Default role
  const role = userData.role || "customer";

  // Validate required fields
  if (!name || !email || !password || !phone) {
    throw new Error("Name, email, phone and password are required");
  }

  // Validate name
  if (typeof name !== "string" || name.trim().length < 2) {
    throw new Error("Name must contain at least 2 characters");
  }

  if (name.trim().length > 80) {
    throw new Error("Name cannot exceed 80 characters");
  }

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  // Validate email
  if (!emailRegex.test(normalizedEmail)) {
    throw new Error("Please enter a valid email address");
  }

  // Validate password
  if (typeof password !== "string" || password.length < 10) {
    throw new Error("Password must contain at least 10 characters");
  }

  // Validate phone
  if (typeof phone !== "string" || !phone.trim()) {
    throw new Error("Please enter a valid phone number");
  }

  // Validate role
  if (!["customer", "vendor"].includes(role)) {
    throw new Error("Only customer and vendor roles are allowed");
  }

  // Check existing user
  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await hashPassword(password, 12);

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    phone: phone.trim(),
    role,
  });

  // Generate token
  const token = generateToken(user);

  // Return user details and token
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
};

// Login user
export const loginService = async (email, password) => {
  // Validate required fields
  if (!email?.trim() || !password) {
    throw new Error("Email and password are required");
  }

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  // Validate email
  if (!emailRegex.test(normalizedEmail)) {
    throw new Error("Please enter a valid email address");
  }

  // Find user and include password
  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  // Check user exists
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check active status
  if (!user.isActive) {
    throw new Error("Your account is deactivated");
  }

  // Compare password
  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken(user);

  // Return user details and token
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
};
