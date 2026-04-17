import { supabase } from "../config/supabase.js";

export const User = {
  // ✅ Find user by ID with all relations
  async findById(id) {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    // Fetch subjects and availability
    const { data: subjects } = await supabase
      .from("subjects")
      .select("*")
      .eq("user_id", id);

    const { data: availability } = await supabase
      .from("availability")
      .select("*")
      .eq("user_id", id);

    return {
      ...user,
      subjects: subjects || [],
      availability: availability || [],
    };
  },

  // ✅ Find user by Email
  async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // ✅ CREATE USER (REGISTER) WITH FULL PROFILE
  async create(userData) {
    // 1. Create base user
    const insertData = {
      name: userData.name,
      email: userData.email,
      bio: userData.bio || null,
      learning_style: userData.learningStyle || null,
    };

    if (userData.id) insertData.id = userData.id;

    const { data: user, error: userError } = await supabase
      .from("users")
      .insert([insertData])
      .select()
      .single();

    if (userError) throw userError;

    let subjects = [];
    let availability = [];

    // 2. Add subjects if provided
    if (userData.subjects && userData.subjects.length > 0) {
      const subjectInserts = userData.subjects.map((s) => ({
        user_id: user.id,
        name: s.name,
        level: s.proficiency || s.level,
      }));
      const { data: insertedSubjects } = await supabase
        .from("subjects")
        .insert(subjectInserts)
        .select();
      subjects = insertedSubjects || [];
    }

    // 3. Add availability if provided
    if (userData.availability && userData.availability.length > 0) {
      const availInserts = userData.availability.map((a) => ({
        user_id: user.id,
        day: a.day,
        start_time: a.startTime,
        end_time: a.endTime,
      }));
      const { data: insertedAvail } = await supabase
        .from("availability")
        .insert(availInserts)
        .select();
      availability = insertedAvail || [];
    }

    return {
      ...user,
      subjects,
      availability,
    };
  },

  // ✅ Update user
  async update(id, updates) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Fetch full user data with relations
    return await this.findById(id);
  },

  // ✅ Get other users (for matching)
  async findCandidates(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .neq("id", userId)
      .limit(100);

    if (error) throw error;
    return data;
  },
};
