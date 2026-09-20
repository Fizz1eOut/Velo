<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue';
  
  interface ProfileSettingsBioProps {
    value: string | null;
    maxLength?: number;
  }
  const props = withDefaults(defineProps<ProfileSettingsBioProps>(), {
    maxLength: 150,
  });

  const emit = defineEmits<{
    (e: 'save', value: string): void;
  }>();

  const editing = ref(false);
  const draft = ref(props.value ?? '');
  const textareaRef = ref<HTMLTextAreaElement | null>(null);

  watch(() => props.value, (newVal) => {
    if (!editing.value) draft.value = newVal ?? '';
  });

  const startEdit = () => {
    draft.value = props.value ?? '';
    editing.value = true;
    nextTick(() => textareaRef.value?.focus());
  };

  const cancelEdit = () => {
    editing.value = false;
    draft.value = props.value ?? '';
  };

  const save = () => {
    const trimmed = draft.value.trim();
    if (trimmed === (props.value ?? '')) {
      editing.value = false;
      return;
    }
    emit('save', trimmed);
    editing.value = false;
  };
</script>

<template>
  <div class="settings-bio">
    <div class="settings-bio__label">Bio</div>

    <div v-if="!editing" class="settings-bio__display" @click="startEdit">
      <p v-if="value" class="settings-bio__text">{{ value }}</p>
      <p v-else class="settings-bio__placeholder">Add a bio</p>
    </div>

    <div v-else class="settings-bio__editing">
      <textarea
        ref="textareaRef"
        v-model="draft"
        :maxlength="maxLength"
        class="settings-bio__textarea"
        rows="3"
        @keyup.esc="cancelEdit"
      />
      <div class="settings-bio__footer">
        <span class="settings-bio__counter">{{ draft.length }}/{{ maxLength }}</span>
        <div class="settings-bio__actions">
          <button type="button" class="settings-bio__action" @click="cancelEdit">Cancel</button>
          <button type="button" class="settings-bio__action settings-bio__action--save" @click="save">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .settings-bio {
    padding: 12px 0;
  }
  .settings-bio__label {
    font-size: var(--fs-xs);
    color: var(--text-muted);
    margin-bottom: 8px;
  }
  .settings-bio__display {
    cursor: pointer;
    background-color: var(--bg-surface-3);
    border-radius: var(--radius-sm);
    padding: 12px;
    min-height: 60px;
  }
  .settings-bio__text {
    font-size: var(--fs-sm);
    color: var(--text-primary);
    margin: 0;
    white-space: pre-wrap;
  }
  .settings-bio__placeholder {
    font-size: var(--fs-sm);
    color: var(--text-muted);
    margin: 0;
  }
  .settings-bio__textarea {
    width: 100%;
    background-color: var(--bg-surface-3);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 12px;
    font-size: var(--fs-sm);
    color: var(--text-primary);
    resize: none;
    outline: none;
    font-family: inherit;
  }
  .settings-bio__textarea:focus {
    border-color: var(--primary-soft);
    box-shadow: var(--shadow-glow);
  }
  .settings-bio__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
  }
  .settings-bio__counter {
    font-size: var(--fs-xs);
    color: var(--text-muted);
  }
  .settings-bio__actions {
    display: flex;
    gap: 8px;
  }
  .settings-bio__action {
    background: none;
    border: none;
    padding: 4px 8px;
    font-size: var(--fs-sm);
    cursor: pointer;
    color: var(--text-secondary);
  }
  .settings-bio__action--save {
    color: var(--primary);
    font-weight: var(--fw-semibold);
  }
</style>
