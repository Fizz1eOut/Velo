import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';
import type { MessageInsert } from '~/interface/message.interface';

type AttachmentType = 'image' | 'video' | 'audio' | 'file';

function resolveType(mime: string): AttachmentType {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  return 'file';
}

function getSafeExtension(fileName: string): string {
  const match = fileName.match(/\.([a-zA-Z0-9]+)$/);
  if (!match) return '';
  const ext = match[1];
  return ext ? `.${ext.toLowerCase()}` : '';
}

export const sendAttachment = async (
  chatId: string,
  file: File
): Promise<{ error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };

  const messageId = crypto.randomUUID();
  const ext = getSafeExtension(file.name);

  const path = `${chatId}/${messageId}${ext}`;
  const type = resolveType(file.type);

  const { error: uploadError } = await supabase.storage
    .from('chat-attachments')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) return { error: uploadError };

  const message: MessageInsert = {
    id: messageId,
    chat_id: chatId,
    sender_id: user.id,
    type,
    file_url: path,
    file_name: file.name,
    file_size: file.size,
    file_mime: file.type,
  };

  const { error } = await supabase.from('messages').insert(message);

  if (error) {
    await supabase.storage.from('chat-attachments').remove([path]);
  }

  return { error };
};
