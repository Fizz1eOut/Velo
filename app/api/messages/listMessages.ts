import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';
import type { Message } from '~/interface/message.interface';
import { groupReactions } from '~/utils/reactions';

export const listMessages = async (
  chatId: string,
  currentUserId: string | null
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
    reply_to_id,
    is_edited,
    is_deleted,
    created_at,
    updated_at,
    message_reads!left(user_id),
    reactions(emoji, user_id),
    reply_to:messages!reply_to_id(id, content, sender_id, type, is_deleted)
  `)
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  const messages = data?.map((msg) => {
    const rawReply = Array.isArray(msg.reply_to)
      ? (msg.reply_to[0] ?? null)
      : (msg.reply_to ?? null);

    return {
      ...msg,
      reply_to: rawReply,
      is_read: msg.message_reads.some((r) => r.user_id !== msg.sender_id),
      reactions: groupReactions(msg.reactions ?? [], currentUserId),
    };
  }) ?? null;

  return { data: messages as Message[] | null, error };
};
