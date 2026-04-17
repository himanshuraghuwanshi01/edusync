import express from "express";
import crypto from "node:crypto";
import { User } from "../models/User.js";
import { ApiResponse } from "../utils/response.js";
import { registerSchema, loginSchema } from "../utils/schemas.js";

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user with profile information
 */
router.post("/register", async (req, res) => {
  try {
    // Validate request
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      const messages = error.details.map(d => d.message);
      return ApiResponse.validation(res, "Validation failed", messages);
    }

    const { name, email, password, bio, subjects, availability, learningStyle } = value;

    console.log("📝 Register request:", { name, email });

    // Check if user exists
    let existingUser = await User.findByEmail(email);
    if (existingUser) {
      return ApiResponse.conflict(res, "Email already registered");
    }

    // Create user with full profile
    const newUser = await User.create({
      name,
      email,
      bio,
      subjects,
      availability,
      learningStyle,
    });

    // Generate token (simple JWT-like token for demo)
    const token = crypto.randomBytes(32).toString("hex");
    
    console.log("✅ User registered:", newUser.id);
    
    return ApiResponse.created(res, {
      user: newUser,
      token,
    }, "User registered successfully");
  } catch (error) {
    console.error("❌ Register error:", error.message);
    return ApiResponse.serverError(res, error.message, error);
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return token
 */
router.post("/login", async (req, res) => {
  try {
    // Validate request
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      const messages = error.details.map(d => d.message);
      return ApiResponse.validation(res, "Validation failed", messages);
    }

    const { email, password } = value;

    console.log("🔐 Login attempt:", email);

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return ApiResponse.unauthorized(res, "Invalid email or password");
    }

    // For demo: validate password (in production, use bcrypt)
    // TODO: Implement proper password hashing with bcrypt
    if (user.password_hash && user.password_hash !== password) {
      return ApiResponse.unauthorized(res, "Invalid email or password");
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    console.log("✅ Login successful:", user.id);

    return ApiResponse.success(res, {
      user,
      token,
    }, "Login successful");
  } catch (error) {
    console.error("❌ Login error:", error.message);
    return ApiResponse.serverError(res, error.message, error);
  }
});

/**
 * POST /api/auth/logout
 * Logout (clear token on client side)
 */
router.post("/logout", (req, res) => {
  try {
    console.log("🚪 Logout request");
    return ApiResponse.success(res, null, "Logged out successfully");
  } catch (error) {
    return ApiResponse.serverError(res, error.message);
  }
});

export default router;
