import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';
import type { Message } from '~/interface/message.interface';

export const listMessages = async (
  chatId: string
): Promise<{ data: Message[] | null; error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      chat_id,
      sender_id,
      content,
      type,
      file_url,
      file_name,
      file_size,
      file_mime,
      is_edited,
      is_deleted,
      created_at,
      updated_at,
      message_reads!left(user_id)
    `)
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  const messages = data?.map((msg) => ({
    ...msg,
    is_read: msg.message_reads.some((r) => r.user_id !== msg.sender_id),
  })) ?? null;

  return { data: messages as Message[] | null, error };
};
