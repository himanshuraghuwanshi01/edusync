import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/**
 * Middleware to verify JWT token and attach user to request
 * Supports multiple auth methods:
 * 1. Bearer token in Authorization header
 * 2. x-user-id header (for development)
 * 3. userId in query or body
 */
export async function requireAuth(req, res, next) {
  try {
    let userId = null;

    // Method 1: Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      // For demo: store user info with token or verify against DB
      // TODO: Implement proper JWT verification
      req.token = token;
      userId = req.headers["x-user-id"] || req.query.userId || req.body.userId;
    }

    // Method 2: x-user-id header (dev/testing)
    if (!userId) {
      userId = req.headers["x-user-id"] || req.query.userId || req.body.userId;
    }

    if (!userId) {
      return res.status(401).json({ 
        error: "Unauthorized - Missing authentication" 
      });
    }

    // Fetch user from database
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ 
        error: "Unauthorized - User not found" 
      });
    }

    // Fetch user relations
    const { data: subjects } = await supabase
      .from("subjects")
      .select("*")
      .eq("user_id", userId);

    const { data: availability } = await supabase
      .from("availability")
      .select("*")
      .eq("user_id", userId);

    // Attach user to request
    req.user = {
      ...user,
      subjects: subjects || [],
      availability: availability || [],
    };

    next();
  } catch (error) {
    console.error("❌ Auth error:", error);
    return res.status(401).json({ 
      error: "Unauthorized" 
    });
  }
}

/**
 * Optional auth - doesn't require user but attaches if present
 */
export async function optionalAuth(req, res, next) {
  try {
    const userId =
      req.headers["x-user-id"] || req.query.userId || req.body.userId;

    if (userId) {
      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    console.error("❌ Optional auth error:", error);
    next();
  }
}
