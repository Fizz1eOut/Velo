import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';

export const clearChat = async (
  chatId: string
): Promise<{ error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('chat_id', chatId);

  return { error };
};
