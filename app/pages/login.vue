<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useHead } from 'nuxt/app';
  import { definePageMeta } from '#imports';
  import AuthWelcome from '~/components/content/Auth/AuthWelcome.vue';
  import AuthForm from '~/components/content/Auth/AuthForm.vue';
  import AuthSignIn from '~/components/content/Auth/AuthSignIn.vue';
  import AuthSignUp from '~/components/content/Auth/AuthSignUp.vue';
  import AuthForgotPassword from '~/components/content/Auth/AuthForgotPassword.vue';
  import AppContainer from '~/components/base/AppContainer.vue';

  definePageMeta({
    middleware: ['guest'],
    layout: 'auth'
  });

  type View = 'signin' | 'signup' | 'forgot'

  const currentView = ref<View>('signin');
  const titles: Record<View, string> = {
    signin: 'Sign in | Velo',
    signup: 'Create account | Velo',
    forgot: 'Reset password | Velo'
  };

  useHead({
    title: computed(() => titles[currentView.value])
  });
</script>

<template>
  <div class="login-page">
    <div class="login-page__item">
      <auth-welcome />
    </div>

    <div class="login-page__item">
      <auth-form class="login-page__form">
        <app-container>
          <auth-sign-in
            v-if="currentView === 'signin'"
            :page-title="titles[currentView]"
            @signup="currentView = 'signup'"
            @forgot="currentView = 'forgot'"
          />
          <auth-sign-up
            v-else-if="currentView === 'signup'"
            :page-title="titles[currentView]"
            @signin="currentView = 'signin'"
          />
          <auth-forgot-password
            v-else-if="currentView === 'forgot'"
            :page-title="titles[currentView]"
            @signin="currentView = 'signin'"
          />
        </app-container>
      </auth-form>
    </div>
  </div>
</template>

<style scoped>
  .login-page {
    height: 100vh;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    background-color: #fff;
  } 
  .login-page__item {
    flex: 0 1 50%;
    height: 100%;
  }
  .login-page__form {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    height: 100%;
  }
  :deep(.container) {
    width: 100%;
    max-width: 400px;
  }
  @media (max-width: 768px) {
    .login-page {
      flex-direction: column;
      width: 100%;
      height: 100%;
    }
    .login-page__item {
      flex: none;
      width: 100%;
    }
  }
</style>
