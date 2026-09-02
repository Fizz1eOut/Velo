<script setup lang="ts">
  import { ref, shallowRef, watch, nextTick, onMounted, onUnmounted, computed, inject } from 'vue';
  import { chatSearchKey } from '~/composables/useChatSearch';
  import { listMessages } from '~/api/messages/listMessages';
  import { markMessagesAsRead } from '~/api/messages/markMessagesAsRead';
  import { useSupabaseClient } from '#imports';
  import type { Message } from '~/interface/message.interface'; 
  import type { Database } from '~/../types/database';
  import ChatMessage from './ChatMessage.vue';
  import { chatTypingKey } from '~/composables/useChatTyping';
  import AppTypingIndicator from '~/components/base/AppTypingIndicator.vue';

  interface ChatMessages {
    chatId: string;
  }
  const props = defineProps<ChatMessages>();

  const typing = inject(chatTypingKey, shallowRef(null));
  const messages = ref<Message[]>([]);
  const isLoading = ref(false); 
  const bottomRef = ref<HTMLDivElement | null>(null);
  const containerRef = ref<HTMLDivElement | null>(null);
  const currentUserId = ref<string | null>(null);
  const supabase = useSupabaseClient<Database>();

  const search = inject(chatSearchKey);
  if (!search) throw new Error('ChatMessages must be used within a ChatWindow');

  const firstUnreadIndex = computed(() =>
    messages.value.findIndex(
      (m) => !m.is_read && m.sender_id !== currentUserId.value
    )
  );

  const BOTTOM_THRESHOLD = 80;
  const shouldStickToBottom = ref(true);

  const isNearBottom = () => {
    const el = containerRef.value;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_THRESHOLD;
  };

  const handleScroll = () => {
    shouldStickToBottom.value = isNearBottom();
  };

  const scrollToBottom = async (instant = false) => {
    await nextTick();
    shouldStickToBottom.value = true;
    bottomRef.value?.scrollIntoView({ behavior: instant ? 'auto' : 'smooth' });
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

  const handleMediaLoaded = () => {
    if (shouldStickToBottom.value) {
      scrollToBottom(true);
    }
  };

  const markMessageDeletedLocally = (messageId: string) => {
    const message = messages.value.find((m) => m.id === messageId);
    if (message) {
      message.is_deleted = true;
      message.content = null;
    }

    messages.value.forEach((m) => {
      if (m.reply_to?.id === messageId) {
        m.reply_to.is_deleted = true;
        m.reply_to.content = null;
      }
    });

    search.setMessages(messages.value);
  };

  const onMessageDeleted = (messageId: string) => {
    markMessageDeletedLocally(messageId);
  };

  const loadMessages = async (chatId: string) => {
    isLoading.value = true;
    await markMessagesAsRead(chatId);
    const { data } = await listMessages(chatId, currentUserId.value);
    messages.value = data ?? [];
    search.setMessages(messages.value);
    isLoading.value = false;
    scrollToBottom(true);
  };

  let unsubscribe: (() => void) | null = null;

  const subscribeToMessages = (chatId: string) => {
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload) => {
          const message = payload.new as Message;

          if (messages.value.some((m) => m.id === message.id)) return; // защита от дублей

          const isOwn = message.sender_id === currentUserId.value;

          if (message.reply_to_id) {
            const parent = messages.value.find((m) => m.id === message.reply_to_id);
            if (parent) {
              message.reply_to = {
                id: parent.id,
                content: parent.content,
                sender_id: parent.sender_id,
                type: parent.type,
                is_deleted: parent.is_deleted,
              };
            }
          }

          messages.value.push(message);
          search.setMessages(messages.value);

          if (isOwn || shouldStickToBottom.value) {
            scrollToBottom();
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload) => {
          const deletedId = payload.old.id as string;
          messages.value = messages.value.filter((m) => m.id !== deletedId);
          search.setMessages(messages.value);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload) => {
          const updated = payload.new as Message;
          markMessageDeletedLocally(updated.id);
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'message_reads' },
        (payload) => {
          const { message_id, user_id } = payload.new as { message_id: string; user_id: string };
          if (user_id !== currentUserId.value) {
            const message = messages.value.find((m) => m.id === message_id);
            if (message) message.is_read = true;
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reactions' },
        (payload) => {
          const row = payload.new as { message_id: string; user_id: string; emoji: string };
          const message = messages.value.find((m) => m.id === row.message_id);
          if (!message) return;

          message.reactions ??= [];
          let g = message.reactions.find((r) => r.emoji === row.emoji);
          if (!g) {
            g = { emoji: row.emoji, count: 0, reactedByMe: false, userIds: [] };
            message.reactions.push(g);
          }
          if (!g.userIds.includes(row.user_id)) {
            g.userIds.push(row.user_id);
            g.count++;
            if (row.user_id === currentUserId.value) g.reactedByMe = true;
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'reactions' },
        (payload) => {
          const newRow = payload.new as { message_id: string; user_id: string; emoji: string };
          const oldRow = payload.old as { emoji?: string };
          const message = messages.value.find((m) => m.id === newRow.message_id);
          if (!message?.reactions) return;

          if (oldRow.emoji && oldRow.emoji !== newRow.emoji) {
            const oldGroup = message.reactions.find((r) => r.emoji === oldRow.emoji);
            if (oldGroup) {
              oldGroup.userIds = oldGroup.userIds.filter((id) => id !== newRow.user_id);
              oldGroup.count--;
              if (newRow.user_id === currentUserId.value) oldGroup.reactedByMe = false;
              if (oldGroup.count <= 0) {
                message.reactions = message.reactions.filter((r) => r !== oldGroup);
              }
            }
          }

          let newGroup = message.reactions.find((r) => r.emoji === newRow.emoji);
          if (!newGroup) {
            newGroup = { emoji: newRow.emoji, count: 0, reactedByMe: false, userIds: [] };
            message.reactions.push(newGroup);
          }
          if (!newGroup.userIds.includes(newRow.user_id)) {
            newGroup.userIds.push(newRow.user_id);
            newGroup.count++;
            if (newRow.user_id === currentUserId.value) newGroup.reactedByMe = true;
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'reactions' },
        (payload) => {
          const row = payload.old as { message_id?: string; user_id?: string; emoji?: string };
          if (!row.message_id) return;

          const message = messages.value.find((m) => m.id === row.message_id);
          if (!message?.reactions) return;

          const g = message.reactions.find((r) => r.emoji === row.emoji);
          if (!g) return;

          g.userIds = g.userIds.filter((id) => id !== row.user_id);
          g.count--;
          if (row.user_id === currentUserId.value) g.reactedByMe = false;
          if (g.count <= 0) {
            message.reactions = message.reactions.filter((r) => r !== g);
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

  watch(() => typing.value?.isPeerTyping.value, (isTyping) => {
    if (isTyping && shouldStickToBottom.value) {
      scrollToBottom();
    }
  });

  onMounted(() => {
    containerRef.value?.addEventListener('scroll', handleScroll, { passive: true });
  });

  onUnmounted(() => {
    containerRef.value?.removeEventListener('scroll', handleScroll);
    unsubscribe?.();
  });
</script>

<template>
  <div ref="containerRef" class="chat-messages">
    <div v-if="isLoading">Loading...</div>

    <div v-if="messages.length === 0 && !isLoading" class="chat-messages__empty">
      <p>No messages yet!</p>
      <p>Start the conversation!</p>
    </div>

    <template v-for="(message, index) in messages" :key="message.id">
      <div v-if="index === firstUnreadIndex" class="chat-messages__divider">
        <span>Unread messages</span>
      </div>

      <chat-message
        :id="`msg-${message.id}`"
        :message="message"
        :is-own="message.sender_id === currentUserId"
        :current-user-id="currentUserId"
        :highlight-query="search.query.value"
        @media-loaded="handleMediaLoaded"
        @scroll-to-reply="scrollToMessage"
        @delete="onMessageDeleted"
      />
    </template>

    <div v-if="typing?.isPeerTyping.value" class="chat-messages__typing">
      <app-typing-indicator size="md" />
    </div>

    <div ref="bottomRef" style="overflow-anchor: none;" />
  </div>
</template>

<style scoped>
  .chat-messages__typing {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
  }
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
    overflow-x: hidden;
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
