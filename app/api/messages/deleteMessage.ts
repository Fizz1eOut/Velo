import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';

export const deleteMessage = async (messageId: string) => {
  const supabase = useSupabaseClient<Database>();

  const { error } = await supabase
    .from('messages')
    .update({
      is_deleted: true,
      content: null,
    })
    .eq('id', messageId);

  return { error };
};
