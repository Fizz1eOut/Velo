import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';
import type { Message, ReplyPreview } from '~/interface/message.interface';
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
    thumbnail_url,
    reply_to_id,
    forwarded_from,
    is_edited,
    is_deleted,
    is_pinned,
    created_at,
    updated_at,
    message_reads!left(user_id),
    reactions(emoji, user_id)
  `)
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error || !data) {
    return { data: null, error };
  }

  const replyIds = Array.from(
    new Set(data.map((m) => m.reply_to_id).filter((id): id is string => !!id))
  );

  const replyMap = new Map<string, ReplyPreview>();

  if (replyIds.length > 0) {
    const { data: parents } = await supabase
      .from('messages')
      .select('id, content, sender_id, type, is_deleted')
      .in('id', replyIds);

    parents?.forEach((p) => {
    replyMap.set(p.id, {
      id: p.id,
      content: p.content,
      sender_id: p.sender_id,
      type: p.type as ReplyPreview['type'],
      is_deleted: p.is_deleted ?? false,
    });
    });
  }

  const messages = data.map((msg) => ({
    ...msg,
    reply_to: msg.reply_to_id ? (replyMap.get(msg.reply_to_id) ?? null) : null,
    is_read: msg.message_reads.some((r) => r.user_id !== msg.sender_id),
    reactions: groupReactions(msg.reactions ?? [], currentUserId),
  }));

  return { data: messages as Message[], error: null };
};
