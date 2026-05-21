<script setup lang="ts">
  import AppToast from '~/components/base/AppToast.vue';
  import AppContainer from '~/components/base/AppContainer.vue';
</script>

<template>
  <div class="layout-wrapper">

    <main>
      <app-container>
        <slot />
        <app-toast />
      </app-container>
    </main>
  </div>
</template>
