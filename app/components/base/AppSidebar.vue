<script setup lang="ts">
  import AppContainer from '@/components/base/AppContainer.vue';
  import AppIcon from '~/components/base/AppIcon.vue';
  import AppButton from '~/components/base/AppButton.vue';
  
  interface AppSidebarProps {
    active?: boolean;
  }
  defineProps<AppSidebarProps>();
  const emit = defineEmits<{
    (e: 'close'): void;
  }>();
</script>

<template>
  <div v-if="active" class="sidebar">
    <app-container class="sidebar__container">
      <div class="sidebar__header">
        <app-button class="sidebar__cross-btn" @click="emit('close')">
          <app-icon 
            name="cross"
            color="var(--text-primary)"
            size="var(--fs-xl)"
          />
        </app-button>
      </div>
      <div class="sidebar__body">
        <slot />
      </div>
    </app-container>
  </div>
</template>

<style scoped>  
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    border-right: 1px solid var(--border);
    width: 300px; 
    height: 100vh;
    z-index: 10;
    transition: width var(--transition-base);
    background-color: var(--bg-surface-2);

    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
  }
  .sidebar__container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .sidebar__header {
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .sidebar__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
  }
  .sidebar__cross-btn {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background-color: var(--bg-surface-3);
    border-radius: var(--radius-full);
  }

  .sidebar::-webkit-scrollbar {
    width: 6px;
  }
  .sidebar::-webkit-scrollbar-track {
    background: transparent;
  }
  .sidebar::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.25);
    border-radius: var(--radius-sm);
    transition: background-color var(--transition-base);
  }
  .sidebar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.45);
  }
</style>
