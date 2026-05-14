<script setup lang="ts">
  import AppTitle from '~/components/base/AppTitle.vue';
  import AppSubtitle from '~/components/base/AppSubtitle.vue';

  interface AuthFormProps {
    title: string;
    subtitle: string;
    pageTitle: string;
  }
  defineProps<AuthFormProps>();
</script>

<template>
  <div class="auth-intro">
    <div class="auth-intro__page-title">{{ pageTitle }}</div>
    <app-title class="auth-intro__title">{{ title }}</app-title>
    <app-subtitle class="auth-intro__subtitle">{{ subtitle }}</app-subtitle>
  </div>
</template>

<style scoped>
  .auth-intro__page-title {
    margin-bottom: var(--space-xs);
    font-size: var(--fs-lg);
    font-weight: var(--fw-semibold);
    color: #7C74FF;
  }
  .auth-intro__title {
    font-size: var(--fs-3xl);
    font-weight: var(--fw-bold);
    color: #1A1830;
  }
  .auth-intro__subtitle {
    color: #252345;
    font-size: var(--fs-md);
    font-weight: var(--fw-normal);
  }
</style>
