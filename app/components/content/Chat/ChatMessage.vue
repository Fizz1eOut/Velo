<script setup lang="ts">
  import type { Message } from '~/interface/message.interface';

  interface ChatMessage {
    message: Message;
    isOwn: boolean;
  }
  defineProps<ChatMessage>();

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
</script>

<template>
  <div class="chat-message" :class="{ 'chat-message--own': isOwn }">
    <div class="chat-message__bubble">
      <div v-if="message.is_deleted" class="chat-message__deleted">
        Message deleted
      </div>
      <div v-else class="chat-message__content">{{ message.content }}</div>

      <div class="chat-message__time">
        {{ formatTime(message.created_at) }}
        <div v-if="isOwn" class="chat-message__check">✓</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .chat-message {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  .chat-message--own {
    justify-content: flex-end;
  }
  .chat-message__bubble {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 60%;
    padding: 10px 14px;
    border-radius: var(--radius-lg);
    background-color: var(--bg-surface-2);
    color: var(--text-primary);
    border-radius: 4px var(--radius-lg) var(--radius-lg) var(--radius-lg);
  }
  .chat-message--own .chat-message__bubble {
    background-color: var(--primary);
    color: #ffffff;
    border-radius: var(--radius-lg) 4px var(--radius-lg) var(--radius-lg);
  }
  .chat-message__content {
    font-size: var(--fs-md);
    color: var(--text-primary);
    word-break: break-word;
    white-space: pre-wrap;
  }
  .chat-message__deleted {
    font-size: var(--fs-sm);
    opacity: 0.5;
  }
  .chat-message__time {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    font-size: var(--fs-xs);
    color: var(--text-secondary);
  }
  .chat-message__check {
    font-size: var(--fs-xs);
  }
  
  @media (max-width: 768px) {
    .chat-message__content {
      font-size: var(--fs-md);
      color: var(--text-primary);
    }
  }
</style>
