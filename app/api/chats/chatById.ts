import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';

export const fetchChatById = async (userId: string) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase.rpc(
    'get_or_create_direct_chat',
    {
      other_user_id: userId
    }
  );

  return {
    chatId: data,
    error
  };
};
