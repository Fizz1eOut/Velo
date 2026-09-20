<script setup lang="ts">
  import AppTitle from '~/components/base/AppTitle.vue';
</script>

<template>
  <div class="feature-badge">
    <app-title>Messages at the speed of thought</app-title>

    <ul class="feature-badge__list">
      <li class="feature-badge__item">
        <span aria-hidden="true">⚡</span>
        <span>Instant delivery</span>
      </li>

      <li class="feature-badge__item">
        <span aria-hidden="true">🔒</span>
        <span>Secure chats</span>
      </li>

      <li class="feature-badge__item">
        <span aria-hidden="true">🎨</span>
        <span>Beautiful UI</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .feature-badge__list {
    margin-top: var(--space-sm);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .feature-badge__item {
    padding: 8px;
    border-radius: var(--radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    font-size: var(--fs-xs);
    color: #fff;
  }
</style>
