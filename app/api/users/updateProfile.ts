import { useSupabaseClient } from '#imports';
import type { Database } from '~/../types/database';
import type { Profile } from '~/interface/profile.interface';

type ProfileUpdatableFields = Partial<Pick<Profile, 'full_name' | 'username' | 'bio'>>;

export const updateProfile = async (
  userId: string,
  updates: ProfileUpdatableFields
): Promise<{ data: Profile | null; error: unknown }> => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('id, username, full_name, avatar_url, bio, status, last_seen')
    .single();

  return { data: data as Profile | null, error };
};
