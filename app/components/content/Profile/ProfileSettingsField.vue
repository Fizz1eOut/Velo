<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue';
  import AppInput from '~/components/inputs/AppInput.vue';
  import AppIcon from '~/components/base/AppIcon.vue';

  interface ProfileSettingsFieldProps {
    icon: string;
    label: string;
    value: string | null;
    prefix?: string;
  }
  const props = defineProps<ProfileSettingsFieldProps>();

  const emit = defineEmits<{
    (e: 'save', value: string): void;
  }>(); 

  const editing = ref(false);
  const draft = ref(props.value ?? '');
  const inputRef = ref<InstanceType<typeof AppInput> | null>(null);

  watch(() => props.value, (newVal) => {
    if (!editing.value) draft.value = newVal ?? '';
  });

  const startEdit = () => {
    draft.value = props.value ?? '';
    editing.value = true;
    nextTick(() => inputRef.value?.focus());
  };

  const cancelEdit = () => {
    editing.value = false;
    draft.value = props.value ?? '';
  };

  const save = () => {
    const trimmed = String(draft.value).trim();
    if (!trimmed || trimmed === props.value) {
      editing.value = false;
      return;
    }
    emit('save', trimmed);
    editing.value = false;
  };
</script>

<template>
  <div class="settings-field">
    <div class="settings-field__body">
      <app-icon
        :name="icon" size="var(--fs-lg)" color="var(--text-muted)"
        class="settings-field__icon" />
      <div class="settings-field__content">
        <div class="settings-field__label">{{ label }}</div>
        <div v-if="!editing" class="settings-field__value">
          <span v-if="prefix">{{ prefix }}</span>{{ value }}
        </div>
        <app-input
          v-else
          ref="inputRef"
          v-model="draft"
          class="settings-field__input"
          @keyup.enter="save"
          @keyup.esc="cancelEdit"
        />
      </div>
      <button
        v-if="!editing" type="button" class="settings-field__edit"
        @click="startEdit">
        Edit
      </button>
      <div v-else class="settings-field__actions">
        <button type="button" class="settings-field__action" @click="cancelEdit">Cancel</button>
        <button type="button" class="settings-field__action settings-field__action--save" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .settings-field__body{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  .settings-field__icon {
    flex-shrink: 0;
  }
  .settings-field__content{
    flex: 1;
    min-width: 0;
  }
  .settings-field__label {
    font-size: var(--fs-xs);
    color: var(--text-muted);
  }
  .settings-field__value {
    font-size: var(--fs-md);
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .settings-field__input {
    margin-top: 4px;
  }
  .settings-field__edit {
    background: none;
    border: none;
    padding: 0;
    color: var(--primary);
    font-size: var(--fs-sm);
    cursor: pointer;
    flex-shrink: 0;
  }
  .settings-field__actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }
  .settings-field__action {
    background: none;
    border: none;
    padding: 4px 8px;
    font-size: var(--fs-sm);
    cursor: pointer;
    color: var(--text-secondary);
  }
  .settings-field__action--save {
    color: var(--primary);
    font-weight: var(--fw-semibold);
  }
</style>
