<script setup lang="ts">
  import AppIcon from '~/components/base/AppIcon.vue';
  // import ChatOptionsMenu from '~/components/content/Chat/ChatOptionsMenu.vue';


</script>

<template>
  <div class="chat-header__actions">
    <div class="chat-header__item">
      <app-icon 
        name="search" 
        color="var(--text-secondary)" 
        size="var(--fs-xl)"
      />
    </div>

    <div class="chat-header__item">
      <app-icon 
        name="call" 
        color="var(--text-secondary)" 
        size="var(--fs-xl)"
      />
    </div>

    <div class="chat-header__item">
      <app-icon 
        name="video-camera" 
        color="var(--text-secondary)" 
        size="var(--fs-xl)"
      />
    </div>

    <div class="chat-header__item">
      <app-icon 
        name="three-dots" 
        color="var(--text-secondary)" 
        size="var(--fs-xl)"
      />
      <!-- <chat-options-menu /> -->
    </div>
  </div>
</template>

<style scoped>
  .chat-header__actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .chat-header__item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 34px;
    height: 34px;
    cursor: pointer;
    transition: background-color var(--transition-slow);
    border-radius: var(--radius-sm);
  }
  .chat-header__item:hover {
    background-color: var(--bg-surface-2);
  }
</style>
