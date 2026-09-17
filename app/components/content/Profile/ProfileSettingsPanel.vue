<script setup lang="ts">
  import { ref } from 'vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';
  import AppSidebar from '~/components/base/AppSidebar.vue';

  interface ProfileSettingsPanelProps {
    userId: string;
  }
  defineProps<ProfileSettingsPanelProps>();

  const active = ref(false);

  const openSidebar = () => {
    active.value = true;
  };
  const closeSidebar = () => {
    active.value = false;
  };
</script>

<template>
  <div class="settings-panel">
    <app-button @click="openSidebar">
      <app-icon
        name="settings"
        size="var(--fs-2xl)"
        color="var(--text-secondary)"
      />
    </app-button>
    <app-sidebar :active="active" @close="closeSidebar" />
  </div>
</template>

<style scoped>

</style>
