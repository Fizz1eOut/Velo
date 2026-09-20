import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';

export const deleteChat = async (
  chatId: string
): Promise<{ error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId);

  return { error };
};
