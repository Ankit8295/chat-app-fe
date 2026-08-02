"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import MessageBubble from "@/components/conversation/message-bubble";
import Typography from "@/components/ui/typography/typography";
import { Message } from "@/lib/queries/message/types";

type MessageListProps = {
  messages: Message[];
  currentUserId?: string;
  isGroup?: boolean;
  isLoading?: boolean;
  isFetchingOlder?: boolean;
  hasOlder?: boolean;
  onLoadOlder?: () => void;
};

export default function MessageList({
  messages,
  currentUserId,
  isGroup = false,
  isLoading = false,
  isFetchingOlder = false,
  hasOlder = false,
  onLoadOlder,
}: MessageListProps) {
  const t = useTranslations();
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const previousNewestIdRef = useRef<string | null>(null);
  const pendingOlderScrollRef = useRef<{ previousHeight: number } | null>(null);
  const wasFetchingOlderRef = useRef(false);

  const chronologicalMessages = useMemo(
    () => [...messages].reverse(),
    [messages],
  );

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || chronologicalMessages.length === 0) return;

    const newestId =
      chronologicalMessages[chronologicalMessages.length - 1]?.id ?? null;
    const newestChanged = newestId !== previousNewestIdRef.current;
    previousNewestIdRef.current = newestId;

    if (pendingOlderScrollRef.current) {
      const { previousHeight } = pendingOlderScrollRef.current;
      el.scrollTop = el.scrollHeight - previousHeight;
      pendingOlderScrollRef.current = null;
      return;
    }

    if (stickToBottomRef.current || newestChanged) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chronologicalMessages]);

  useEffect(() => {
    if (wasFetchingOlderRef.current && !isFetchingOlder) {
      wasFetchingOlderRef.current = false;
    }
  }, [isFetchingOlder]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      stickToBottomRef.current = distanceFromBottom < 80;

      if (
        el.scrollTop < 80 &&
        hasOlder &&
        !isFetchingOlder &&
        !wasFetchingOlderRef.current
      ) {
        pendingOlderScrollRef.current = { previousHeight: el.scrollHeight };
        wasFetchingOlderRef.current = true;
        onLoadOlder?.();
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [hasOlder, isFetchingOlder, onLoadOlder]);

  if (!isLoading && chronologicalMessages.length === 0) {
    return (
      <div
        aria-label={t("aria-message-list")}
        className="flex h-full min-h-0 w-full flex-col items-center justify-center px-6 pb-28 text-center"
      >
        <Typography
          variant="p"
          className="text-base font-semibold text-foreground"
        >
          {t("label-no-messages")}
        </Typography>
        <Typography variant="span" className="mt-1 text-muted">
          {t("label-no-messages-hint")}
        </Typography>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      aria-label={t("aria-message-list")}
      className="flex h-full min-h-0 w-full flex-col overflow-y-auto px-2 pb-28"
    >
      {isFetchingOlder && (
        <Typography variant="span" className="py-2 text-center text-muted">
          {t("label-loading-older-messages")}
        </Typography>
      )}

      <div className="mt-auto flex w-full flex-col">
        {chronologicalMessages.map((message, index) => {
          const previous = chronologicalMessages[index - 1];
          const isOutgoing = message.senderId === currentUserId;
          const group =
            previous && previous.senderId === message.senderId
              ? "multiple"
              : "single";
          const showSenderName = isGroup && !isOutgoing && group === "single";

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isOutgoing={isOutgoing}
              group={group}
              showSenderName={showSenderName}
            />
          );
        })}
      </div>
    </div>
  );
}
