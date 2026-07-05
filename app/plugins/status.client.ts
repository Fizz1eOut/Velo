import { defineNuxtPlugin } from '#app';
import { updateStatus } from '~/api/users/updateStatus';

export default defineNuxtPlugin(() => {
  updateStatus('online');

  window.addEventListener('beforeunload', () => {
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
