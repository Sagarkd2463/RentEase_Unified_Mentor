import { registerService, loginService } from "../services/authService.js";

// Register
export const register = async (req, res) => {
  try {
    const result = await registerService(req.body);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    const statusCode = error.code === 11000 ? 409 : 400;

    return res.status(statusCode).json({
      success: false,
      message:
        error.code === 11000 ? "Email already registered" : error.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginService(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const statusCode =
      error.message === "Your account is deactivated" ? 403 : 401;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
