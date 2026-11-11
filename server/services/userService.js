import User from "../models/User.js";
import mongoose from "mongoose";

// Get all users
export const getAllUsersService = async () => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  return users;
};

// Get user by ID
export const getUserByIdService = async (userId) => {
  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Update user profile
export const updateUserService = async (userId, data) => {
  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  // Allowed fields
  const allowedFields = ["name", "phone"];

  const updateData = {};

  // Pick only allowed fields
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  // Check empty update
  if (Object.keys(updateData).length === 0) {
    throw new Error("Please provide at least one field to update");
  }

  // Validate name
  if (updateData.name !== undefined) {
    if (
      typeof updateData.name !== "string" ||
      updateData.name.trim().length < 2
    ) {
      throw new Error("Name must contain at least 2 characters");
    }

    if (updateData.name.trim().length > 80) {
      throw new Error("Name cannot exceed 80 characters");
    }

    updateData.name = updateData.name.trim();
  }

  // Validate phone
  if (updateData.phone !== undefined) {
    if (typeof updateData.phone !== "string" || !updateData.phone.trim()) {
      throw new Error("Please enter a valid phone number");
    }

    updateData.phone = updateData.phone.trim();
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    {
      returnDocument: "after",
    },
  ).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Deactivate user
export const deleteUserService = async (userId) => {
  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  // Soft delete user
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        isActive: false,
      },
    },
    {
      returnDocument: "after",
    },
  ).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
