<script setup lang="ts">
  import { ref } from 'vue';
  import AppInput from '~/components/inputs/AppInput.vue';
  import AppLink from '~/components/base/AppLink.vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';
  import AuthIntro from '~/components/content/Auth/AuthIntro.vue';

  interface AuthSignInProps {
    pageTitle: string;
  }
  defineProps<AuthSignInProps>();

  const emit = defineEmits<{
    'signup': []
    'forgot': []
  }>();

  const email = ref<string>('');
  const password = ref<string>('');
  const showPassword  = ref(false);

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };
</script>

<template>
  <div class="sign-in">
    <div class="sign-in__header">
      <auth-intro 
        title="Welcome Back"
        subtitle="Sign in to continue your conversations"
        :page-title="pageTitle"
      />
    </div>

    <div class="sign-in__body">
      <div class="sign-in__field">
        <div class="sign-in__name">Email</div>
        <app-input v-model="email" placeholder="Email">
          <template #icon-before>
            <app-icon 
              name="email"
              size="var(--fs-md)" 
              color="var(--text-muted)" 
            />
          </template>
        </app-input>
      </div>

      <div class="sign-in__field">
        <div class="sign-in__name">Password</div>
        <app-input 
          v-model="password" 
          placeholder="Password" 
          :type="showPassword ? 'text' : 'password'" 
        >
          <template #icon-before>
            <app-icon 
              name="lock"
              size="var(--fs-md)" 
              color="var(--text-muted)" 
            />
          </template>
        </app-input>

        <app-button 
          type="button"
          class="toggle-password" 
          @click="togglePasswordVisibility"
        >
          <app-icon 
            :name="showPassword ? 'eye-off' : 'eye'" 
            size="var(--fs-xl)" 
            color="#1A1830" 
          />
        </app-button>
      </div>
      <app-link class="sign-in__link" @click="emit('forgot')">Forgot password?</app-link>
    </div>

    <div class="sign-in__actions">
      <app-button primary class="sign-in__button">
        Sign in
        <app-icon
          name="arrow"
          size="var(--fs-lg)"
          color="#fff"
        />
      </app-button>

      <div class="account-options">
        Don't have an account?
        <app-link @click="emit('signup')">Create account</app-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .sign-in {
    max-width: 400px;
    width: 100%;
  }
  .sign-in__body {
    margin-top: var(--space-lg);
  }
  .sign-in__field:not(:last-child) {
    margin-bottom: var(--space-sm);
  }
  .sign-in__field {
    position: relative;
  }
  .toggle-password {
    position: absolute;
    right: 10px;
    top: 25px;
    width: 20px;
    height: 20px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
  }
  :deep(.input) {
    color: #1A1830;
  }
  .sign-in__name {
    color: #1A1830;
  }
  .sign-in__link {
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 10px;
  }
  .sign-in__actions {
    margin-top: var(--space-md);
  }
  .account-options {
    display: flex;
    justify-content: center;
    align-items: center;  
    gap: 4px;
    margin-top: 16px;
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
  .sign-in__button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
</style>
