import { defineNuxtPlugin } from '#app';
import { useSupabaseClient } from '#imports';
import { showToast } from '~/stores/toastStore';
import type { Database } from '~/../types/database';

export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient<Database>();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  supabase
    .channel('messages-toast')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      async (payload) => {
        const message = payload.new as {
          id: string;
          sender_id: string;
          content: string | null;
          created_at: string;
          chat_id: string;
        };

        if (message.sender_id === user.id) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, username, avatar_url')
          .eq('id', message.sender_id)
          .single();

        if (!profile) return;

        showToast({
          name: profile.full_name || profile.username,
          message: message.content ?? '',
          avatar: profile.avatar_url ?? undefined,
          time: new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          duration: 4000,
        });
      }
    )
    .subscribe();
});
