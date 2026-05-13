<script setup lang="ts">
  import AppTypingIndicator from '~/components/base/AppTypingIndicator.vue';
  import AppContainer from '~/components/base/AppContainer.vue';

  interface Message {
    id: number
    text: string
    isMine: boolean
    avatar: string
    isTyping?: boolean
  }

  const messages: Message[] = [
    {
      id: 1,
      text: 'Hey! Are you free later? 👋',
      isMine: false,
      avatar: '/images/avatars/1.svg'
    },
    {
      id: 2,
      text: 'Yeah! What\'s up? 😊',
      isMine: true,
      avatar: '/images/avatars/2.svg',
    },
    {
      id: 3,
      text: '',
      isMine: false,
      avatar: '/images/avatars/1.svg',
      isTyping: true
    }
  ];
</script>

<template>
  <div class="chat-preview">
    <app-container>
      <div class="chat-preview__header">
        <img class="chat-preview__avatar" src="/images/avatars/1.svg" alt="Sarah Chen" >
        <div>
          <div class="chat-preview__name">Sarah Chen</div>
          <div class="chat-preview__status">
            <span class="chat-preview__status-dot" />
            Online
          </div>
        </div>
      </div>

      <div class="chat-preview__messages">
        <div
          v-for="message in messages"
          :key="message.id"
          class="chat-preview__row"
          :class="{ 'chat-preview__row--mine': message.isMine }"
        >
          <img
            v-if="!message.isMine"
            class="chat-preview__avatar chat-preview__avatar--sm"
            :src="message.avatar"
            alt=""
          >

          <app-typing-indicator v-if="message.isTyping" class="chat-preview__typing" />
          <div v-else class="chat-preview__bubble">
            {{ message.text }}
          </div>

          <img
            v-if="message.isMine"
            class="chat-preview__avatar chat-preview__avatar--sm"
            :src="message.avatar"
            alt=""
          >
        </div>
      </div>
    </app-container>
  </div>
</template>

<style scoped>
  .chat-preview {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    border-radius: var(--radius-md);
    border: 1px solid rgba(255, 255, 255, 0.2);
    width: 340px;
  }
  .chat-preview__header {
    display: flex;  
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .chat-preview__avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    object-fit: cover;
  }
  .chat-preview__avatar--sm {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
  }
  .chat-preview__name {
    font-weight: var(--fw-semibold);
    color: #fff;
    font-size: var(--fs-md);
  }
  .chat-preview__status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: var(--fs-xs);
    color: rgba(255, 255, 255, 0.6);
  }
  .chat-preview__status-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    background: #4ade80;
  }
  .chat-preview__messages {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .chat-preview__row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }
  .chat-preview__row--mine {
    flex-direction: row-reverse;
  }
  .chat-preview__bubble {
    background: rgba(255, 255, 255, 0.95);
    color: #1a1a2e;
    padding: 10px 14px;
    border-radius: var(--radius-md);
    font-size: var(--fs-sm);
    max-width: 220px;
  }
  .chat-preview__row--mine .chat-preview__bubble {
    background: #5b4ef8;
    color: #fff;
  }
  .chat-preview__typing {
    background-color: rgba(255, 255, 255, 0.95);
    border: none;
  }
</style>
