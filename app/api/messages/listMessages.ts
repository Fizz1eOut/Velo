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
    is_edited,
    is_deleted,
    created_at,
    updated_at
  `)
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

console.log('listMessages error:', JSON.stringify(error));

return { data: data as Message[] | null, error };
};
