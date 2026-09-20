<script setup lang="ts">
  import AppIcon from '~/components/base/AppIcon.vue';
  import ChatSearch from '~/components/content/Chat/ChatSearch.vue';
  import ChatOptionsMenu from '~/components/content/Chat/ChatOptionsMenu.vue';

  interface ChatHeaderActions {
    chatId: string;
    userId: string;
  }
  defineProps<ChatHeaderActions>();
</script>

<template>
  <div class="chat-header__actions">
    <div class="chat-header__item">
      <chat-search class="chat-search" />
    </div>

    <div class="chat-header__item">
      <div class="chat-header__row">
        <app-icon 
          name="call" 
          color="var(--text-secondary)" 
          size="var(--fs-xl)"
        />
      </div>
    </div>

    <div class="chat-header__item">
      <div class="chat-header__row">
        <app-icon 
          name="video-camera" 
          color="var(--text-secondary)" 
          size="var(--fs-xl)"
        />
      </div>
    </div>

    <div class="chat-header__item">
      <chat-options-menu :chat-id="chatId" :user-id="userId"/>
    </div>
  </div>
</template>

<style scoped>
  .chat-search {
    width: 100%;
  }
  .chat-header__actions {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 10px;
    width: 100%;
  } 
  .chat-header__row {
    width: 100%;
  }
  .chat-header__row {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 34px;
    height: 34px;
    cursor: pointer;
    transition: background-color var(--transition-slow);
    border-radius: var(--radius-sm);
    cursor: not-allowed;
  }
  .chat-header__row:hover {
    background-color: var(--bg-surface-2);
  }
  @media (max-width: 991px) {
    .chat-search :deep(.chat-search__bar) {
      position: absolute;
      top: 68px;
      left: 0;
      width: 100%;
      z-index: 10;
      background-color: var(--bg-surface-2);
      padding: 10px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
    }
  }
</style>
