import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';
import type { MessageInsert } from '~/interface/message.interface';

export const sendMessage = async (
  chatId: string,
  content: string,
  replyToId?: string | null
): Promise<{ error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };

  const message: MessageInsert = {
    chat_id: chatId,
    sender_id: user.id,
    content,
    type: 'text',
    reply_to_id: replyToId ?? null,
  };

  const { error } = await supabase
    .from('messages')
    .insert(message);

  return { error };
};
