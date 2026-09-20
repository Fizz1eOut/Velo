<script setup lang="ts">
  import { ref, watch, shallowRef, inject } from 'vue';
  import { getChatMemberProfile } from '~/api/chats/chatMemberProfile';
  import { isOnline } from '~/utils/isOnline';
  import { chatTypingKey } from '~/composables/useChatTyping';
  import type { ChatListItem } from '~/interface/chat.interface';
  import AppContainer from '~/components/base/AppContainer.vue';
  import AppUnderlay from '~/components/base/AppUnderlay.vue';
  import AppAvatar from '~/components/base/AppAvatar.vue';
  import AppTypingIndicator from '~/components/base/AppTypingIndicator.vue';
  import ChatHeaderActions from '~/components/content/Chat/ChatHeaderActions.vue';
  import AppSidebar from '~/components/base/AppSidebar.vue';
  import ChatProfilePanel from '~/components/content/Chat/ChatProfilePanel.vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';
  import { useClickOutside } from '~/composables/useClickOutside';

  interface ChatHeaderProps {
    chatId: string;
    userId: string;
  }
  const props = defineProps<ChatHeaderProps>();

  const emit = defineEmits<{
    (e: 'back'): void;
  }>();

  const profile = ref<ChatListItem['profile'] | null>(null);
  const typing = inject(chatTypingKey, shallowRef(null));
  const isActive = ref(false);

  const rootEl = ref<HTMLElement | null>(null);
  useClickOutside(rootEl, () =>closeSidebar());

  const openSidebar = () => {
    isActive.value = true;
  };
  const closeSidebar = () => {
    isActive.value = false;
  };

  watch(
    () => props.chatId,
    async (id) => {
      if (!id) return;
      const { data } = await getChatMemberProfile(id);
      profile.value = data;
    },
    { immediate: true }
  );
</script>

<template>
  <div ref="rootEl" class="chat-header">
    <app-underlay>
      <app-container>
        <div class="chat-header__body">
          <div class="chat-window__mobile-back">
            <app-button class="chat-window__back-btn" @click="emit('back')">
              <app-icon 
                name="arrow" 
                color="var(--text-primary)" 
                size="var(--fs-2xl)" 
              />
            </app-button>
          </div>
          <div v-if="profile" class="chat-header__summary" @click="openSidebar">
            <app-avatar 
              :src="profile?.avatar_url" 
              :alt="profile?.username"
              :status="isOnline(profile?.last_seen, profile?.status) ? 'online' : 'offline'"
            />
            <div class="chat-header__row">
              <div class="chat-header__name">
                {{ profile?.full_name || profile?.username }}
              </div>

              <app-typing-indicator v-if="typing?.isPeerTyping.value" size="sm" />
              <div
                v-else
                class="chat-header__status"
                :class="{
                  'online': isOnline(profile?.last_seen, profile?.status)
                }"
              >
                {{ isOnline(profile?.last_seen, profile?.status) ? 'online' : 'offline' }}
              </div>
            </div>
          </div>

          <chat-header-actions :chat-id="chatId" :user-id="userId" />
        </div>
        <app-sidebar :active="isActive"  @close="closeSidebar">
          <chat-profile-panel :profile="profile" :chat-id="chatId" :user-id="userId" />
        </app-sidebar>
      </app-container>
    </app-underlay>
  </div>
</template>

<style scoped>
  .chat-header {
    position: relative;
  }
  .chat-header__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  .chat-header__summary {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }
  .chat-header__row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    font-size: var(--fs-md);
  }
  .chat-header__status {
    color: var(--text-secondary);
  }
  .online {
    color: var(--online);
  }
  :deep(.sidebar) {
    left: unset;
    right: 0;
  }
  .chat-window__back-btn {
    display: none;
  }
  @media (max-width: 570px) {
    .chat-window__back-btn {
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      border-radius: var(--radius-full);
      background-color: var(--bg-surface-3);
      transform: rotate(180deg);
    }
  }
</style>
