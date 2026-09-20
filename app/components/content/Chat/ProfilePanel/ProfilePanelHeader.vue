<script setup lang="ts">
  import type { ChatListItem } from '~/interface/chat.interface';
  import { isOnline } from '~/utils/isOnline';
  import AppAvatar from '~/components/base/AppAvatar.vue';

  interface ProfilePanelHeaderProps {
    profile?: ChatListItem['profile'] | null;
  }
  defineProps<ProfilePanelHeaderProps>();
</script>

<template>
  <div v-if="profile" class="profile-panel-header">
    <div class="profile-panel-header__content">
      <div class="profile-panel-header__avatar">
        <app-avatar 
          :src="profile?.avatar_url" 
          :alt="profile?.username"
          :status="isOnline(profile?.last_seen, profile?.status) ? 'online' : 'offline'"
          size="lg"
        />
      </div>
      <div class="profile-panel-header__username">@{{ profile?.username }}</div>
      <div class="profile-panel-header__status">
        {{ isOnline(profile?.last_seen, profile?.status) ? 'Online' : 'Offline' }}
      </div>
      <div class="profile-panel-header__last-seen">
        Last seen: {{ profile?.last_seen ? new Date(profile.last_seen).toLocaleString() : 'Never' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .profile-panel-header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    text-align: center;
  }
  .profile-panel-header__avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  .profile-panel-header__username {
     font-size: var(--fs-2xl);
    font-weight: var(--fw-medium);
    color: var(--text-primary);
  }
  .profile-panel-header__status {
    font-size: var(--fs-md);
    color: var(--text-secondary);
  }
  .profile-panel-header__last-seen {
    font-size: var(--fs-md);
    color: var(--text-secondary);
  }
  :deep(.avatar__placeholder) {
    background-color: var(--bg-surface-3);
  }
</style>
