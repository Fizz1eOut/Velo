export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string | null;
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system';
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  file_mime: string | null;
  thumbnail_url: string | null;
  reply_to_id: string | null;
  forwarded_from: string | null;
  is_edited: boolean;
  is_deleted: boolean;
  is_pinned: boolean;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export type MessageInsert = Pick<Message, 'chat_id' | 'sender_id' | 'type'> &
  Partial<Pick<Message, 'id' | 'content' | 'file_url' | 'file_name' | 'file_size' | 'file_mime' | 'thumbnail_url' | 'reply_to_id'>>;
