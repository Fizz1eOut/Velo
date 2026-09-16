import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';
import type { Profile } from '~/interface/profile.interface';

export const getProfile = async (
  userId?: string
): Promise<{ data: Profile | null; error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  let targetId = userId;

  if (!targetId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return { data: null, error: new Error('Not authenticated') };
    targetId = user.id;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, bio, status, last_seen')
    .eq('id', targetId)
    .single();

  return { data: data as Profile | null, error };
};
