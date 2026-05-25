import { defineStore } from 'pinia';
import { computed } from 'vue';
import { navigateTo } from 'nuxt/app';
import { signIn as apiSignIn, signUp as apiSignUp, signOut as apiSignOut } from '~/api/auth';
import { useSupabaseUser } from '#imports';

export const useAuthStore = defineStore('auth', () => {
  const supabaseUser = useSupabaseUser();

  const isAuthenticated = computed(() => !!supabaseUser.value);
  const user = computed(() => supabaseUser.value);

  const signIn = async (email: string, password: string) => {
    const { error } = await apiSignIn(email, password);
    if (error) return { success: false, error: error.message };

    return { success: true };
  };

  const signUp = async (email: string, password: string, name: string, username: string) => {
    const { error } = await apiSignUp(email, password, name, username);
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const signOut = async () => {
    const { error } = await apiSignOut();
    if (error) return { success: false, error: error.message };
    await navigateTo('/login');
    return { success: true };
  };

  return { user, isAuthenticated, signIn, signUp, signOut };
});
