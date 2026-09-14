<script setup lang="ts">
  import { useThemeStore } from '~/stores/themeStore';
  import AppIcon from '~/components/base/AppIcon.vue';
  import AppButton from '~/components/base/AppButton.vue';

  interface UserProfilePanelProps {
    userId: string;
  }
  defineProps<UserProfilePanelProps>();

  const theme = useThemeStore();
</script>

<template>
  <div class="user-profile-panel">
    <div class="user-profile-panel__theme-toggle">
      <app-button @click="theme.toggleTheme()">
        <app-icon
          :name="theme.theme === 'dark' ? 'sun' : 'moon'"
          size="var(--fs-2xl)"
          :color="theme.theme === 'dark' ? 'var(--away)' : 'var(--text-secondary)'"
        />
        {{ theme.theme }}
      </app-button>
    </div>
  </div>
</template>

<style scoped>

</style>
