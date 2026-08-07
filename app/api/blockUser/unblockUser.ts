import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';

export const unblockUser = async (targetId: string): Promise<{ error: unknown }> => {
  const supabase = useSupabaseClient<Database>();
  const { error } = await supabase.rpc('unblock_user', { target_id: targetId });
  return { error };
};
