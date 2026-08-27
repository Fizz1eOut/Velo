<script setup lang="ts">
  import AppDropdown from '~/components/base/AppDropdown.vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';
  import { toggleReaction } from '~/api/messages/toggleReaction';
  import { applyLocalReactionToggle } from '~/utils/reactions';
  import type { Message } from '~/interface/message.interface';

  interface ChatMessageMenuProps {
    active: boolean;
    x: number;
    y: number;
    message: Message;
    currentUserId: string | null;
  }
  const props = defineProps<ChatMessageMenuProps>();

  const emit = defineEmits<{
    (e: 'close'): void;
  }>();

  const QUICK_REACTIONS = ['👍', '❤️', '😂', '🔥', '😮', '😢'];

  const onReact = async (emoji: string) => {
    applyLocalReactionToggle(props.message, emoji, props.currentUserId);
    emit('close');
    await toggleReaction(props.message.id, emoji);
  };
</script>

<template>
  <Teleport to="body">
    <div class="message-menu__anchor" :style="{ left: `${x}px`, top: `${y}px` }">
      <app-dropdown
        :active="active"
        style="width: 260px; max-width: calc(100vw - 20px);"
        @close="emit('close')"
      >
        <div class="message-menu__reactions">
          <button
            v-for="emoji in QUICK_REACTIONS"
            :key="emoji"
            class="message-menu__reaction"
            @click="onReact(emoji)"
          >
            {{ emoji }}
          </button>
        </div>
        <app-button class="message-menu__button">
          <app-icon 
            name="reply"
            color="var(--text-secondary)"
            size="var(--fs-xl)"
          />
          Reply
        </app-button>

        <app-button class="message-menu__button">
          <app-icon 
            name="copy"
            color="var(--text-secondary)"
            size="var(--fs-xl)"
          />
          Copy text
        </app-button>

        <app-button class="message-menu__button delete-button">
          <app-icon 
            name="delete"
            color="var(--text-secondary)"
            size="var(--fs-xl)"
          />
          Delete
        </app-button>
      </app-dropdown>
    </div>
  </Teleport>
</template>

<style scoped>
  .message-menu__anchor {
    position: fixed;
    z-index: 1000;
  }
  .message-menu__dropdown {
    max-width: 300px;
    width: 100%;
  }
  .message-menu__button {
    padding: 5px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background-color var(--transition-slow);
  }
  .message-menu__button:hover {
    background-color: var(--bg-surface-3);
  }
  .delete-button {
    color: var(--error);
  }
  .delete-button :deep(.icon path) {
    fill: var(--error);
  }
  .message-menu__reactions {
    display: flex;
    justify-content: space-between;
    padding: 8px 10px;
    border-bottom: 1px solid var(--border);
  }
  .message-menu__reaction {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    border-radius: 8px;
    transition: transform 0.1s, background var(--transition-base);
  }
  .message-menu__reaction:hover {
    transform: scale(1.2);
    background: rgba(255, 255, 255, 0.08);
  }
</style>
