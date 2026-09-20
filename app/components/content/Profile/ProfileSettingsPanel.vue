<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { getProfile } from '~/api/users/getProfile';
  import type { Profile } from '~/interface/profile.interface';
  import AppLoadingSpinner from '~/components/base/AppLoadingSpinner.vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';
  import AppDivider from '~/components/base/AppDivider.vue';
  import AppSidebar from '~/components/base/AppSidebar.vue';
  import ProfileSettingsHeader from '~/components/content/Profile/ProfileSettingsHeader.vue';

  interface ProfileSettingsPanelProps {
    userId: string;
  }
  const props =defineProps<ProfileSettingsPanelProps>();

  const active = ref(false);
  const profile = ref<Profile | null>(null);
  const loading = ref(true);

  const openSidebar = () => {
    active.value = true;
  };
  const closeSidebar = () => {
    active.value = false;
  };

  const fetchProfile = async () => {
    loading.value = true;
    try {
      const { data } = await getProfile(props.userId);
      profile.value = data;
      loading.value = false;}
    catch (error) {
      console.error('Error fetching profile:', error);
      loading.value = false;
    }
  };

  const onAvatarUpdated = (avatarUrl: string) => {
    if (profile.value) {
      profile.value.avatar_url = avatarUrl;
    }
  };
  
  onMounted(() => {
    fetchProfile();
  });
</script>

<template>
  <div class="settings-panel">
    <app-button @click="openSidebar">
      <app-icon
        name="settings"
        size="var(--fs-xl)"
        color="var(--text-secondary)"
      />
    </app-button>
    <app-sidebar v-if="profile" :active="active" @close="closeSidebar">
      <app-loading-spinner v-if="loading" size="sm" />
      <div v-else class="settings-panel__content">
        <app-divider />
        <profile-settings-header :profile="profile" @avatar-updated="onAvatarUpdated" />
        <app-divider />
      </div>
    </app-sidebar>
  </div>
</template>

<style scoped>

</style>
