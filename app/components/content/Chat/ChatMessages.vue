<script setup lang="ts">
  import { ref, watch, nextTick, onUnmounted, computed } from 'vue';
  import { listMessages } from '~/api/messages/listMessages';
  import { markMessagesAsRead } from '~/api/messages/markMessagesAsRead';
  import { useSupabaseClient } from '#imports';
  import type { Message } from '~/interface/message.interface';
  import type { Database } from '~/../types/database';
  import ChatMessage from './ChatMessage.vue';

  interface ChatMessages {
    chatId: string;
  }
  const props = defineProps<ChatMessages>();

  const messages = ref<Message[]>([]);
  const isLoading = ref(false);
  const bottomRef = ref<HTMLDivElement | null>(null);
  const currentUserId = ref<string | null>(null);

  const supabase = useSupabaseClient<Database>();

  const firstUnreadIndex = computed(() =>
    messages.value.findIndex(
      (m) => !m.is_read && m.sender_id !== currentUserId.value
    )
  );

  const scrollToBottom = async () => {
    await nextTick();
    bottomRef.value?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async (chatId: string) => {
    isLoading.value = true;
    await markMessagesAsRead(chatId);
    const { data } = await listMessages(chatId);
    messages.value = data ?? [];
    isLoading.value = false;
    scrollToBottom();
  };

  let unsubscribe: (() => void) | null = null;

  const subscribeToMessages = (chatId: string) => {
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          messages.value.push(payload.new as Message);
          scrollToBottom();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message_reads',
        },
        (payload) => {
          const { message_id, user_id } = payload.new as { message_id: string; user_id: string };

          if (user_id !== currentUserId.value) {
            const message = messages.value.find((m) => m.id === message_id);
            if (message) message.is_read = true;
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  watch(
    () => props.chatId,
    async (id) => {
      if (!id) return;

      const { data: { user } } = await supabase.auth.getUser();
      currentUserId.value = user?.id ?? null;

      unsubscribe?.();
      await loadMessages(id);
      unsubscribe = subscribeToMessages(id);
    },
    { immediate: true }
  );

  onUnmounted(() => unsubscribe?.());
</script>

<template>
  <div class="chat-messages">
    <div v-if="isLoading">Loading...</div>

    <template v-else>
      <template v-for="(message, index) in messages" :key="message.id">
        <div v-if="index === firstUnreadIndex" class="chat-messages__divider">
          <span>Unread messages</span>
        </div>

        <chat-message
          :message="message"
          :is-own="message.sender_id === currentUserId"
        />
      </template>
    </template>

    <div ref="bottomRef" />
  </div>
</template>

<style scoped>
 .chat-messages__divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 10px 0;
    color: var(--text-secondary);
    font-size: var(--fs-sm);
  }
  .chat-messages__divider::before,
  .chat-messages__divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: var(--border);
  }
</style>
