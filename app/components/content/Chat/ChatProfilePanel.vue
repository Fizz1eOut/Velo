<script setup lang="ts">
  import { ref, watch } from 'vue';
  import type { ChatListItem } from '~/interface/chat.interface';
  import type { Message } from '~/interface/message.interface';
  import { listMessages } from '~/api/messages/listMessages';
  import ProfilePanelHeader from '~/components/content/Chat/ProfilePanel/ProfilePanelHeader.vue';
  import ProfilePanelMedia from '~/components/content/Chat/ProfilePanel/ProfilePanelMedia.vue';

  interface ChatProfilePanelProps {
    profile?: ChatListItem['profile'] | null;
    chatId: string;
    userId: string;
  }
  const props = defineProps<ChatProfilePanelProps>();

  const isLoading = ref(false);
  const messages = ref<Message[]>([]);

  const loadMessages = async (chatId: string) => {
    isLoading.value = true;
    const { data, error } = await listMessages(chatId, props.userId);
    if (error) {
      console.error('Failed to load messages for profile panel:', error);
    }
    messages.value = data ?? [];
    isLoading.value = false;
  };

  watch(
    () => props.chatId,
    (chatId) => {
      if (chatId) loadMessages(chatId);
    },
    { immediate: true }
  );
</script>

<template>
  <div class="chat-profile-panel">
    <profile-panel-header :profile="profile" />
    <profile-panel-media :messages="messages" :is-loading="isLoading" />
  </div>
</template>

<style scoped>
.chat-profile-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
