<script setup lang="ts">
  import { ref, computed } from 'vue';
  import AppCheckbox from '~/components/inputs/AppCheckbox.vue';
  import AppInput from '~/components/inputs/AppInput.vue';
  import AppLink from '~/components/base/AppLink.vue';
  import AppButton from '~/components/base/AppButton.vue';
  import AppIcon from '~/components/base/AppIcon.vue';
  import AuthIntro from '~/components/content/Auth/AuthIntro.vue';
  import { useAuthStore } from '~/stores/authStore';
  import type { SignUpFormValues } from '~/interface/auth.interface';
  import { useForm, useField } from 'vee-validate';
  import * as yup from 'yup';

  interface AuthSignUpProps {
    pageTitle: string;
  }
  defineProps<AuthSignUpProps>();

  const emit = defineEmits<{
    'signin': []
  }>();

  const validationSchema = yup.object({
    name: yup.string()
      .required('Enter your name')
      .matches(/^[A-ZА-Я][a-zа-яёЁA-ZА-Я]*$/, 'Name must start with a capital letter'),
    username: yup.string()
      .required('Enter your username')
      .min(3, 'Username must be at least 3 characters')
      .max(10, 'Username must be no more than 10 characters'),
    email: yup.string()
      .required('Enter your email')
      .email('Invalid email format'),
    password: yup.string()
      .required('Enter your password')
      .min(6, 'At least 6 characters'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm your password'),
    acceptTerms: yup
      .boolean()
      .oneOf([true], 'You must accept the terms')
      .required('You must accept the terms'),
  });

  const signupError = ref<string | null>(null);
  const loading = ref(false);

  const { handleSubmit } = useForm<SignUpFormValues>({ 
    validationSchema 
  });

  const { value: name, errorMessage: nameError } = useField<string>('name', undefined, { initialValue: '' });
  const { value: username, errorMessage: usernameError } = useField<string>('username', undefined, { initialValue: '' });
  const { value: email, errorMessage: emailError } = useField<string>('email', undefined, { initialValue: '' });
  const { value: password, errorMessage: passwordError } = useField<string>('password', undefined, { initialValue: '' });
  const { value: confirmPassword, errorMessage: confirmPasswordError } = useField<string>('confirmPassword', undefined, { initialValue: '' });
  const { value: acceptTerms, errorMessage: acceptTermsError } = useField<boolean>('acceptTerms', undefined, { initialValue: false });

  const hasError = computed(() => 
    !!nameError.value || 
    !!usernameError.value ||
    !!emailError.value || 
    !!passwordError.value || 
    !!confirmPasswordError.value || 
    !!acceptTermsError.value
  );

  const authStore = useAuthStore();

  const onSubmit = handleSubmit(async (values) => {
    const result = await authStore.signUp(values.email, values.password, values.name, values.username);
    if (!result.success) signupError.value = result.error ?? 'Registration error';
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
  <div class="sign-up">
    <div class="sign-up__header">
      <auth-intro 
        title="Create your account"
        subtitle="Join thousands already using Velo"
        :page-title="pageTitle"
      />
    </div>

    <div class="sign-up__body">
      <div class="sign-up__field">
        <div class="sign-up__name">Name</div>
        <app-input 
          v-model="name" 
          placeholder="Name"
          :class="{ 'has-error': nameError }"
        >
          <template #icon-before>
            <app-icon 
              name="user"
              size="var(--fs-md)" 
              color="var(--text-muted)"
            />
          </template>
        </app-input>
        <span class="error-message">{{ nameError }}</span>
      </div>

      <div class="sign-up__field">
        <div class="sign-up__name">Username</div>
        <app-input 
          v-model="username" 
          placeholder="Username"
          :class="{ 'has-error': usernameError }"
        >
          <template #icon-before>
            <span class="icon">@</span>
          </template>
        </app-input>
        <span class="error-message">{{ usernameError }}</span>
      </div>

      <div class="sign-up__field">
        <div class="sign-up__name">Email</div>
        <app-input 
          v-model="email" 
          placeholder="Email"
          :class="{ 'has-error': emailError }"
        >
          <template #icon-before>
            <app-icon 
              name="email"
              size="var(--fs-md)" 
              color="var(--text-muted)"
            />
          </template>
        </app-input>
        <span class="error-message">{{ emailError }}</span>
      </div>

      <div class="sign-up__field">
        <div class="sign-up__name">Password</div>
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

      <div class="sign-up__field">
        <div class="sign-up__name">Confirm password</div>
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

      <div class="sign-up__field">
        <app-checkbox v-model="acceptTerms" :class="{'has-error': acceptTermsError }" class="sign-up__checkbox">
          I agree to the 
          <app-link href="/terms" target="_blank">Terms of Service</app-link> and 
          <app-link href="/privacy" target="_blank">Privacy Policy</app-link>
        </app-checkbox>
        <span class="error-message">{{ acceptTermsError }}</span>
      </div>

      <div class="sign-up__actions">
        <app-button 
          type="submit"
          :primary="!hasError"
          :disabled="hasError || loading"
          class="sign-up__button"
          @click="onSubmit"
        >
          Create account
          <app-icon
            name="arrow"
            size="var(--fs-lg)"
            color="#fff"
          />
        </app-button>

        <div class="account-options">
          Already have an account?
          <app-link @click="emit('signin')">Sign in</app-link>
        </div>
      </div>
    </div>
  </div></template>

<style scoped>
  .sign-up {
    max-width: 400px;
    width: 100%;
  }
  .sign-up__body {
    margin-top: var(--space-lg);
  }
  .sign-up__field:not(:last-child) {
    margin-bottom: var(--space-sm);
  }
  .sign-up__field .icon {
    font-size: var(--fs-md);
    color: var(--text-muted);
  }
  .sign-up__field {
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
  .sign-up__checkbox :deep(.checkbox__body) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    color: var(--text-muted);
  }
  .sign-up__name {
    color: #1A1830;
  }
  .sign-up__actions {
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
  .sign-up__button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
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
