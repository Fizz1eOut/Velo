export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  status: 'online' | 'offline' | 'dnd';
  last_seen: string | null;
}
