import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';

export const blockUser = async (targetId: string): Promise<{ error: unknown }> => {
  const supabase = useSupabaseClient<Database>();
  const { error } = await supabase.rpc('block_user', { target_id: targetId });
  return { error };
};
