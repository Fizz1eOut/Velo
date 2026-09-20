import type { Message, ReactionGroup } from '~/interface/message.interface';

export function groupReactions(
  rows: { emoji: string; user_id: string }[],
  myId: string | null
): ReactionGroup[] {
  const map = new Map<string, ReactionGroup>();

  for (const row of rows) {
    let g = map.get(row.emoji);
    if (!g) {
      g = { emoji: row.emoji, count: 0, reactedByMe: false, userIds: [] };
      map.set(row.emoji, g);
    }
    g.userIds.push(row.user_id);
    g.count++;
    if (row.user_id === myId) g.reactedByMe = true;
  }

  return [...map.values()];
}

export function applyLocalReactionToggle(
  message: Message,
  emoji: string,
  currentUserId: string | null
) {
  if (!currentUserId) return;

  message.reactions ??= [];
  const myGroup = message.reactions.find((r) => r.reactedByMe);

  if (myGroup) {
    myGroup.userIds = myGroup.userIds.filter((id) => id !== currentUserId);
    myGroup.count--;
    myGroup.reactedByMe = false;
    if (myGroup.count <= 0) {
      message.reactions = message.reactions.filter((r) => r !== myGroup);
    }
  }

  if (myGroup?.emoji === emoji) return;

  let newGroup: ReactionGroup | undefined = message.reactions.find((r) => r.emoji === emoji);
  if (!newGroup) {
    newGroup = { emoji, count: 0, reactedByMe: false, userIds: [] };
    message.reactions.push(newGroup);
  }
  newGroup.userIds.push(currentUserId);
  newGroup.count++;
  newGroup.reactedByMe = true;
}
