<script setup lang="ts">
  import { ref } from 'vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';

  interface ChatMessageCopyButtonProps {
    text: string | null;
  }
  const props = defineProps<ChatMessageCopyButtonProps>();

  const emit = defineEmits<{
    (e: 'copied'): void;
  }>();

  const COPIED_RESET_MS = 1500;

  const copied = ref(false);
  let resetTimer: ReturnType<typeof setTimeout> | null = null;

  const copy = async () => {
    if (!props.text) return;

    try {
      await navigator.clipboard.writeText(props.text);
      copied.value = true;
      emit('copied');

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        copied.value = false;
      }, COPIED_RESET_MS);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };
</script>

<template>
  <app-button
    v-if="text"
    class="message-menu__button"
    @click="copy"
  >
    <app-icon
      name="copy"
      color="var(--text-secondary)"
      size="var(--fs-xl)"
    />
    {{ copied ? 'Copied' : 'Copy text' }}
  </app-button>
</template>
