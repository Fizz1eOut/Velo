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

  interface ChatHeaderProps {
    chatId: string;
    userId: string;
  }
  const props = defineProps<ChatHeaderProps>();
  const profile = ref<ChatListItem['profile'] | null>(null);
  const typing = inject(chatTypingKey, shallowRef(null));

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
  <div class="chat-header">
    <app-underlay>
      <app-container>
        <div class="chat-header__body">
          <div v-if="profile" class="chat-header__summary">
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
</style>
