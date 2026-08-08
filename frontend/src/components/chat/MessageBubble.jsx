import { motion } from "framer-motion";
import { withTransform } from "../../lib/imagekit";
import { MessageVideo } from "./MessageVideo";

// Compress + size images for the bubble (q-auto works for images; f-auto picks WebP/AVIF).
const IMAGE_TRANSFORM = "q-auto,w-640,f-auto";

/**
 * A single bubble. Grouping flags decide the corner shapes and whether the
 * timestamp line is shown, so a run of messages reads as one block.
 */
export function MessageBubble({ message, isFirstInGroup = true, isLastInGroup = true }) {
  const isOwnMessage = message.role === "me";
  const hasImage = Boolean(message.imageUrl);
  const hasVideo = Boolean(message.videoUrl);
  const isMediaOnly = (hasImage || hasVideo) && !message.text;

  // Square off the inner corner on the last bubble of a run — that's the "tail".
  const tailCorner = isLastInGroup ? (isOwnMessage ? "rounded-br-md" : "rounded-bl-md") : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 460, damping: 34, mass: 0.7 }}
      className={`flex w-full flex-col ${isOwnMessage ? "items-end" : "items-start"} ${
        isFirstInGroup ? "mt-2 first:mt-0" : "mt-0.5"
      }`}
    >
      <div
        className={`max-w-[min(90%,28rem)] rounded-2xl text-[15px] leading-snug sm:max-w-[min(75%,28rem)] ${
          isMediaOnly ? "p-1" : "px-3.5 py-2"
        } ${tailCorner} ${
          isOwnMessage
            ? "bg-accent text-accent-foreground"
            : "border border-border bg-surface"
        }`}
      >
        {hasImage ? (
          <img
            src={withTransform(message.imageUrl, IMAGE_TRANSFORM)}
            alt=""
            className={`max-h-52 max-w-full rounded-xl object-cover sm:max-h-64 ${
              isMediaOnly ? "" : "mb-1.5"
            }`}
          />
        ) : null}
        {hasVideo ? <MessageVideo src={message.videoUrl} /> : null}
        {message.text ? (
          <p className="whitespace-pre-wrap wrap-break-word">{message.text}</p>
        ) : null}
      </div>

      {isLastInGroup ? (
        <p className="mt-1 px-1 text-[11px] tabular-nums text-muted">
          {isOwnMessage ? `Delivered · ${message.time}` : message.time}
        </p>
      ) : null}
    </motion.div>
  );
}
