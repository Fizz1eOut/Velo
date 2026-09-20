import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';

export const updateStatus = async (status: 'online' | 'offline'): Promise<{ error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };

  const { error } = await supabase
    .from('profiles')
    .update({
      status,
      last_seen: new Date().toISOString(),
    })
    .eq('id', user.id);

  return { error };
};
