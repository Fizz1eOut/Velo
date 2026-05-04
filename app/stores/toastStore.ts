import { ref } from 'vue';

export interface ToastData {
  id: number
  message: string
  name: string
  time: string
  avatar?: string
  duration: number
}

export const toasts = ref<ToastData[]>([]);
let idCounter = 0;

export function showToast(data: Omit<ToastData, 'id'>) {
  const id = ++idCounter;
  toasts.value.push({ id, ...data });

  setTimeout(() => removeToast(id), data.duration);
}

export function removeToast(id: number) {
  toasts.value = toasts.value.filter(t => t.id !== id);
}