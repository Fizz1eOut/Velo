<script setup lang="ts">
  withDefaults(defineProps<{
    src: string | null
    alt?: string
    size?: 'sm' | 'md' | 'lg'
  }>(), {
    alt: 'User avatar',
    size: 'md'
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
  </div>
</template>

<style scoped>
  .avatar {
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
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
  }
  .avatar__placeholder svg {
    width: 65%;
    height: 65%;
  }
</style>
