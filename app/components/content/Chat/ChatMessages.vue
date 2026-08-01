<script setup lang="ts">
  import { ref, watch, nextTick, onUnmounted, computed, inject } from 'vue';
  import { chatSearchKey } from '~/composables/useChatSearch';
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

  const search = inject(chatSearchKey);
  if (!search) throw new Error('ChatMessages must be used within a ChatWindow');

  const firstUnreadIndex = computed(() =>
    messages.value.findIndex( 
      (m) => !m.is_read && m.sender_id !== currentUserId.value
    )
  );

  const scrollToBottom = async () => {
    await nextTick();
    bottomRef.value?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMessage = async (messageId: string) => {
    await nextTick();
    document
      .getElementById(`msg-${messageId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  watch(search.scrollToken, () => {
    if (search.activeMatch.value) scrollToMessage(search.activeMatch.value.id);
  });

  const loadMessages = async (chatId: string) => {
    isLoading.value = true;
    await markMessagesAsRead(chatId);
    const { data } = await listMessages(chatId);
    messages.value = data ?? [];
    search.setMessages(messages.value);
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
          search.setMessages(messages.value);
          scrollToBottom();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const deletedId = payload.old.id as string;
          messages.value = messages.value.filter((m) => m.id !== deletedId);
          search.setMessages(messages.value);
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

    <div v-if="messages.length === 0" class="chat-messages__empty">
      <p>No messages yet!</p>
      <p>Start the conversation!</p>
    </div>

    <template v-else>
      <template v-for="(message, index) in messages" :key="message.id">
        <div v-if="index === firstUnreadIndex" class="chat-messages__divider">
          <span>Unread messages</span>
        </div>
        
        <chat-message
          :id="`msg-${message.id}`"
          :message="message"
          :is-own="message.sender_id === currentUserId"
          :highlight-query="search.query.value"
        />
      </template>
    </template>

    <div ref="bottomRef" />
  </div>
</template>

<style scoped>
  .chat-messages__empty {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    gap: 10px;
    font-size: var(--fs-xl);
    color: var(--text-secondary);
  }
  .chat-messages {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-right: 5px;
  }
  .chat-messages::-webkit-scrollbar {
    width: 6px;
  }
  .chat-messages::-webkit-scrollbar-track {
    background: transparent;
  }
  .chat-messages::-webkit-scrollbar-thumb {
    background: var(--scrollbar);
    border-radius: 3px;
    transition: background var(--transition-base);
  }
  .chat-messages::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.35);
  }
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
  @media (max-width: 480px) {
    .chat-messages {
      padding-left: 12px;
    }
  }
</style>
