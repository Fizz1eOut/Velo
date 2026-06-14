<script setup lang="ts">
  import { ref } from 'vue';
  import { sendMessage } from '~/api/messages/sendMessage';
  import AppInput from '~/components/inputs/AppInput.vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';

  interface ChatInput {
    chatId: string;
  }
  const props = defineProps<ChatInput>();

  const content = ref<string>('');
  const isSending = ref(false);

  const send = async () => {
    if (!content.value.trim() || isSending.value) return;

    isSending.value = true;
    const { error } = await sendMessage(props.chatId, content.value);

    if (!error) {
      content.value = '';
    }

    isSending.value = false;
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };
</script>

<template>
  <div class="chat-input">
    <app-input
      v-model="content"
      placeholder="Type a message..."
      @keydown="onKeydown"
    />
    <app-button 
      :disabled="isSending || !content.trim()" 
      class="chat-input__button"
      @click="send"
    >
      <app-icon 
        name="send"
        size="var(--fs-2xl)"
        color="#fff"
      />
    </app-button>
  </div>
</template>

<style scoped>
  .chat-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  .chat-input__button {
    max-width: 40px;
    width: 100%;
    background-color: var(--primary);
    border-radius: var(--radius-full);
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color var(--transition-slow), transform var(--transition-slow);
  }
  .chat-input__button:hover {
    transform: scale(1.1);
    background-color: var(--primary-hover);
  }
</style>
