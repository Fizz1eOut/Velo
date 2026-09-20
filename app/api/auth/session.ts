import { useSupabaseClient } from '#imports';

export const getSession = async () => {
  const supabase = useSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};
