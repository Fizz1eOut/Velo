<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { navigateTo, definePageMeta } from '#imports';
  import AppInput from '~/components/inputs/AppInput.vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';
  import AuthIntro from '~/components/content/Auth/AuthIntro.vue';
  import { updatePassword } from '~/api/auth';
  import { useForm, useField } from 'vee-validate';
  import * as yup from 'yup';

  definePageMeta({
    layout: 'auth',
  });

  const validationSchema = yup.object({
    password: yup.string()
      .required('Enter your password')
      .min(6, 'At least 6 characters'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm your password'),
  });

  const { handleSubmit } = useForm({ validationSchema });
  const { value: password, errorMessage: passwordError } = useField<string>('password', undefined, { initialValue: '' });
  const { value: confirmPassword, errorMessage: confirmPasswordError } = useField<string>('confirmPassword', undefined, { initialValue: '' });

  const loading = ref(false);
  const formError = ref<string | null>(null);

  const hasError = computed(() => !!passwordError.value || !!confirmPasswordError.value);

  const onSubmit = handleSubmit(async (values) => {
    formError.value = null;
    loading.value = true;

    try {
      const { error } = await updatePassword(values.password);

      if (error) {
        formError.value = error.message;
      } else {
        await navigateTo('/login');
      }
    } catch (err: unknown) {
      formError.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  });

  const showPassword  = ref(false);
  const showConfirmPassword  =  ref(false);
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      showPassword.value = !showPassword.value;
    } else {
      showConfirmPassword.value = !showConfirmPassword.value;
    }
  };
</script>

<template>
  <div class="reset-password">
    <div class="reset-password__body">
      <auth-intro 
        title="Reset password"
        subtitle="Create a new password for your account"
        html-description
      />

      <div class="reset-password__field">
        <div class="reset-password__name">Password</div>
        <app-input 
          v-model="password" 
          placeholder="Password" 
          :type="showPassword ? 'text' : 'password'"
          :class="{ 'has-error': passwordError }"
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
          @click="togglePasswordVisibility('password')"
        >
          <app-icon 
            :name="showPassword ? 'eye-off' : 'eye'" 
            size="var(--fs-xl)" 
            color="var(--text-muted)" 
          />
        </app-button>
        <span class="error-message">{{ passwordError }}</span>
      </div>

      <div class="reset-password__field">
        <div class="reset-password__name">Confirm password</div>
        <app-input 
          v-model="confirmPassword" 
          placeholder="Confirm password" 
          :type="showConfirmPassword  ? 'text' : 'password'"
          :class="{ 'has-error': confirmPasswordError }"
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
          @click="togglePasswordVisibility('confirmPassword')"
        >
          <app-icon 
            :name="showConfirmPassword ? 'eye-off' : 'eye'" 
            size="var(--fs-xl)" 
            color="var(--text-muted)" 
          />
        </app-button>
        <span class="error-message">{{ confirmPasswordError }}</span>
      </div>

      <div class="reset-password__action">
        <app-button 
          type="submit"
          :primary="!hasError"
          :disabled="hasError || loading"
          class="reset-password__button"
          @click="onSubmit"
        >
          {{  loading ? 'Resetting...' : 'Reset password' }}
          <app-icon
            name="arrow"
            size="var(--fs-lg)"
            color="#fff"
          />
        </app-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .reset-password {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    height: 100vh;
    background-color: #fff;
  }
  .reset-password__header {
    width: 100%;
  }
  .reset-password__body {
    max-width: 400px;
    width: 100%;
  }
  .reset-password__body > *:not(:last-child) {
    margin-bottom: var(--space-sm);
  }
  .reset-password__field {
    position: relative;
  }
  .reset-password__name {
    color: #1A1830;
  }
  .reset-password__button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
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
  :deep(.input) {
    color: #1A1830;
  }
  .has-error :deep(.input) {
    border: 1px solid var(--error);
    border-radius: var(--radius-sm);
    box-shadow: none;
  }
  .error-message {
    color: var(--error);
    font-size: 12px;
  }
</style>
