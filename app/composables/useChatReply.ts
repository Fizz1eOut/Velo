import { ref, type InjectionKey, type Ref } from 'vue';
import type { Message } from '~/interface/message.interface';

export interface ChatReply {
  replyTarget: Ref<Message | null>;
  setReplyTo: (message: Message) => void;
  clearReply: () => void;
}

export const chatReplyKey: InjectionKey<ChatReply> = Symbol('chat-reply');

export const createChatReply = (): ChatReply => {
  const replyTarget = ref<Message | null>(null);

  const setReplyTo = (message: Message) => {
    replyTarget.value = message;
  };

  const clearReply = () => {
    replyTarget.value = null;
  };

  return { replyTarget, setReplyTo, clearReply };
};
