<script setup lang="ts">
  import AppDropdown from '~/components/base/AppDropdown.vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';

  interface ChatMessageMenuProps {
    active: boolean;
    x: number;
    y: number;
  }
  defineProps<ChatMessageMenuProps>();

  const emit = defineEmits<{
    (e: 'close'): void;
  }>();
</script>

<template>
  <Teleport to="body">
    <div class="message-menu__anchor" :style="{ left: `${x}px`, top: `${y}px` }">
      <app-dropdown
        :active="active"
        style="width: 260px; max-width: calc(100vw - 20px);"
        @close="emit('close')"
      >
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
</style>
