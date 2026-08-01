<script setup lang="ts">
  import { useConfirmState } from '@/composables/useConfirm';
  import AppModal from '@/components/base/AppModal.vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppTitle from '~/components/base/AppTitle.vue';

  const { state, handleConfirm, handleCancel } = useConfirmState();
</script>

<template>
  <app-modal :model-value="state.isOpen" @update:model-value="handleCancel">
    <app-title v-if="state.title">{{ state.title }}</app-title>
    <p class="text">{{ state.message }}</p>

    <div class="actions">
      <app-button secondary type="button" @click="handleCancel">
        {{ state.cancelText }}
      </app-button>
      <app-button
        primary 
        type="button"
        :class="{ danger: state.danger }"
        @click="handleConfirm"
      >
        {{ state.confirmText }}
      </app-button>
    </div>
  </app-modal>
</template>

<style scoped>
  .text {
    margin-top: var(--space-xs);
    font-size: var(--fs-md);
    color: var(--text-secondary);
  }
  .actions {
    margin-top: var(--space-xs);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  .danger {
    background-color: var(--error);
  }
</style>
