import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';

export const markMessagesAsRead = async (
  chatId: string
): Promise<{ error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  const { error } = await supabase.rpc('mark_chat_as_read', {
    p_chat_id: chatId,
  });

  return { error };
};
