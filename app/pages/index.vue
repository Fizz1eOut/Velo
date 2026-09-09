<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { definePageMeta, useHead } from '#imports';
  import ConversationsSidebar from '~/components/content/Conversations/ConversationsSidebar.vue';
  import ChatWindow from '~/components/content/Chat/ChatWindow.vue';
  import AppSearch from '~/components/base/AppSearch.vue';
  import ChatEmpty from '~/components/content/Chat/ChatEmpty.vue';
  import AppContainer from '~/components/base/AppContainer.vue';
  import AppUnderlay from '~/components/base/AppUnderlay.vue';
  import AppDivider from '~/components/base/AppDivider.vue';
  import AppSidebar from '~/components/base/AppSidebar.vue';

  definePageMeta({
    middleware: ['auth']
  });
  useHead({
    title: 'Messages | Velo'
  });

  const userId = ref<string>('');
  const searchRef = ref<{ focus: () => void } | null>(null);

  const openSearch = () => {
    searchRef.value?.focus();
  };

  const isChatOpen = computed(() => !!userId.value);
  const goBack = () => {
    userId.value = '';
  };
</script>

<template>
  <div class="chat-layout" :class="{ 'chat-layout--chat-open': isChatOpen }">
    <div class="chat-sidebar">
      <app-underlay>
        <app-container>
          <app-search ref="searchRef" @user-id="userId = $event" />
          <app-divider />
          <conversations-sidebar @select-chat="userId = $event" />

          <app-sidebar />
        </app-container>
      </app-underlay> 
    </div>

    <div class="chat-content">
      <chat-window v-if="userId" :user-id="userId" @back="goBack" />
      <chat-empty v-else @new-message="openSearch" />
    </div>
  </div>
</template>

<style scoped>
  .chat-layout {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
  }
  .chat-sidebar {
    flex: 0 1 350px;
  }
  .chat-content {
    flex: 0 1 100%;
  }

   @media (max-width: 570px) {
    .chat-sidebar {
      flex: 0 1 100%;
    }
    .chat-sidebar,
    .chat-content {
      width: 100%;
    }
    .chat-content {
      display: none;
    }
    .chat-layout--chat-open .chat-sidebar {
      display: none;
    }
    .chat-layout--chat-open .chat-content {
      display: block;
    }
  }
</style>
