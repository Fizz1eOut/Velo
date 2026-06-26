import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';

export interface lastMessagePreview {
  chat_id: string;
  content: string | null;
  created_at: string | null;
  sender_id: string;
}

export const getLastMessages = async (
  chatIds: string[]
): Promise<{ data: lastMessagePreview[] | null; error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from('messages')
    .select('chat_id, content, created_at, sender_id')
    .in('chat_id', chatIds)
    .order('created_at', { ascending: false });

  return { data: data as lastMessagePreview[] | null, error };
};
