import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';

export const checkBlockStatus = async (
  otherUserId: string
): Promise<{ blockedByMe: boolean; blockedByThem: boolean }> => {
  const supabase = useSupabaseClient<Database>();

  const [{ data: myBlockRow }, { data: blockedByThem }] = await Promise.all([
    supabase
      .from('blocked_users')
      .select('id')
      .eq('blocker_id', (await supabase.auth.getUser()).data.user?.id ?? '')
      .eq('blocked_id', otherUserId)
      .maybeSingle(),
    supabase.rpc('am_i_blocked_by', { other_id: otherUserId }),
  ]);

  return {
    blockedByMe: !!myBlockRow,
    blockedByThem: !!blockedByThem,
  };
};
