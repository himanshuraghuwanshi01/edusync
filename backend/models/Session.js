import { supabase } from '../config/supabase.js';

export const Session = {
  async create(sessionData) {
    const { data, error } = await supabase
      .from('sessions')
      .insert([sessionData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async findActiveByMatch(matchId) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('match_id', matchId)
      .eq('status', 'active')
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async findActiveByUser(userId) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, match:matches(*)')
      .or(`participants_ids? contains {${userId}}`) // Alternative: use a join with participants table
      .eq('status', 'active')
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async endSession(sessionId) {
    const { data, error } = await supabase
      .from('sessions')
      .update({ status: 'completed', end_time: new Date() })
      .eq('id', sessionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addMessage(sessionId, message) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ session_id: sessionId, ...message }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addFeedback(sessionId, feedback) {
    const { data, error } = await supabase
      .from('feedback')
      .insert([{ session_id: sessionId, ...feedback }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};