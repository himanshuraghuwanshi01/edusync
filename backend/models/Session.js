import { supabase } from '../config/supabase.js';

export const Session = {
  async findActiveByMatch(matchId) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('match_id', matchId)
      .is('ended_at', null)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async findActiveByUser(userId) {
    const { data: matches } = await supabase
      .from('matches')
      .select('id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (!matches || matches.length === 0) return null;

    const matchIds = matches.map(m => m.id);

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .in('match_id', matchIds)
      .is('ended_at', null)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(sessionData) {
    const { data, error } = await supabase
      .from('sessions')
      .insert([{
        match_id: sessionData.match_id,
        started_at: new Date().toISOString(),
        notes: sessionData.notes || null
      }])
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Session created:', data.id);
    return data;
  },

  async endSession(id) {
    const { data, error } = await supabase
      .from('sessions')
      .update({ 
        ended_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    console.log('❌ Session ended:', id);
    return data;
  },

  async getSessionMessages(sessionId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }
};
