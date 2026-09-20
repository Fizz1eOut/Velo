import { defineNuxtPlugin } from '#app';
import { useSupabaseClient } from '#imports';
import { updateStatus } from '~/api/users/updateStatus';

export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  await updateStatus('online');

  const heartbeat = setInterval(() => {
    updateStatus('online');
  }, 30_000);

  window.addEventListener('beforeunload', () => {
    clearInterval(heartbeat);
    updateStatus('offline');
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      updateStatus('offline');
    } else {
      updateStatus('online');
    }
  });
});
