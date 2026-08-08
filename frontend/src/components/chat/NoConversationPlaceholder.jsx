import { motion } from "framer-motion";
import { MessageCircleIcon } from "lucide-react";

export function NoConversationPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex min-h-48 flex-1 flex-col items-center justify-center gap-4 px-4 py-12 text-center sm:gap-5 sm:px-8 sm:py-16"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
        className="flex size-22 items-center justify-center rounded-3xl bg-accent-soft"
        aria-hidden
      >
        <MessageCircleIcon className="size-10 text-accent" strokeWidth={1.25} />
      </motion.div>
      <div className="max-w-76 space-y-2">
        <h2 className="text-[16px] font-semibold tracking-tight sm:text-[17px]">
          Pick a conversation
        </h2>
        <p className="text-[13px] leading-relaxed text-muted">
          Choose someone from the list to read your messages and reply. Open the People tab to start
          a new chat.
        </p>
      </div>
    </motion.div>
  );
}
