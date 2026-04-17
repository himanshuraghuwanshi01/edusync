import express from "express";
import { User } from "../models/User.js";
import { generateUserEmbedding } from "../utils/ollamaClient.js";
import { supabase } from "../config/supabase.js";

const router = express.Router();

import { requireAuth } from "../middleware/auth.js";

// ✅ REGISTER/LOGIN USER (Full profile)
router.post("/", async (req, res) => {
  try {
    const { name, email, bio, subjects, availability, learningStyle } = req.body;

    console.log("📝 Signup request received:", { name, email, subjects: subjects?.length || 0, availability: availability?.length || 0 });

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    if (!name) {
      return res.status(400).json({ error: "Name required" });
    }

    // Check if user already exists
    let user = await User.findByEmail(email);

    if (user) {
      console.log("👤 User already exists:", email);
      return res.json(user);
    }

    console.log("✨ Creating new user:", email);
    // Create new user with full profile
    user = await User.create({
      name,
      email,
      bio,
      subjects,
      availability,
      learningStyle
    });

    console.log("✅ User created successfully:", user.id);
    res.json(user);
  } catch (error) {
    console.error("❌ Signup error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET PROFILE
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    console.error("❌ Get profile error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ UPDATE PROFILE
router.put("/profile", requireAuth, async (req, res) => {
  try {
    const updates = req.body;

    if (updates.bio || updates.subjects || updates.learning_style) {
      const embedding = await generateUserEmbedding({
        bio: updates.bio || req.user.bio,
        subjects: updates.subjects || req.user.subjects,
        learningStyle: updates.learning_style || req.user.learning_style,
      });
      if (embedding) updates.embedding = embedding;
    }

    if (updates.subjects) {
      await supabase.from("subjects").delete().eq("user_id", req.user.id);
      const newSubjects = updates.subjects.map((s) => ({
        user_id: req.user.id,
        name: s.name,
        level: s.level,
      }));
      await supabase.from("subjects").insert(newSubjects);
      delete updates.subjects;
    }

    if (updates.availability) {
      await supabase.from("availability").delete().eq("user_id", req.user.id);
      const newAvail = updates.availability.map((a) => ({
        user_id: req.user.id,
        day: a.day,
        start_time: a.startTime,
        end_time: a.endTime,
      }));
      await supabase.from("availability").insert(newAvail);
      delete updates.availability;
    }

    const user = await User.update(req.user.id, updates);
    res.json(user);
  } catch (error) {
    console.error("❌ Update profile error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// ✅ GET USER BY ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("❌ Get user error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
