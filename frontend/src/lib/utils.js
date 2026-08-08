export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

// Whole days between a date and today: 0 = today, 1 = yesterday.
function daysAgo(date) {
  const diff = startOfDay(new Date()) - startOfDay(date);
  return Math.round(diff / 86400000);
}

/**
 * Sidebar timestamps: time today, "Yesterday", weekday this week, date beyond that.
 */
export function formatConversationTime(date) {
  if (!date) return "";

  const value = new Date(date);
  const days = daysAgo(value);

  if (days === 0) return formatMessageTime(value);
  if (days === 1) return "Yesterday";
  if (days < 7) return value.toLocaleDateString([], { weekday: "short" });

  return value.toLocaleDateString([], { day: "numeric", month: "short" });
}

/**
 * Date divider labels inside the message list.
 */
export function formatDateDivider(date) {
  const value = new Date(date);
  const days = daysAgo(value);

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return value.toLocaleDateString([], { weekday: "long" });

  return value.toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" });
}

export function isSameDay(a, b) {
  return startOfDay(new Date(a)).getTime() === startOfDay(new Date(b)).getTime();
}

/**
 * Turns the last message of a conversation into one line of sidebar preview text.
 * Returns the kind too, so the row can show a matching icon.
 */
export function buildMessagePreview(lastMessage, currentUserId) {
  if (!lastMessage) return null;

  const isOwn = String(lastMessage.senderId) === String(currentUserId);
  const prefix = isOwn ? "You: " : "";

  if (lastMessage.text) return { kind: "text", text: `${prefix}${lastMessage.text}` };
  if (lastMessage.video) return { kind: "video", text: `${prefix}Video` };
  if (lastMessage.image) return { kind: "image", text: `${prefix}Photo` };

  return null;
}
