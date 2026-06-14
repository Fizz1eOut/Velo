export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string | null;
  type: 'text' | 'image' | 'file' | 'audio';
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export type MessageInsert = Pick<Message, 'chat_id' | 'sender_id' | 'content' | 'type'>;
