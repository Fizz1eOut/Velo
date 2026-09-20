import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import { useSupabaseUser } from '#imports';

export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo('/login');
  }
});
