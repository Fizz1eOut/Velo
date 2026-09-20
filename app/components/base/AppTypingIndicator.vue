<script setup lang="ts">
interface PropsTypingIndicator {
  size?: 'sm' | 'md' | 'lg';
}
withDefaults(defineProps<PropsTypingIndicator>(), { size: 'md' });

const sizeMap = {
  sm: { dot: '6px', gap: '4px', padding: '8px 12px' },
  md: { dot: '8px', gap: '5px', padding: '12px 16px' },
  lg: { dot: '10px', gap: '6px', padding: '14px 18px' },
};
</script>

<template>
  <div class="typing-indicator" :style="{ gap: sizeMap[size].gap, padding: sizeMap[size].padding }">
    <span
      v-for="i in 3"
      :key="i"
      class="typing-indicator__dot"
      :style="{ width: sizeMap[size].dot, height: sizeMap[size].dot, animationDelay: `${(i - 1) * 0.2}s` }"
    />
  </div>
</template>

<style scoped>
  .typing-indicator {
    display: inline-flex;
    align-items: center;
    background-color: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 18px 18px 18px 4px;
  }
  .typing-indicator__dot {
    border-radius: var(--radius-full);
    background-color: #9ca3af;
    animation: typing-bounce 1.2s ease-in-out infinite;
    opacity: 0.4;
  }

  @keyframes typing-bounce {
    0%, 60%, 100% { 
      transform: translateY(0);    
      opacity: 0.4; 
    }
    30% { 
      transform: translateY(-5px); opacity: 1;  
    }
  }
</style>