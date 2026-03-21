import { supabase } from '../config/supabase.js';

export const Match = {
  async create(matchData) {
    const { data, error } = await supabase
      .from('matches')
      .insert([matchData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async findByUsers(user1Id, user2Id) {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateStatus(matchId, status) {
    const { data, error } = await supabase
      .from('matches')
      .update({ status })
      .eq('id', matchId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getUserMatches(userId) {
    const { data, error } = await supabase
      .from('matches')
      .select('*, user1:users!matches_user1_id_fkey(*), user2:users!matches_user2_id_fkey(*)')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('status', 'accepted');
    if (error) throw error;
    return data;
  }
};