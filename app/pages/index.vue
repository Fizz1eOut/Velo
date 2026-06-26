<script setup lang="ts">
  import { ref } from 'vue';
  import { definePageMeta, useHead } from '#imports';
  import ConversationsSidebar from '~/components/content/Conversations/ConversationsSidebar.vue';
  import ChatWindow from '~/components/content/Chat/ChatWindow.vue';
  import AppSearch from '~/components/base/AppSearch.vue';
  import ChatEmpty from '~/components/content/Chat/ChatEmpty.vue';
  import AppContainer from '~/components/base/AppContainer.vue';
  import AppUnderlay from '~/components/base/AppUnderlay.vue';
  import AppDivider from '~/components/base/AppDivider.vue';

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
</script>

<template>
  <div class="chat-layout">
    <div class="chat-sidebar">
      <app-underlay>
        <app-container>
          <app-search ref="searchRef" @user-id="userId = $event" />
          <app-divider />
          <conversations-sidebar @select-chat="userId = $event" />
        </app-container>
      </app-underlay>
    </div>

    <div class="chat-content">
      <chat-window v-if="userId" :user-id="userId" />
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
</style>
