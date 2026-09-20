<script setup lang="ts">
  const emit = defineEmits<{
    submit: []
  }>();
</script>

<template>
  <form class="auth-form" @submit.prevent="emit('submit')">
    <slot />
  </form>
</template>
