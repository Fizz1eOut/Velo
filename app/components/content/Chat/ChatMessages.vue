<script setup lang="ts">
  import { ref, watch, nextTick, onUnmounted } from 'vue';
  import { listMessages } from '~/api/messages/listMessages';
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

  const scrollToBottom = async () => {
    await nextTick();
    bottomRef.value?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async (chatId: string) => {
    isLoading.value = true;
    const { data } = await listMessages(chatId);
    messages.value = data ?? [];
    isLoading.value = false;
    scrollToBottom();
  };

  let unsubscribe: (() => void) | null = null;

  const subscribeToMessages = (chatId: string) => {
    const channel = supabase
      .channel(`messages:${chatId}`)
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
      <chat-message
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :is-own="message.sender_id === currentUserId"
      />
    </template>

    <div ref="bottomRef" />
  </div>
</template>

<style scoped>
</style>
