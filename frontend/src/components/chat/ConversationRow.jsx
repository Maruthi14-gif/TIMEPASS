import { Avatar } from "@heroui/react";
import { ImageIcon, VideoIcon } from "lucide-react";
import { AvatarWithOnlineIndicator } from "./AvatarWithOnlineIndicator";

const PREVIEW_ICONS = {
  image: ImageIcon,
  video: VideoIcon,
};

export function ConversationRow({ user, selected, onSelect }) {
  const preview = user.preview;
  const PreviewIcon = preview ? PREVIEW_ICONS[preview.kind] : null;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition-colors duration-150 ${
        selected ? "bg-accent-soft" : "hover:bg-surface"
      }`}
    >
      <AvatarWithOnlineIndicator isOnline={user.isOnline ?? false}>
        <Avatar className="size-11 shrink-0">
          <Avatar.Image alt={user.name} src={user.avatarUrl} />
          <Avatar.Fallback className="text-sm font-medium">{user.initials}</Avatar.Fallback>
        </Avatar>
      </AvatarWithOnlineIndicator>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="min-w-0 flex-1 truncate text-[14px] font-semibold leading-tight">
            {user.name}
          </p>
          {user.timeLabel ? (
            <span
              className={`shrink-0 text-[11px] tabular-nums ${
                selected ? "text-accent" : "text-muted"
              }`}
            >
              {user.timeLabel}
            </span>
          ) : null}
        </div>

        <p
          className={`mt-0.5 flex items-center gap-1 truncate text-[12.5px] leading-tight ${
            selected ? "text-accent" : "text-muted"
          }`}
        >
          {PreviewIcon ? <PreviewIcon className="size-3.5 shrink-0" strokeWidth={2} aria-hidden /> : null}
          <span className="truncate">{preview ? preview.text : "No messages yet"}</span>
        </p>
      </div>
    </button>
  );
}
