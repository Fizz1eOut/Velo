import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';

export const updateAvatar = async (
  userId: string,
  file: File
): Promise<{ data: string | null; error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) return { data: null, error: uploadError };

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId);

    if (updateError) return { data: null, error: updateError };

    return { data: avatarUrl, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
