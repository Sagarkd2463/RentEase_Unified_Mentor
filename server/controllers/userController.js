import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "../services/userService.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    const statusCode = error.message === "Invalid user ID" ? 400 : 404;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Get logged-in user's profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await getUserByIdService(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    const statusCode = error.message === "Invalid user ID" ? 400 : 404;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Update logged-in user's profile
export const updateMyProfile = async (req, res) => {
  try {
    const user = await updateUserService(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    const statusCode = error.message === "User not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Deactivate user
export const deleteUser = async (req, res) => {
  try {
    const user = await deleteUserService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      data: user,
    });
  } catch (error) {
    let statusCode = 400;

    if (error.message === "User not found") {
      statusCode = 404;
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
