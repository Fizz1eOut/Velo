import { useSupabaseClient } from '#imports';
import type { Profile } from '~/interface/profile.interface';

export const searchUsers = async (
  query: string
): Promise<{ data: Profile[] | null; error: unknown }> => {
  const supabase = useSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) return { data: null, error: new Error('Not authenticated') };
  if (!query.trim()) return { data: [], error: null };

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, status, last_seen')
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
    .neq('id', user.id)
    .limit(10);

  console.log('searchUsers result:', { data, error, query });
  return { data, error };
};
