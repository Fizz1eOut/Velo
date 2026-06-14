<script setup lang="ts">
  import AppButton from '~/components/base/AppButton.vue';
  import AppSubtitle from '~/components/base/AppSubtitle.vue';
  import AppTitle from '~/components/base/AppTitle.vue';

  import AppIcon from '~/components/base/AppIcon.vue';

  const emit = defineEmits<{
    'new-message': []
  }>();
</script>

<template>
  <div class="chat-empty"> 
    <div class="chat-empty__icon">
      <app-icon name="message-circle" size="100px" color="var(--primary)" />
    </div>
    <app-title>Select a chat to start messaging</app-title>
    <app-subtitle>Or start a new conversation</app-subtitle>

    <div class="chat-empty__button">
      <app-button primary @click="emit('new-message')">
        + New Message
      </app-button>
    </div>
  </div>
</template>

<style scoped>
  .chat-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-direction: column;
    height: 100vh;
  }
  .chat-empty__icon {
    background-color: var(--bg-surface-3);
    width: 160px;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: var(--radius-full);
  }
  .chat-empty__button {
    max-width: 200px;
    width: 100%;
  }
</style>
