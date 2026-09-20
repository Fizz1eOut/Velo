import { ref, computed, type InjectionKey, type Ref, type ComputedRef } from 'vue';
import type { Message } from '~/interface/message.interface';

export interface ChatSearchApi {
  isOpen: Ref<boolean>;
  query: Ref<string>;
  matches: ComputedRef<Message[]>;
  currentIndex: Ref<number>;
  activeMatch: ComputedRef<Message | null>;
  scrollToken: Ref<number>;
  setMessages: (list: Message[]) => void;
  open: () => void;
  close: () => void;
  setQuery: (q: string) => void;
  next: () => void;
  prev: () => void;
}

export const chatSearchKey: InjectionKey<ChatSearchApi> = Symbol('chat-search');

export function createChatSearch(): ChatSearchApi {
  const isOpen = ref(false);
  const query = ref('');
  const messages = ref<Message[]>([]);
  const currentIndex = ref(0);

  const scrollToken = ref(0);

  const matches = computed(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return [];
    return messages.value.filter((m) => m.content?.toLowerCase().includes(q));
  });

  const activeMatch = computed(() => matches.value[currentIndex.value] ?? null);

  const bump = () => {
    scrollToken.value++;
  };

  const setMessages = (list: Message[]) => {
    messages.value = list;
  };

  const open = () => {
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
    query.value = '';
    currentIndex.value = 0;
  };

  const setQuery = (q: string) => {
    query.value = q;
    currentIndex.value = 0;
    bump();
  };

  const next = () => {
    if (!matches.value.length) return;
    currentIndex.value = (currentIndex.value + 1) % matches.value.length;
    bump();
  };

  const prev = () => {
    if (!matches.value.length) return;
    currentIndex.value = (currentIndex.value - 1 + matches.value.length) % matches.value.length;
    bump();
  };

  return {
    isOpen,
    query,
    matches,
    currentIndex,
    activeMatch,
    scrollToken,
    setMessages,
    open,
    close,
    setQuery,
    next,
    prev,
  };
}
