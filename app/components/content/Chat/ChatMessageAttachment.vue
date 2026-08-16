<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useSupabaseClient } from '#imports';
  import type { Database } from '~/../types/database';
  import type { Message } from '~/interface/message.interface';
  import ChatImageLightbox from './ChatImageLightbox.vue';

  interface ChatMessageAttachment {
    message: Message;
  }
  const props = defineProps<ChatMessageAttachment>();

  const emit = defineEmits<{
    (e: 'media-loaded'): void;
  }>();

  const supabase = useSupabaseClient<Database>();

  const signedUrl = ref<string | null>(null);
  const isLoading = ref(false);
  const isLightboxOpen = ref(false);

  const formatSize = (bytes?: number | null) => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let i = 0;
    while (value >= 1024 && i < units.length - 1) {
      value /= 1024;
      i++;
    }
    return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
  };

  const loadSignedUrl = async (path: string, attempt = 1): Promise<void> => {
    isLoading.value = true;
    await supabase.auth.getSession();

    const { data, error } = await supabase.storage
      .from('chat-attachments')
      .createSignedUrl(path, 60 * 60);

    if (error) {
      if (attempt < 2) {
        isLoading.value = false;
        return loadSignedUrl(path, attempt + 1);
      }
      
      emit('media-loaded');
    } else if (data) {
      signedUrl.value = data.signedUrl;
    }

    isLoading.value = false;
  };

  watch(
    () => props.message.file_url,
    (path) => {
      if (path) loadSignedUrl(path);
    },
    { immediate: true }
  );

  const onMediaLoad = () => emit('media-loaded');
</script>

<template>
  <div class="chat-attachment">
    <div v-if="isLoading" class="chat-attachment__loading">
      Loading...
    </div>

    <template v-else-if="signedUrl">
      <img
        v-if="message.type === 'image'"
        :src="signedUrl"
        :alt="message.file_name ?? 'image'"
        class="chat-attachment__image"
        @click="isLightboxOpen = true"
        @load="onMediaLoad"
        @error="onMediaLoad"
      >

      <video
        v-else-if="message.type === 'video'"
        :src="signedUrl"
        controls
        class="chat-attachment__video"
        @loadedmetadata="onMediaLoad"
        @error="onMediaLoad"
      />

      <audio
        v-else-if="message.type === 'audio'"
        :src="signedUrl"
        controls
        class="chat-attachment__audio"
        @loadedmetadata="onMediaLoad"
        @error="onMediaLoad"
      />

      <a
        v-else
        :href="signedUrl"
        :download="message.file_name"
        target="_blank"
        rel="noopener"
        class="chat-attachment__file"
      >
        <span class="chat-attachment__file-name">{{ message.file_name }}</span>
        <span class="chat-attachment__file-size">{{ formatSize(message.file_size) }}</span>
      </a>
    </template>

    <div v-else class="chat-attachment__error">
      Failed to load attachment
    </div>

    <chat-image-lightbox
      v-if="isLightboxOpen && signedUrl"
      :src="signedUrl"
      :alt="message.file_name ?? 'image'"
      @close="isLightboxOpen = false"
    />
  </div>
</template>

<style scoped>
  .chat-attachment__image {
    max-width: 400px;
    min-height: 120px;
    background: var(--bg-surface-2);
    border-radius: var(--radius-sm, 8px);
    display: block;
  }
  .chat-attachment__video,
  .chat-attachment__audio {
    max-width: 100%;
  }
  .chat-attachment__file {
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-decoration: none;
    color: inherit;
  }
  .chat-attachment__file-name {
    font-size: var(--fs-md);
    word-break: break-word;
  }
  .chat-attachment__file-size {
    font-size: var(--fs-xs);
    opacity: 0.7;
  }
  .chat-attachment__loading,
  .chat-attachment__error {
    font-size: var(--fs-sm);
    opacity: 0.7;
  }
</style>
