import { useSupabaseClient } from '#imports';

export const signIn = async (email: string, password: string) => {
  const supabase = useSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signUp = async (email: string, password: string, name: string, username: string) => {
  const supabase = useSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, username } },
  });
  return { data, error };
};

export const signOut = async () => {
  const supabase = useSupabaseClient();
  const { error } = await supabase.auth.signOut();
  return { error };
};
