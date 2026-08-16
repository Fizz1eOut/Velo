<script setup lang="ts">
  import { ref } from 'vue';
  import { sendMessage } from '~/api/messages/sendMessage';
  import { sendAttachment } from '~/api/messages/sendAttachment';
  import AppUnderlay from '~/components/base/AppUnderlay.vue';
  import AppContainer from '~/components/base/AppContainer.vue';
  import AppInput from '~/components/inputs/AppInput.vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';

  interface ChatInput {
    chatId: string;
  }
  const props = defineProps<ChatInput>();

  const content = ref<string>('');
  const isSending = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);

  const send = async () => {
    if (!content.value.trim() || isSending.value) return;

    isSending.value = true;
    const { error } = await sendMessage(props.chatId, content.value);

    if (!error) {
      content.value = '';
    }

    isSending.value = false;
  };

  const openFilePicker = () => fileInput.value?.click();

  const onFileSelected = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    isSending.value = true;
    const { error } = await sendAttachment(props.chatId, file);
    isSending.value = false;

    if (error) {
      console.error(error);
    }

    (e.target as HTMLInputElement).value = '';
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
    <app-underlay>
      <app-container>
        <div class="chat-input__body">
          <input
            ref="fileInput"
            type="file"
            accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.zip"
            style="display: none"
            @change="onFileSelected"
          >
          <app-button class="chat-input__attach" @click="openFilePicker">
            <app-icon 
              name="paperclip" 
              size="var(--fs-2xl)"
              color="var(--text-secondary)"
            />
          </app-button>

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
      </app-container>
    </app-underlay>
  </div>
</template>

<style scoped>
  .chat-input__body {
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
  .chat-input__attach {
    max-width: 40px;
    width: 100%;
    height: 40px;
    border-radius: var(--radius-sm);
    transition: background-color var(--transition-slow);
  }
  .chat-input__attach:hover {
    background-color: var(--bg-surface-2);
  }
</style>
