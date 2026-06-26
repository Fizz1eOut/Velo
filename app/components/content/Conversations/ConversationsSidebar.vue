<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { listChats } from '~/api/chats/listChats';
  import { getLastMessages } from '~/api/messages/lastMessages';
  import type { ChatListItem } from '~/interface/chat.interface';
  import type { lastMessagePreview } from '~/api/messages/lastMessages';
  import ConversationsList from '~/components/content/Conversations/ConversationsList.vue';

  const emit = defineEmits<{
    selectChat: [userId: string]
  }>();

  const chats = ref<ChatListItem[]>([]);
  const lastMessages = ref<lastMessagePreview[]>([]);

  onMounted(async () => {
    const { data } = await listChats();
    chats.value = data ?? [];
    console.log('listChats:', data);

    if (chats.value.length) {
      const chatIds = chats.value.map(c => c.chat.id);
      const { data: messages } = await getLastMessages(chatIds);
      lastMessages.value = messages ?? [];
    }
  });

  const getLastMessage = (chatId: string) => {
    return lastMessages.value.find(m => m.chat_id === chatId) ?? null;
  };
</script>

<template>
  <div class="conversation-sidebar">
    <conversations-list :chats="chats" :get-last-message="getLastMessage" @select-chat="emit('selectChat', $event)" />
  </div>
</template>

<style scoped>
  .conversation-sidebar {
    margin-top: var(--space-lg);
  }
</style>
