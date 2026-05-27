import { getSupabaseClientFromContext } from '../lib/supabase.js';

export const dbLayer = {
  /**
   * Get user by email
   */
  async getUserByEmail(context, email) {
    const supabase = getSupabaseClientFromContext(context);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Create user
   */
  async createUser(context, email, hashedPassword) {
    const supabase = getSupabaseClientFromContext(context);
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password_hash: hashedPassword }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Get user profile
   */
  async getUserProfile(context, userId) {
    const supabase = getSupabaseClientFromContext(context);
    const { data, error } = await supabase
      .from('users')
      .select('id, email, created_at')
      .eq('id', userId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Update user profile
   */
  async updateUserProfile(context, userId, updates) {
    const supabase = getSupabaseClientFromContext(context);
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Delete user
   */
  async deleteUser(context, userId) {
    const supabase = getSupabaseClientFromContext(context);
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw new Error(error.message);
    return true;
  },
};