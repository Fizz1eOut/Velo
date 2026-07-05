<script setup lang="ts">
  withDefaults(defineProps<{
    src: string | null
    alt?: string
    size?: 'sm' | 'md' | 'lg'
    status?: 'online' | 'offline' | 'dnd' | null;
  }>(), {
    alt: 'User avatar',
    size: 'md',
    status: null
  });
</script>

<template>
  <div class="avatar" :class="`avatar--${size}`">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="avatar__img"
    >
    <div v-else class="avatar__placeholder">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="12" cy="8" r="4"
          fill="#9CA3AF"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#9CA3AF"/>
      </svg>
    </div>
    <span
      v-if="status"
      class="avatar__status"
      :class="`avatar__status--${status}`"
    />
  </div>
</template>

<style scoped>
  .avatar {
    position: relative;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .avatar__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  .avatar--sm {
    width: 32px;
    height: 32px;
  }
  .avatar--md {
    width: 44px;
    height: 44px;
  }
  .avatar--lg {
    width: 64px;
    height: 64px;
  }
  .avatar__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .avatar__placeholder {
    width: 100%;
    height: 100%;
    background-color: var(--bg-surface-2);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  .avatar__placeholder svg {
    width: 65%;
    height: 65%;
  }
  .avatar__status {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid var(--bg-surface);
  }
  .avatar__status--online  { 
    background-color: var(--online);
   }
  .avatar__status--offline { 
    background-color: var(--offline);
   }
  .avatar__status--dnd { 
    background-color: var(--badge) 
    }
</style>
