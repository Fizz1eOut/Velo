import { useSupabaseClient } from '#imports';

export const resetPassword = async (email: string) => {
  const supabase = useSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { error };
};

export const updatePassword = async (newPassword: string) => {
  const supabase = useSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error };
};
