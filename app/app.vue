<script setup lang="ts">
  import { NuxtLayout, NuxtPage } from '#components';
  import { useSupabaseUser } from '#imports';
  import { navigateTo } from 'nuxt/app';
  import { watch } from 'vue';

  const user = useSupabaseUser();

  watch(user, (newUser) => {
    if (newUser) {
      navigateTo('/');
    } else {
      navigateTo('/login');
    }
  });
</script>

<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>
