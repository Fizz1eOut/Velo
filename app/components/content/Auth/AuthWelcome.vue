<script setup lang="ts">
  import AppLogo from '~/components/base/AppLogo.vue';
  import AuthChatPreview from '~/components/content/Auth/AuthChatPreview.vue';
  import AuthFeatureBadges from '~/components/content/Auth/AuthFeatureBadges.vue';
  import AppSubtitle from '~/components/base/AppSubtitle.vue';
</script>

<template>
  <div class="auth-welcome">
    <div class="auth-welcome__logo">
      <app-logo />
      <app-subtitle class="auth-welcome__title">Messages at the speed of thought</app-subtitle>
    </div>

    <div class="auth-welcome__preview">
      <auth-chat-preview />
    </div>

    <div class="auth-welcome__badges">
      <auth-feature-badges />
    </div>
  </div>
</template>

<style scoped>
  .auth-welcome {
    position: relative;
    display: flex;
    align-items: flex-start;  
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
    background: 
      radial-gradient(ellipse at 40% 40%, #4a2fd4 0%, transparent 60%),
      linear-gradient(160deg, #0f0630 0%, #1e0e6e 100%);
      padding: 0 40px 40px;
  }
  .auth-welcome__preview {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 100%;
  }
  .auth-welcome__title {
    display: none;
  }
  @media (max-width: 768px) {
    .auth-welcome__title {
      display: block;
    }
    .auth-welcome__preview,
    .auth-welcome__badges {
      display: none;
    }
    .auth-welcome__logo {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 10px;
    }
    .auth-welcome {
      padding-bottom: 50px;
      align-items: center;
    }
    .auth-welcome::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 40px;
      background: #ffffff;
      border-radius: 50% 50% 0 0 / 60px 60px 0 0;
    }
  }
</style>
