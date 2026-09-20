import { onMounted, onUnmounted, type Ref } from 'vue';

export function useClickOutside(
  target: Ref<HTMLElement | null | undefined>,
  callback: (event: MouseEvent) => void
) {
  const handler = (event: MouseEvent) => {
    const el = target.value;
    if (!el || el === event.target || el.contains(event.target as Node)) {
      return;
    }
    callback(event);
  };

  let timeoutId: number;

  onMounted(() => {
    timeoutId = window.setTimeout(() => {
      document.addEventListener('click', handler);
    }, 0);
  });

  onUnmounted(() => {
    clearTimeout(timeoutId);
    document.removeEventListener('click', handler);
  });
}
