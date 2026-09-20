<script setup lang="ts">
  import type { ChatListItem } from '~/interface/chat.interface';
  import type { lastMessagePreview } from '~/api/messages/lastMessages';
  import ConversationsItem from '~/components/content/Conversations/ConversationsItem.vue';

  interface ConversationsListProps {
    chats: ChatListItem[];
    getLastMessage: (chatId: string) => lastMessagePreview | null;
  }
  defineProps<ConversationsListProps>();
  const emit = defineEmits<{
    selectChat: [userId: string]
  }>();
</script>

<template>
  <conversations-item 
    v-for="item in chats"
    :key="item.chat.id"
    :item="item"
    :get-last-message="getLastMessage"
    class="conversation-item"
    @click="emit('selectChat', item.profile.id)"
  />
</template>

<style scoped>
  .conversation-item:not(:last-child) {
    margin-bottom: 10px;
  }
</style>
