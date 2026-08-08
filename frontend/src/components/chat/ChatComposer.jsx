import { Button, TextArea } from "@heroui/react";
import { ArrowUpIcon, ImageIcon, LoaderIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import useKeyboardSound from "../../hooks/useKeyboardSound";
import { useChatStore } from "../../store/useChatStore";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";

export function ChatComposer() {
  const composerText = useChatStore((state) => state.composerText);
  const isSoundEnabled = useChatStore((state) => state.isSoundEnabled);
  const sendMediaMessage = useChatStore((state) => state.sendMediaMessage);
  const isSendingMedia = useChatStore((state) => state.isSendingMedia);
  const sendTextMessage = useChatStore((state) => state.sendTextMessage);
  const setComposerText = useChatStore((state) => state.setComposerText);
  const { activeConversationId } = useSelectedConversation();
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const mediaInputRef = useRef(null);

  const playSoundIfEnabled = () => {
    if (isSoundEnabled) playRandomKeyStrokeSound();
  };

  const handleSend = async () => {
    const didSendMessage = await sendTextMessage(activeConversationId);
    if (didSendMessage) playSoundIfEnabled();
  };

  const handleComposerTextChange = (event) => {
    setComposerText(event.target.value);
    playSoundIfEnabled();
  };

  const handleMediaPick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const didSendMessage = await sendMediaMessage({
      conversationId: activeConversationId,
      file,
    });

    if (didSendMessage) playSoundIfEnabled();
  };

  return (
    <footer className="shrink-0 px-2 pb-2.5 pt-1.5 sm:px-3">
      {isSendingMedia ? (
        <div className="mx-auto mb-2 flex max-w-full items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted">
          <LoaderIcon
            className="size-4 shrink-0 animate-spin text-accent"
            strokeWidth={2}
            aria-hidden
          />
          <span className="truncate">Uploading media...</span>
        </div>
      ) : null}
      <div className="mx-auto flex w-full max-w-full items-end gap-2 px-0.5 sm:px-1">
        <input
          ref={mediaInputRef}
          type="file"
          accept="image/*,video/*"
          className="sr-only"
          disabled={isSendingMedia}
          tabIndex={-1}
          aria-hidden
          onChange={handleMediaPick}
        />

        <div className="flex flex-1 items-end gap-1 rounded-[22px] border border-border bg-surface py-0.5 pl-1 pr-2 transition-colors focus-within:border-accent">
          <Button
            variant="ghost"
            isIconOnly
            isDisabled={isSendingMedia}
            aria-label="Attach photo or video"
            className="size-9 shrink-0 touch-manipulation self-end rounded-full text-accent"
            onPress={() => mediaInputRef.current?.click()}
          >
            <ImageIcon className="size-5" strokeWidth={2} />
          </Button>

          <TextArea
            fullWidth
            variant="secondary"
            placeholder="Message"
            rows={1}
            value={composerText}
            onChange={handleComposerTextChange}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 border-0! bg-transparent! py-2 shadow-none! outline-none!"
          />
        </div>

        <motion.div
          animate={{ scale: composerText.trim() ? 1 : 0.9, opacity: composerText.trim() ? 1 : 0.5 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="shrink-0 self-end"
        >
          <Button
            variant="primary"
            isIconOnly
            aria-label="Send message"
            isDisabled={!composerText.trim()}
            className="size-10 rounded-full"
            onPress={handleSend}
          >
            <ArrowUpIcon className="size-5" strokeWidth={2.5} />
          </Button>
        </motion.div>
      </div>
    </footer>
  );
}