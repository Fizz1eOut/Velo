<script setup lang="ts">
  import AppToast from '~/components/base/AppToast.vue';
</script>

<template>
  <div class="layout-wrapper">
    <main>
      <slot />
      <app-toast />
    </main>
  </div>
</template>
