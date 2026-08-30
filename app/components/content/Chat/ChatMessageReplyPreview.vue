<script setup lang="ts">
  import type { Message } from '~/interface/message.interface';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';

  interface ChatMessageReplyPreviewProps {
    reply: Message['reply_to'];
    title?: string;
    closable?: boolean;
  }
  const props = defineProps<ChatMessageReplyPreviewProps>();

  const emit = defineEmits<{
    (e: 'click' | 'close'): void;
  }>();

  const previewText = () => {
    const msg = props.reply;
    if (!msg) return '';
    if (msg.is_deleted) return 'Message deleted';
    if (msg.type === 'text') return msg.content ?? '';

    const labels: Partial<Record<typeof msg.type, string>> = {
      image: 'Photo',
      video: 'Video',
      audio: 'Audio',
      file: 'File',
    };
    return labels[msg.type] ?? msg.content ?? 'Message';
  };
</script>

<template>
  <div
    v-if="reply"
    class="reply-preview"
    :class="{ 'reply-preview--clickable': !closable }"
    @click="!closable && emit('click')"
  >
    <div class="reply-preview__bar" />
    <div class="reply-preview__body">
      <div v-if="title" class="reply-preview__title">{{ title }}</div>
      <div class="reply-preview__text">{{ previewText() }}</div>
    </div>
    <app-button
      v-if="closable"
      class="reply-preview__close"
      type="button"
      @click.stop="emit('close')"
    >
      <app-icon 
        name="cross"
        size="var(--fs-lg)"
        color="var(--text-secondary)"
      />
    </app-button>
  </div>
</template>

<style scoped>
  .reply-preview {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: var(--radius-sm, 6px);
    background-color: rgba(255, 255, 255, 0.06);
  }
  .reply-preview--clickable {
    cursor: pointer;
  }
  .reply-preview__bar {
    width: 3px;
    align-self: stretch;
    border-radius: 2px;
    background-color: var(--primary);
    flex-shrink: 0;
  }
  .reply-preview__body {
    flex: 1;
    min-width: 0;
  }
  .reply-preview__title {
    font-size: var(--fs-sm);
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 2px;
  }
  .reply-preview__text {
    font-size: var(--fs-sm);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .reply-preview__close {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
