import { ref, computed } from 'vue';

const activeMessageId = ref<string | null>(null);

export function useActiveMessageMenu(messageId: string) {
  const isActive = computed(() => activeMessageId.value === messageId);

  const open = () => {
    activeMessageId.value = messageId;
  };

  const close = () => {
    if (activeMessageId.value === messageId) {
      activeMessageId.value = null;
    }
  };

  return { isActive, open, close };
}
