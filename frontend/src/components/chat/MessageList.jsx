import { Fragment } from "react";
import useScrollToBottom from "../../hooks/useScrollToBottom";
import { MessageBubble } from "./MessageBubble";
import { NoConversationPlaceholder } from "./NoConversationPlaceholder";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";
import { formatDateDivider, isSameDay } from "../../lib/utils";

// Consecutive messages from the same person within this window read as one block.
const GROUP_WINDOW_MS = 5 * 60 * 1000;

function sameGroup(a, b) {
  if (!a || !b || a.role !== b.role) return false;
  if (!a.createdAt || !b.createdAt) return true;

  return Math.abs(new Date(b.createdAt) - new Date(a.createdAt)) < GROUP_WINDOW_MS;
}

/**
 * Walks the message list once and annotates each message with the two flags the
 * bubble needs, plus a date label whenever the day changes.
 */
function buildRenderItems(messages) {
  return messages.map((message, index) => {
    const previous = messages[index - 1];
    const next = messages[index + 1];

    const startsNewDay =
      !previous || (message.createdAt && previous.createdAt
        ? !isSameDay(previous.createdAt, message.createdAt)
        : false);

    const isFirstInGroup = startsNewDay || !sameGroup(previous, message);
    const nextStartsNewDay =
      next && message.createdAt && next.createdAt
        ? !isSameDay(message.createdAt, next.createdAt)
        : false;
    const isLastInGroup = !next || nextStartsNewDay || !sameGroup(message, next);

    return {
      message,
      isFirstInGroup,
      isLastInGroup,
      dateLabel: startsNewDay && message.createdAt ? formatDateDivider(message.createdAt) : null,
    };
  });
}

export function MessageList() {
  const { activeConversation, activeConversationId } = useSelectedConversation();

  const lastMessageId = activeConversation?.messages.at(-1)?.id;
  const messagesScrollRef = useScrollToBottom(activeConversationId, lastMessageId);

  if (!activeConversation) {
    return (
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <NoConversationPlaceholder />
      </div>
    );
  }

  const items = buildRenderItems(activeConversation.messages);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        ref={messagesScrollRef}
        className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-3 py-3 sm:px-4 sm:py-4"
      >
        {items.length === 0 ? (
          <p className="m-auto max-w-64 text-center text-[13px] leading-relaxed text-muted">
            No messages yet. Say hello to get things started.
          </p>
        ) : null}

        {items.map(({ message, isFirstInGroup, isLastInGroup, dateLabel }) => (
          <Fragment key={message.id}>
            {dateLabel ? (
              <p className="my-3 self-center rounded-full bg-surface px-3 py-1 text-[11px] font-medium text-muted">
                {dateLabel}
              </p>
            ) : null}
            <MessageBubble
              message={message}
              isFirstInGroup={isFirstInGroup}
              isLastInGroup={isLastInGroup}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
