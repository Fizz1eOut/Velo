import type { Profile } from '~/interface/profile.interface';

export interface ChatMember {
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  profile: Profile;
}

export interface LastMessage {
  id: string;
  content: string | null;
  type: 'text' | 'image' | 'file' | 'audio';
  sender_id: string;
  created_at: string;
  is_deleted: boolean;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name: string | null;
  avatar_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  members: ChatMember[];
  last_message: LastMessage | null;
  unread_count: number;
}

export interface DirectChat extends Chat {
  type: 'direct';
}

export interface GroupChat extends Chat {
  type: 'group';
  name: string;
}

export interface ChatListItem {
  chat: {
    id: string;
    type: 'direct' | 'group';
    updated_at: string;
    unread_count: number;
  };
  profile: Profile;
}
