<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { listChats } from '~/api/chats/listChats';
  import { getLastMessages } from '~/api/messages/lastMessages';
  import { useSupabaseClient } from '#imports';
  import type { Database } from '~/../types/database';
  import type { ChatListItem } from '~/interface/chat.interface';
  import type { lastMessagePreview } from '~/api/messages/lastMessages';
  import ConversationsList from '~/components/content/Conversations/ConversationsList.vue';
  import AppLoadingSpinner from '~/components/base/AppLoadingSpinner.vue';

  const emit = defineEmits<{
    selectChat: [userId: string]
  }>();

  const supabase = useSupabaseClient<Database>();
  const chats = ref<ChatListItem[]>([]);
  const lastMessages = ref<lastMessagePreview[]>([]);
  const loading = ref(true);

  const subscribeToLastMessages = () => {
    return supabase
      .channel('sidebar-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const msg = payload.new as lastMessagePreview;

          const existing = lastMessages.value.find(m => m.chat_id === msg.chat_id);
          if (existing) {
            existing.content = msg.content;
            existing.created_at = msg.created_at;
          } else {
            lastMessages.value.push(msg);
          }

          const { data: { user } } = await supabase.auth.getUser();
          if (msg.sender_id === user?.id) return;

          const chat = chats.value.find(c => c.chat.id === msg.chat_id);
          if (chat) {
            chat.chat.unread_count += 1;
          }
        }
      )
      .subscribe();
  };

  const subscribeToStatus = () => {
    return supabase
      .channel('profiles-status')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload) => {
          const { id, status } = payload.new as { id: string; status: 'online' | 'offline' | 'dnd' };
          const chat = chats.value.find(c => c.profile.id === id);
          if (chat) chat.profile.status = status;
        }
      )
      .subscribe();
  };

  onMounted(async () => {
    try {
      const { data } = await listChats();
      chats.value = data ?? [];

      if (chats.value.length) {
        const chatIds = chats.value.map(c => c.chat.id);
        const { data: messages } = await getLastMessages(chatIds);
        lastMessages.value = messages ?? [];
      }

      subscribeToLastMessages();
      subscribeToStatus();
    } finally {
      loading.value = false;
    }
  });

  onUnmounted(() => {
    supabase.removeChannel(supabase.channel('sidebar-messages'));
  });

  const getLastMessage = (chatId: string) => {
    return lastMessages.value.find(m => m.chat_id === chatId) ?? null;
  };
</script>

<template>
  <div class="conversation-sidebar">
    <app-loading-spinner v-if="loading" />
    <conversations-list
      v-else 
      :chats="chats" 
      :get-last-message="getLastMessage"
      @select-chat="emit('selectChat', $event)" 
    />
  </div>
</template>

<style scoped>
  .conversation-sidebar {
    margin-top: var(--space-lg);
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;

    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
  }

  .conversation-sidebar::-webkit-scrollbar {
    width: 6px;
  }
  .conversation-sidebar::-webkit-scrollbar-track {
    background: transparent;
  }
  .conversation-sidebar::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.25);
    border-radius: var(--radius-sm);
  }
  .conversation-sidebar::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.45);
  }
</style>
