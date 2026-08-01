<script setup lang="ts">
  import AppToast from '~/components/base/AppToast.vue';
  import AppConfirm from '~/components/base/AppConfirm.vue';

</script>

<template>
  <div class="layout-wrapper">
    <main>
      <slot />
      <app-toast />
      <app-confirm />
    </main>
  </div>
</template>
