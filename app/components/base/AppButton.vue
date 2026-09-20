<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    primary?: boolean;
    secondary?: boolean;
    disabled?: boolean;
  }>();

  const classes = computed(() => ({
    'button-primary': props.primary,
    'button-secondary': props.secondary,
    'button-disabled': props.disabled,
  }));
</script>

<template>
  <button
    type="button"
    class="button"
    :class="classes"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
  .button {
    width: 100%;
    height: 100%;
    font-size: var(--fs-sm);
    font-weight: var(--fw-normal);
    color: var(--text-primary);
    background-color: transparent;
    cursor: pointer;
    border-radius: 0;
    border: none;
    padding: 0;
    font-family: var(--ff-base);  
  }
  .button:hover {
    background-color: transparent
  }

  .button-primary {
    height: var(--space-2xl);
    color: var(--text-primary);
    background-color: var(--primary);
    border-radius: var(--radius-sm);
    transition: background-color var(--transition-slow), box-shadow var(--transition-slow);
  }
  .button-primary:hover {
    background-color: var(--primary-hover);
    box-shadow: var(--shadow-glow);
  }

  .button-secondary {
    height: var(--space-2xl);
    border: 1px solid var(--border);
    color: var(--text-primary);
    background-color: transparent;
    transition: color var(--transition-slow), box-shadow var(--transition-slow), border var(--transition-slow);
    border-radius: var(--radius-sm);
  }
  .button-secondary:hover {
    color: var(--text-primary);
    border: 1px solid var(--border-focus);
    box-shadow: var(--shadow-lg);
  }

  .button-disabled {
    height: var(--space-2xl);
    background-color: var(--text-disabled);
    border-radius: 10px;
    opacity: 0.3;
    transition: background-color var(--transition-slow), opacity var(--transition-slow);
    cursor: not-allowed;
  }
  .button-disabled:hover {
    opacity: 0.4;
    background-color: var(--text-disabled);
  }
</style>