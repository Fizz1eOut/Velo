<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useSupabaseClient } from '#imports';
  import type { Database } from '~/../types/database';
  import type { Message } from '~/interface/message.interface';

  interface ProfilePanelMediaProps {
    messages?: Message[];
    isLoading?: boolean;
  }
  const props = defineProps<ProfilePanelMediaProps>();

  const supabase = useSupabaseClient<Database>();
  const PREVIEW_LIMIT = 6;

  const allPhotos = computed(() => (props.messages ?? []).filter((m) => m.type === 'image'));
  const allFiles = computed(() => (props.messages ?? []).filter((m) => m.type === 'file'));

  const showAllPhotos = ref(false);
  const showAllFiles = ref(false);

  const photos = computed(() =>
    showAllPhotos.value ? allPhotos.value : allPhotos.value.slice(0, PREVIEW_LIMIT)
  );
  const files = computed(() =>
    showAllFiles.value ? allFiles.value : allFiles.value.slice(0, PREVIEW_LIMIT)
  );

  const urlMap = ref<Record<string, string | null>>({});
  const resolvingIds = new Set<string>();

  const getSignedUrl = async (path: string, attempt = 1): Promise<string | null> => {
    await supabase.auth.getSession();

    const { data, error } = await supabase.storage
      .from('chat-attachments')
      .createSignedUrl(path, 60 * 60);

    if (error) {
      console.error('createSignedUrl error:', error, 'for path:', path);
      if (attempt < 2) return getSignedUrl(path, attempt + 1);
      return null;
    }

    return data?.signedUrl ?? null;
  };

  const resolveUrls = async (messages: Message[]) => {
    const targets = messages.filter(
      (m) => m.file_url && !(m.id in urlMap.value) && !resolvingIds.has(m.id)
    );

    await Promise.all(
      targets.map(async (m) => {
        resolvingIds.add(m.id);
        urlMap.value[m.id] = await getSignedUrl(m.file_url as string);
        resolvingIds.delete(m.id);
      })
    );
  };

  watch(
    [photos, files],
    ([visiblePhotos, visibleFiles]) => {
      resolveUrls([...visiblePhotos, ...visibleFiles]);
    },
    { immediate: true }
  );

  function formatSize(bytes?: number | null) {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(1)} ${units[i]}`;
  }
</script>

<template>
  <div class="profile-panel-media">
    <div v-if="isLoading" class="profile-panel-media__loading">Loading...</div>

    <template v-else>
      <div v-if="allPhotos.length" class="profile-panel-media__section">
        <div class="profile-panel-media__header">
          <div class="profile-panel-media__title">Photos ({{ allPhotos.length }})</div>
          <button
            v-if="allPhotos.length > PREVIEW_LIMIT"
            type="button"
            class="profile-panel-media__see-all"
            @click="showAllPhotos = !showAllPhotos"
          >
            {{ showAllPhotos ? 'Show less' : 'See all' }}
          </button>
        </div>
        <div class="profile-panel-media__photos-grid">
          <a
            v-for="photo in photos"
            :key="photo.id"
            :href="urlMap[photo.id] ?? undefined"
            target="_blank"
            rel="noopener"
            class="profile-panel-media__photo"
          >
            <img
              v-if="urlMap[photo.id]"
              :src="urlMap[photo.id] as string"
              :alt="photo.file_name ?? 'photo'"
            >
            <div v-else class="profile-panel-media__photo-placeholder" />
          </a>
        </div>
      </div>

      <div v-if="allFiles.length" class="profile-panel-media__section">
        <div class="profile-panel-media__header">
          <div class="profile-panel-media__title">Files ({{ allFiles.length }})</div>
          <button
            v-if="allFiles.length > PREVIEW_LIMIT"
            type="button"
            class="profile-panel-media__see-all"
            @click="showAllFiles = !showAllFiles"
          >
            {{ showAllFiles ? 'Show less' : 'See all' }}
          </button>
        </div>
        <div class="profile-panel-media__files-list">
          <a
            v-for="file in files"
            :key="file.id"
            :href="urlMap[file.id] ?? undefined"
            :download="file.file_name"
            target="_blank"
            rel="noopener"
            class="profile-panel-media__file"
          >
            <div class="profile-panel-media__file-icon">📄</div>
            <div class="profile-panel-media__file-info">
              <div class="profile-panel-media__file-name">{{ file.file_name }}</div>
              <div class="profile-panel-media__file-size">{{ formatSize(file.file_size) }}</div>
            </div>
          </a>
        </div>
      </div>

      <div v-if="!allPhotos.length && !allFiles.length" class="profile-panel-media__empty">
        No attachments
      </div>
    </template>
  </div>
</template>

<style scoped>
.profile-panel-media {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.profile-panel-media__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.profile-panel-media__title {
  font-size: var(--fs-md);
  font-weight: var(--fw-medium);
  color: var(--text-secondary);
  text-align: left;
}
.profile-panel-media__see-all {
  background: none;
  border: none;
  padding: 0;
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--accent-primary, #4f9eff);
  cursor: pointer;
}
.profile-panel-media__see-all:hover {
  text-decoration: underline;
}
.profile-panel-media__photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}
.profile-panel-media__photo {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 8px;
  background-color: var(--bg-surface-3);
  display: block;
}
.profile-panel-media__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.profile-panel-media__photo-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--bg-surface-3);
}
.profile-panel-media__files-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.profile-panel-media__file {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  background-color: var(--bg-surface-3);
  text-align: left;
  text-decoration: none;
  color: inherit;
}
.profile-panel-media__file-icon {
  font-size: var(--fs-xl);
}
.profile-panel-media__file-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.profile-panel-media__file-name {
  font-size: var(--fs-md);
  color: var(--text-primary);
  word-break: break-word;
}
.profile-panel-media__file-size {
  font-size: var(--fs-sm);
  color: var(--text-secondary);
}
.profile-panel-media__empty,
.profile-panel-media__loading {
  font-size: var(--fs-md);
  color: var(--text-secondary);
}
</style>
