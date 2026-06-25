export const formatMessageDate = (date?: string | null) => {
  if (!date) return '';

  const messageDate = new Date(date);
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const messageDay = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate(),
  );

  const diffDays = Math.floor(
    (today.getTime() - messageDay.getTime()) / 86400000,
  );

  if (diffDays === 0) {
    return messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return `${diffDays}d`;
};
