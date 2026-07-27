import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';
import type { ChatListItem } from '~/interface/chat.interface';

export const getChatMemberProfile = async (
  chatId: string
): Promise<{ data: ChatListItem['profile'] | null; error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };

  const { data, error } = await supabase
    .from('chat_members')
    .select('profile:profiles(id, full_name, username, avatar_url, status, last_seen)')
    .eq('chat_id', chatId)
    .neq('user_id', user.id)
    .single();

  return { data: (data?.profile as ChatListItem['profile']) ?? null, error };
};
