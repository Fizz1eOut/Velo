<script setup lang="ts">
  import { ref, computed } from 'vue';
  import AuthIntro from '~/components/content/Auth/AuthIntro.vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';
  import AppInput from '~/components/inputs/AppInput.vue';
  import { resetPassword } from '~/api/auth';
  import { useForm, useField } from 'vee-validate';
  import * as yup from 'yup';

  interface AuthForgotPasswordProps {
    pageTitle: string;
  }
  defineProps<AuthForgotPasswordProps>();
  const emit = defineEmits<{
    'signin': []  
  }>();
  
  const loading = ref(false);
  const emailSent = ref(false);
  const sentEmail = ref('');
  const formError = ref<string | null>(null);

  function onEmailSent(email: string) {
    sentEmail.value = email;
    emailSent.value = true;
  }

  const title = computed(() =>
    emailSent.value ? 'The letter has been sent!' : 'Forgot your password?'
  );

  const description = computed(() =>
    emailSent.value
      ? `We've sent a password reset link to ${sentEmail.value}. Please check your email.`
      : 'Enter your email and we will send you password reset instructions.'
  );

  const validationSchema = yup.object({
    email: yup.string()
      .required('Enter your email')
      .email('Invalid email format'),
  });
  const { handleSubmit } = useForm({ validationSchema });
  const { value: email, errorMessage: emailError } = useField<string>('email', undefined, { initialValue: '' });
  const hasError = computed(() => !!emailError.value);

  const onSubmit = handleSubmit(async (values) => {
    formError.value = null;
    loading.value = true;

    try {
      const { error } = await resetPassword(values.email);

      if (error) {
        formError.value = error.message;
      } else {
        onEmailSent(values.email);
      }
    } catch (err: unknown) {
      formError.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  });
</script>

<template>
  <div class="forgot-password">
    <app-button
      v-if="!emailSent"
      secondary 
      class="btn"
      @click="emit('signin')"
    >
      <app-icon 
        name="arrow"
        color="#5E6278"
        size="var(--fs-xl)"
        class="arrow-icon"
      />
      Back
    </app-button>

    <auth-intro
      :title="title"
      :subtitle="description"
      :page-title="pageTitle"
      html-description
    />

    <div class="forgot-password__field">
      <div class="forgot-password__name">Email</div>
      <app-input
        v-model="email"
        placeholder="Email"
        :class="{ 'has-error': emailError, 'success': emailSent }"
      >
        <template #icon-before>
          <app-icon name="email" size="var(--fs-md)" color="var(--text-muted)" />
        </template>
      </app-input>
      <span v-if="emailError" class="error-message">{{ emailError }}</span>
    </div>

    <span v-if="formError" class="error-message">{{ formError }}</span>
    {{ emailSent ? "yes" : "no" }}
    <app-button
      type="button"
      :primary="!hasError"
      :disabled="hasError || loading"
      @click="onSubmit"
    >
      {{ loading ? 'Sending...' : 'Send reset link' }}
    </app-button>
  </div>
</template>

<style scoped>
  .btn {
    margin-bottom: var(--space-lg);
    color: #5E6278;
    max-width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  .btn:hover {
    color: #5E6278;
    box-shadow: var(--shadow-lg);
  }
  .arrow-icon {
    transform: rotate(180deg);
  }
  .error-message {
    color: var(--error);
    font-size: 12px;
  }
  :deep(.input) {
    color: #1A1830;
  }
  .success :deep(.input) {
    border: 1px solid var(--success);
  }
  .forgot-password__field {
    margin-top: var(--space-md);
    margin-bottom: var(--space-xs);
  }
  .forgot-password__name {
    color: #1A1830;
  }
</style>
