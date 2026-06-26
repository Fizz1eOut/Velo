import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';
import type { ChatListItem } from '~/interface/chat.interface';

export const listChats = async (): Promise<{ data: ChatListItem[] | null; error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };

  const { data: memberChats } = await supabase
    .from('chat_members')
    .select('chat_id')
    .eq('user_id', user.id);

  if (!memberChats?.length) return { data: [], error: null };

  const chatIds = memberChats.map(m => m.chat_id);

  const { data, error } = await supabase
    .from('chat_members')
    .select(`
      chat:chats(id, type, updated_at),
      profile:profiles(id, full_name, username, avatar_url, status)
    `)
    .in('chat_id', chatIds)
    .neq('user_id', user.id);

  return { data: data as unknown as ChatListItem[] | null, error };
};
