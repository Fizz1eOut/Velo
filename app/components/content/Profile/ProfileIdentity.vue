<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { getProfile } from '~/api/users/getProfile';
  import type { Profile } from '~/interface/profile.interface';
  import AppAvatar from '~/components/base/AppAvatar.vue';

  interface ProfileIdentityProps {
    userId: string;
  }
  const props = defineProps<ProfileIdentityProps>();

  const profile = ref<Profile | null>(null);
  const loading = ref(true);

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
  onMounted(() => {
    fetchProfile();
  });
</script>

<template>
  <div class="profile-identity">
    <app-avatar 
      v-if="profile"
      :src="profile?.avatar_url" 
      :alt="profile?.username" 
      size="md" 
    />
    <div class="profile-identity__content">
      <div v-if="profile?.full_name" class="profile-identity__name">{{ profile?.full_name }}</div>
      <div v-if="profile?.username" class="profile-identity__username">{{ profile?.username}}</div>
    </div>
  </div>
</template>

<style scoped>
  .profile-identity {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .profile-identity__name {
    font-size: var(--fs-md);
    color: var(--text-primary);
  }
  .profile-identity__username {
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    color: var(--text-secondary);
  }
</style>
