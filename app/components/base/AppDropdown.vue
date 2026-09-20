<script setup lang="ts">
  import { ref } from 'vue';
  import AppUnderlay from '@/components/base/AppUnderlay.vue';
  import AppContainer from '@/components/base/AppContainer.vue';
  import { useClickOutside } from '@/composables/useClickOutside';

  interface dropdownProps {
    active?: boolean;
  }
  defineProps<dropdownProps>();

  const emit = defineEmits<{
    (e: 'close'): void;
  }>();

  const rootEl = ref<HTMLElement | null>(null);

  useClickOutside(rootEl, () => emit('close'));
</script>

<template>
  <Transition>
    <div v-if="active" ref="rootEl" class="dropdown">
      <app-underlay>
        <app-container>
          <ul class="dropdown-list">
            <slot />
          </ul>
        </app-container>
      </app-underlay>
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity var(--transition-smooth), transform var(--transition-smooth);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.dropdown {
  position: absolute;
  left: 0px;
  z-index: 10;
  top: 100%;
  border: 1px solid var(--border);
  background-color: var(--bg-surface);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-sm);
  width: 100%;
}
.dropdown-list > *:not(:last-child) {
  margin-bottom: 10px;
}
</style>
