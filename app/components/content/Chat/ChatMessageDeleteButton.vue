<script setup lang="ts">
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';
  import { deleteMessage } from '~/api/messages/deleteMessage';

  interface ChatMessageDeleteButtonProps {
    messageId: string;
  }
  const props = defineProps<ChatMessageDeleteButtonProps>();

  const emit = defineEmits<{
    (e: 'deleted', messageId: string): void;
  }>();

  const onClick = async () => {
    emit('deleted', props.messageId);

    const { error } = await deleteMessage(props.messageId);
    if (error) {
      console.error('Failed to delete message', error);
    }
  };
</script>

<template>
  <app-button class="message-menu__button delete-button" @click="onClick">
    <app-icon name="delete" color="var(--text-secondary)" size="var(--fs-xl)" />
    Delete
  </app-button>
</template>
