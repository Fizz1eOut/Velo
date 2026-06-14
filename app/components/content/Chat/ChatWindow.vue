<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { fetchChatById } from '~/api/chats/chatById';
  import AppLoadingSpinner from '~/components/base/AppLoadingSpinner.vue';
  import ChatMessages from '~/components/content/Chat/ChatMessages.vue';
  import ChatInput from '~/components/content/Chat/ChatInput.vue';

  interface ChatWindow {
    userId: string;
  }
  const props = defineProps<ChatWindow>();

  const chatId = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

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

    <div v-else-if="chatId">
      <p>Chat ID: {{ chatId }}</p>
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

</style>
