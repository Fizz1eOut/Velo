<script setup lang="ts">
  import { ref } from 'vue';
  import { clearChat } from '~/api/chats/clearChat';
  import { deleteChat } from '~/api/chats/deleteChat';
  import { useConfirm } from '@/composables/useConfirm';
  import { blockUser } from '~/api/blockUser/blockUser';
  import AppIcon from '~/components/base/AppIcon.vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppDropdown from '~/components/base/AppDropdown.vue';
  import AppDivider from '~/components/base/AppDivider.vue';

  interface ChatOptionsMenu {
    chatId: string;
    userId: string;
  }
  const props = defineProps<ChatOptionsMenu>();

  const emit = defineEmits<{
    (e: 'cleared' | 'blocked'): void;
  }>();

  const { confirm } = useConfirm();

  const isOpen = ref(false);
  const openMenu = () => {
    isOpen.value = true;
  };
  const closeMenu = () => {
    isOpen.value = false;
  };

  const onClear = async () => {
    const ok = await confirm({
      title: 'Clear chat',
      message: 'Are you sure you want to clear the chat history? This action cannot be undone.',
      confirmText: 'Clear',
      danger: true
    });
    if (!ok) return;

    const { error } = await clearChat(props.chatId);
    if (!error) emit('cleared');
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: 'Delete chat',
      message: 'Are you sure you want to delete this chat? This action cannot be undone.',
      confirmText: 'Delete',
      danger: true
    });
    if (!ok) return;

    const { error } = await deleteChat(props.chatId);
    if (!error) emit('cleared');
  };

  const onBlock = async () => {
    const ok = await confirm({
      title: 'Block user',
      message: 'This user will no longer be able to message you or view your profile. Your chat with them will be deleted. Continue?',
      confirmText: 'Block',
      danger: true
    });
    if (!ok) return;
 
    const { error } = await blockUser(props.userId);
    if (!error) emit('blocked');
  };
</script>

<template>
  <div class="options-menu">
    <div class="options-menu__icon" @click.stop="openMenu">
      <app-icon 
        name="three-dots" 
        color="var(--text-secondary)" 
        size="var(--fs-xl)"
      />
    </div>

    <app-dropdown :active="isOpen" class="options-menu__dropdown" @close="closeMenu">
      <ul class="options-menu__list">
        <li class="options-menu__item">
          <app-button class="options-menu__button">
            <app-icon 
              name="user"
              size="var(--fs-xl)"
              color="var(--text-secondary)"
            />
            View profile
          </app-button>
        </li>

        <app-divider />

        <li class="options-menu__item">
          <app-button class="options-menu__button button-red" @click="onBlock">
            <app-icon 
              name="block"
              size="var(--fs-xl)"
              color="var(--text-secondary)"
            />
            Block user
          </app-button>
        </li>

        <li class="options-menu__item">
          <app-button class="options-menu__button button-red" @click="onClear">
            <app-icon 
              name="broom"
              size="var(--fs-xl)"
              color="var(--text-secondary)"
            />
            Clear chat history
          </app-button>
        </li>

        <app-divider />

        <li class="options-menu__item">
          <app-button class="options-menu__button button-red" @click="onDelete">
            <app-icon 
              name="delete"
              size="var(--fs-xl)"
              color="var(--text-secondary)"
            />
            Delete chat
          </app-button>
        </li>
      </ul>
    </app-dropdown>
  </div>
</template>

<style scoped>
  .options-menu__icon {
    cursor: pointer;
  }
  .options-menu__dropdown {
    width: auto;
    left: unset;
    right: 0;
  }
  .options-menu__list > *:not(:last-child) {
    margin-bottom: var(--space-xs);
  }
  .options-menu__item {
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background-color var(--transition-base);
  }
  .options-menu__item:hover {
    background-color: var(--bg-surface-3);
  }
  .options-menu__button {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: var(--fs-lg);
    color: var(--text-secondary);
  }
  .button-red {
    color: var(--error);
  }
  .button-red :deep(.icon path) {
    fill: var(--error);
  }
</style>
