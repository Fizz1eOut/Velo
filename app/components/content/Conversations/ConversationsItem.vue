<script setup lang="ts">
  import type { ChatListItem } from '~/interface/chat.interface';
  import type { lastMessagePreview } from '~/api/messages/lastMessages';
  import { formatMessageDate } from '~/utils/formatMessageDate';
  import { isOnline } from '~/utils/isOnline';
  import AppAvatar from '~/components/base/AppAvatar.vue';

  interface ConversationsItemProps {
    item: ChatListItem;
    getLastMessage: (chatId: string) => lastMessagePreview | null;
  }
  defineProps<ConversationsItemProps>();
</script>

<template>
  <div class="conversations-item">
    <app-avatar 
      :src="item.profile.avatar_url" 
      :alt="item.profile.username"
      :status="isOnline(item.profile.last_seen, item.profile.status) ? 'online' : 'offline'"
    />
    <div class="conversation-item__info">
      <div class="conversation-item__content">
        <div class="conversation-item__name">
          {{ item.profile.full_name || item.profile.username }}
        </div>
        <p class="conversation-item__last-message">
          {{ getLastMessage(item.chat.id)?.content ?? 'No messages yet' }}
        </p>
      </div>
      <div class="conversation-item__time">
        {{ formatMessageDate(getLastMessage(item.chat.id)?.created_at || '') }}
        <div v-if="item.chat.unread_count > 0" class="conversation-item__badge">
          {{ item.chat.unread_count }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .conversations-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
  }
  .conversation-item__info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
  }
  .conversation-item__name {
    font-size: var(--fs-md);
    color: var(--text-primary);
  }
  .conversation-item__last-message {
    margin-top: 4px;
    font-size: var(--fs-sm);
    color: var(--text-secondary);
  }
  .conversation-item__time {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
  }
  .conversation-item__badge {
    margin-top: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 20px;
    border-radius: var(--radius-full);
    background-color: var(--badge);
    color: #ffffff;
    font-size: var(--fs-sm);
  }
</style>
