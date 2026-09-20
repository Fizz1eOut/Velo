<script setup lang="ts">
  import { ref } from 'vue';
  import type { Profile } from '~/interface/profile.interface';
  import { updateAvatar } from '~/api/users/updateAvatar';
  import AppAvatar from '~/components/base/AppAvatar.vue';
  import AppLoadingSpinner from '~/components/base/AppLoadingSpinner.vue';

  interface ProfileSettingsHeaderProps {
    profile: Profile;
  }
  const props = defineProps<ProfileSettingsHeaderProps>();

  const emit = defineEmits<{
    (e: 'avatar-updated', avatarUrl: string): void;
  }>();

  const fileInput = ref<HTMLInputElement | null>(null);
  const uploading = ref(false);

  const openFilePicker = () => {
    if (uploading.value) return;
    fileInput.value?.click();
  };

  const onFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      console.error('Файл должен быть изображением');
      target.value = '';
      return;
    }
    const maxSizeMb = 5;
    if (file.size > maxSizeMb * 1024 * 1024) {
      console.error(`Максимальный размер файла — ${maxSizeMb}MB`);
      target.value = '';
      return;
    }

    uploading.value = true;
    try {
      const { data: avatarUrl, error } = await updateAvatar(props.profile.id, file);
      if (error) {
        console.error('Error uploading avatar:', error);
        return;
      }
      if (avatarUrl) emit('avatar-updated', avatarUrl);
    } finally {
      uploading.value = false;
      target.value = '';
    }
  };
</script>

<template>
  <div class="settings-header">
    <div class="settings-header__body">
      <div class="settings-header__avatar-wrapper" @click="openFilePicker">
        <app-avatar
          :src="profile?.avatar_url"
          :alt="profile?.username"
          size="lg"
          class="settings-header__avatar"
        />
        <div v-if="uploading" class="settings-header__avatar-overlay">
          <app-loading-spinner size="sm" />
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="settings-header__file-input"
          @change="onFileChange"
        >
      </div>
      <div class="settings-header__content">
        <div v-if="profile?.full_name" class="settings-header__name">{{ profile?.full_name }}</div>
        <div v-if="profile?.username" class="settings-header__username">{{ profile?.username}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .settings-header__body {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .settings-header__avatar-wrapper {
    position: relative;
    cursor: pointer;
  }
  .settings-header__avatar {
    transition: opacity var(--transition-slow);
  }
  .settings-header__avatar-wrapper:hover .settings-header__avatar {
    opacity: 0.7;
  }
  .settings-header__avatar-wrapper::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity var(--transition-slow);
    pointer-events: none;
  }
  .settings-header__avatar-wrapper:hover::after {
    opacity: 1;
  }
  .settings-header__avatar-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
  }
  .settings-header__file-input {
    display: none;
  }
  .settings-header__name {
    font-size: var(--fs-xl);
    color: var(--text-primary);
  }
  .settings-header__username {
    font-size: var(--fs-lg);
    color: var(--text-secondary);
  }
</style>
