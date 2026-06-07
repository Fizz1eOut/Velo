import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';
import type { MessageInsert } from '~/interface/message.interface';

export const sendMessage = async (
  chatId: string,
  content: string
): Promise<{ error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };

  const message: MessageInsert = {
    chat_id: chatId,
    sender_id: user.id,
    content,
    type: 'text',
  };

  const { error } = await supabase
    .from('messages')
    .insert(message);

  return { error };
};
