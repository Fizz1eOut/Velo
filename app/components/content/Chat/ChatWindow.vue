<script setup lang="ts">
  import { ref, watch, provide } from 'vue';
  import { fetchChatById } from '~/api/chats/chatById';
  import { chatSearchKey, createChatSearch } from '~/composables/useChatSearch';
  import AppLoadingSpinner from '~/components/base/AppLoadingSpinner.vue';
  import ChatMessages from '~/components/content/Chat/ChatMessages.vue';
  import ChatInput from '~/components/content/Chat/ChatInput.vue';
  import ChatHeader from '~/components/content/Chat/ChatHeader.vue';

  interface ChatWindow {
    userId: string;
  }
  const props = defineProps<ChatWindow>();

  const chatId = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const search = createChatSearch();
  provide(chatSearchKey, search);

  watch(
    () => props.userId,
    async (id) => {
      if (!id) return;

      isLoading.value = true;
      error.value = null;

      const { chatId: id_, error: err } =  await fetchChatById(id);

      if (err) {
        error.value = 'Failed to load chat';
      } else {
        chatId.value = id_;
      }

      isLoading.value = false;
    },
    { immediate: true }
  );
</script>

<template>
  <div class="chat-window">
    <app-loading-spinner v-if="isLoading" />
    <div v-else-if="error">{{ error }}</div>

    <div v-else-if="chatId" class="chat-window__content">
      <chat-header :chat-id="chatId" />
      <chat-messages :chat-id="chatId" />
      <chat-input :chat-id="chatId" />
    </div>

    <div v-else class="chat-window__empty">
      <p>No messages yet</p>
      <p>Start the conversation!</p>
    </div>
  </div>
</template>

<style scoped> 
  .chat-window {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    overflow: hidden;
  }
  .chat-window__content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
</style>
