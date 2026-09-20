import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';

export async function toggleReaction(messageId: string, emoji: string) {
  const supabase = useSupabaseClient<Database>();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: existing } = await supabase
    .from('reactions')
    .select('id, emoji')
    .eq('message_id', messageId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing?.emoji === emoji) {
    return supabase.from('reactions').delete().eq('id', existing.id);
  }

  if (existing) {
    return supabase.from('reactions').update({ emoji }).eq('id', existing.id);
  }

  return supabase.from('reactions').insert({ message_id: messageId, user_id: user.id, emoji });
}
