<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';

  interface ChatImageLightbox {
    src: string;
    alt?: string;
  }
  defineProps<ChatImageLightbox>();

  const emit = defineEmits<{
    close: [];
  }>();

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') emit('close');
  };

  onMounted(() => document.addEventListener('keydown', onKeydown));
  onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <teleport to="body">
    <div class="chat-lightbox" @click.self="emit('close')">
      <app-button class="chat-lightbox__close" @click="emit('close')">
        <app-icon 
          name="cross"
          size="var(--fs-2xl)"
          color="var(--text-secondary)"
        />
      </app-button>
      <img :src="src" :alt="alt ?? 'image'" class="chat-lightbox__image">
    </div>
  </teleport>
</template>

<style scoped>
  .chat-lightbox {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    cursor: zoom-out;
  }
  .chat-lightbox__image {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
  }
  .chat-lightbox__close {
    position: absolute;
    top: 16px;
    right: 16px;
    max-width: 20px;
    max-height: 20px;
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 28px;
    cursor: pointer;
    line-height: 1;
    padding: 8px;
  }
</style>
