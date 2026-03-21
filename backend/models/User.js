import { supabase } from '../config/supabase.js';

export const User = {
  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async findByFirebaseUid(uid) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', uid)
      .maybeSingle(); // returns null if not found
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async findCandidates(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .neq('id', userId)
      .limit(100);
    if (error) throw error;
    return data;
  }
};