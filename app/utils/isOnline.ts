export const isOnline = (lastSeen: string | null, status: string): boolean => {
  if (status !== 'online') return false;
  if (!lastSeen) return false;

  const diff = Date.now() - new Date(lastSeen).getTime();
  return diff < 120_000;
};
