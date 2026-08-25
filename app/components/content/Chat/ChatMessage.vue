<script setup lang="ts">
  import { reactive, computed } from 'vue';
  import type { Message } from '~/interface/message.interface';
  import { useActiveMessageMenu } from '~/composables/useActiveMessageMenu';
  import ChatMessageAttachment from './ChatMessageAttachment.vue';
  import ChatMessageMenu from '~/components/content/Chat/ChatMessageMenu.vue';

  interface ChatMessage {
    message: Message;
    isOwn: boolean;
    highlightQuery?: string;
  }
  const props = defineProps<ChatMessage>();

  const emit = defineEmits<{
    (e: 'media-loaded'): void;
  }>();

  const isAttachment = computed(() =>
    ['image', 'video', 'audio', 'file'].includes(props.message.type)
  );

  const highlightedText = computed(() => {
    const text = props.message.content ?? '';
    const q = props.highlightQuery?.trim();
    if (!q) return text;

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const { isActive, open: openMenu, close: closeMenu } = useActiveMessageMenu(props.message.id);
 
  const menuPosition = reactive({ x: 0, y: 0 });
 
  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    menuPosition.x = e.clientX;
    menuPosition.y = e.clientY;
    openMenu();
  };
 
  let pressTimer: ReturnType<typeof setTimeout> | null = null;
  const LONG_PRESS_MS = 450;
 
  const onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
 
    pressTimer = setTimeout(() => {
      menuPosition.x = touch.clientX;
      menuPosition.y = touch.clientY;
      openMenu();
    }, LONG_PRESS_MS);
  };
 
  const clearPressTimer = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  };
</script>

<template>
  <div
    class="chat-message"
    :class="{ 'chat-message--own': isOwn }"
  >
    <div
      class="chat-message__bubble"
      @contextmenu="onContextMenu"
      @touchstart="onTouchStart"
      @touchend="clearPressTimer"
      @touchmove="clearPressTimer"
    >
      <div v-if="message.is_deleted" class="chat-message__deleted">
        Message deleted
      </div>

      <chat-message-attachment
        v-else-if="isAttachment"
        :message="message"
        @media-loaded="emit('media-loaded')"
      />

      <div v-else class="chat-message__content" v-html="highlightedText" />

      <div class="chat-message__time">
        {{ formatTime(message.created_at) }}
        <div v-if="isOwn" :class="{ 'is-read': message.is_read }" class="chat-message__check">
          {{ message.is_read ? '✓✓' : '✓' }}
        </div>
      </div>
    </div>
    <chat-message-menu
      :active="isActive"
      :x="menuPosition.x"
      :y="menuPosition.y"
      @close="closeMenu"
    />
  </div>
</template>

<style scoped>
  .chat-message {
    position: relative;
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
  .chat-message__content :deep(mark) {
    background-color: var(--away);
    color: #ffffff;
    border-radius: 2px;
    padding: 0 2px;
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
  .chat-message__check.is-read {
    color: var(--primary-pressed);
  }
  @media (max-width: 768px) {
    .chat-message__content {
      font-size: var(--fs-md);
      color: var(--text-primary);
    }
  }
</style>
