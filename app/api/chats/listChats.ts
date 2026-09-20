import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';
import type { ChatListItem } from '~/interface/chat.interface';

export const listChats = async (): Promise<{ data: ChatListItem[] | null; error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };

  const { data, error } = await supabase
    .from('chat_list_view')
    .select('chat_id, type, updated_at, unread_count, user_id, name, avatar_url')
    .eq('user_id', user.id);

  if (!data?.length) return { data: [], error };

  const chatIds = data.map(d => d.chat_id!);

  const { data: members } = await supabase
    .from('chat_members')
    .select('chat_id, profile:profiles(id, full_name, username, avatar_url, status, last_seen)')
    .in('chat_id', chatIds)
    .neq('user_id', user.id);

  const result: ChatListItem[] = data.map((row) => ({
    chat: {
      id: row.chat_id!,
      type: row.type as 'direct' | 'group',
      updated_at: row.updated_at ?? '',
      unread_count: row.unread_count ?? 0,
    },
    profile: members?.find(m => m.chat_id === row.chat_id)?.profile as ChatListItem['profile'],
  }));

  return { data: result, error };
};
