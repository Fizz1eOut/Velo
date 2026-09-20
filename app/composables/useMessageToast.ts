import { useSupabaseClient } from '#imports';
import { showToast } from '~/stores/toastStore';
import type { Database } from '~/../types/database';
import type { Message } from '~/interface/message.interface';

export const useMessageToast = (currentUserId: string) => {
  const supabase = useSupabaseClient<Database>();

  const channel = supabase
    .channel('messages-toast')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      },
      async (payload) => {
         console.log('new message payload:', payload);
         const message = payload.new as Message;
        console.log('sender_id:', message.sender_id, 'currentUserId:', currentUserId);

        if (message.sender_id === currentUserId) return;

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

  const unsubscribe = () => supabase.removeChannel(channel);

  return { unsubscribe };
};
