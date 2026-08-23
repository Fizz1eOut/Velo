import { ref, type InjectionKey, type ShallowRef, type Ref } from 'vue';
import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';

const TYPING_TIMEOUT = 3000;

export interface ChatTyping {
  isPeerTyping: Ref<boolean>;
  handleInput: () => void;
  handleStopTyping: () => void;
  destroy: () => void;
}

export const chatTypingKey: InjectionKey<ShallowRef<ChatTyping | null>> = Symbol('chat-typing');

export const createChatTyping = (chatId: string, currentUserId: string): ChatTyping => {
  const supabase = useSupabaseClient<Database>();

  const isPeerTyping = ref(false);
  let stopTypingTimer: ReturnType<typeof setTimeout> | null = null;
  let peerTypingTimer: ReturnType<typeof setTimeout> | null = null;
  let isReady = false;
  let pendingState: boolean | null = null;

  supabase.realtime.setAuth();

  const channel = supabase
    .channel(`typing:${chatId}`, {
      config: {
        broadcast: { self: false },
        private: true,
      },
    })
    .on('broadcast', { event: 'typing' }, ({ payload }) => {
      if (payload.userId === currentUserId) return;

      isPeerTyping.value = payload.isTyping;

      if (peerTypingTimer) clearTimeout(peerTypingTimer);
      if (payload.isTyping) {
        peerTypingTimer = setTimeout(() => {
          isPeerTyping.value = false;
        }, TYPING_TIMEOUT + 1000);
      }
    })
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        isReady = true;
        if (pendingState !== null) {
          channel.send({
            type: 'broadcast',
            event: 'typing',
            payload: { userId: currentUserId, isTyping: pendingState },
          });
          pendingState = null;
        }
      }
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.error('[typing channel] failed to subscribe:', status, err);
      }
    });

  const sendTyping = (typingState: boolean) => {
    if (!isReady) {
      pendingState = typingState;
      return;
    }
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: currentUserId, isTyping: typingState },
    });
  };

  const handleInput = () => {
    sendTyping(true);
    if (stopTypingTimer) clearTimeout(stopTypingTimer);
    stopTypingTimer = setTimeout(() => sendTyping(false), TYPING_TIMEOUT);
  };

  const handleStopTyping = () => {
    if (stopTypingTimer) clearTimeout(stopTypingTimer);
    sendTyping(false);
  };

  const destroy = () => {
    if (stopTypingTimer) clearTimeout(stopTypingTimer);
    if (peerTypingTimer) clearTimeout(peerTypingTimer);
    handleStopTyping();
    supabase.removeChannel(channel);
  };

  return { isPeerTyping, handleInput, handleStopTyping, destroy };
};
