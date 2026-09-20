import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';
import type { Profile } from '~/interface/profile.interface';

export const searchUsers = async (
  query: string
): Promise<{ data: Profile[] | null; error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) return { data: null, error: new Error('Not authenticated') };
  if (!query.trim()) return { data: [], error: null };

  const { data: blocks } = await supabase
    .from('blocked_users')
    .select('blocker_id, blocked_id')
    .or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`);

  const excludedIds = new Set<string>([user.id]);
  (blocks ?? []).forEach((b) => {
    excludedIds.add(b.blocker_id === user.id ? b.blocked_id : b.blocker_id);
  });

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, status, last_seen')
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
    .not('id', 'in', `(${Array.from(excludedIds).join(',')})`)
    .limit(10);

  return { data: data as Profile[] | null, error };
};
