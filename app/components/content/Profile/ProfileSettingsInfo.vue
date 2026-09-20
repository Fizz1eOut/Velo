<script setup lang="ts">
  import { ref } from 'vue';
  import type { Profile } from '~/interface/profile.interface';
  import { updateProfile } from '~/api/users/updateProfile';
  import AppDivider from '~/components/base/AppDivider.vue';
  import AppSubtitle from '~/components/base/AppSubtitle.vue';
  import ProfileSettingsField from '~/components/content/Profile/ProfileSettingsField.vue';
  import ProfileSettingsBio from '~/components/content/Profile/ProfileSettingsBio.vue';

  interface ProfileSettingsInfoProps {
    profile: Profile;
  }
  const props = defineProps<ProfileSettingsInfoProps>();

  const emit = defineEmits<{
    (e: 'profile-updated', profile: Profile): void;
  }>();

  const saving = ref(false);

  const saveField = async (field: 'full_name' | 'username' | 'bio', value: string) => {
    saving.value = true;
    try {
      const { data, error } = await updateProfile(props.profile.id, { [field]: value });
      if (error) {
        console.error(`Error updating ${field}:`, error);
        return;
      }
      if (data) emit('profile-updated', data);
    } finally {
      saving.value = false;
    }
  };
</script>

<template>
  <div class="settings-info">
    <app-subtitle>Profile</app-subtitle>
    <div class="settings-info__card">
      <profile-settings-field
        icon="user"
        label="Full name"
        :value="profile.full_name"
        @save="(val) => saveField('full_name', val)"
      />
      <app-divider />
      <profile-settings-field
        icon="at-sign"
        label="Username"
        prefix="@"
        :value="profile.username"
        @save="(val) => saveField('username', val)"
      />
      <app-divider />
      <profile-settings-bio
        :value="profile.bio"
        @save="(val) => saveField('bio', val)"
      />
    </div>
  </div>
</template>

<style scoped>
  .settings-info__card {
    margin-top: var(--space-sm);
  }
</style>
