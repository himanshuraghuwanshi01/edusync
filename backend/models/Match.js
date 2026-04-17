import { supabase } from '../config/supabase.js';

export const Match = {
  async findByUsers(user1Id, user2Id) {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(matchData) {
    const { data, error } = await supabase
      .from('matches')
      .insert([matchData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(matchId, status) {
    const { data, error } = await supabase
      .from('matches')
      .update({ status, updated_at: new Date() })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserMatches(userId) {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (error) throw error;
    return data;
  },
};
