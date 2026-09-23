"use client";

import { useTranslations } from "next-intl";
import Avatar from "@/components/ui/avatar/avatar";
import Typography from "@/components/ui/typography/typography";
import { Message } from "@/lib/queries/message/types";
import { cn } from "../../../cn.config";

export type MessageBubbleProps = {
  message: Message;
  isOutgoing: boolean;
  group: "single" | "multiple";
  showSenderName?: boolean;
};

function formatMessageTime(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessageBubble({
  message,
  isOutgoing,
  group,
  showSenderName = false,
}: MessageBubbleProps) {
  const t = useTranslations();
  const showAvatar = !isOutgoing && group === "single";
  const body = message.decryptFailed ? t("error-decrypt-message") : message.content;

  if (isOutgoing) {
    return (
      <div
        className={cn(
          "flex w-full justify-end items-end gap-2",
          group === "single" ? "mt-4" : "mt-1.5",
        )}
      >
        <div className="max-w-[80%] rounded-xl rounded-tr-xs bg-primary/20 px-2 py-1">
          <Typography
            variant="p"
            className={cn(
              "whitespace-pre-wrap wrap-break-word text-sm font-medium",
              message.decryptFailed ? "italic text-muted" : "text-foreground",
            )}
          >
            {body}
          </Typography>
          <Typography
            variant="span"
            className=" block text-right text-[10px] text-muted"
          >
            {formatMessageTime(message.createdAt)}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full justify-start items-start gap-2",
        group === "single" ? "mt-4" : "mt-1.5",
      )}
    >
      {showAvatar ? (
        <Avatar
          src={message.senderImage ?? undefined}
          name={message.senderName}
          size="sm"
          shape="rounded"
          className="shrink-0"
        />
      ) : (
        <div className="size-8 shrink-0" />
      )}
      <div className="max-w-[80%] rounded-xl rounded-tl-xs bg-secondary px-2 py-1">
        {showSenderName && (
          <Typography
            variant="span"
            className="mb-0.5 block font-semibold text-primary"
          >
            {message.senderName}
          </Typography>
        )}
        <Typography
          variant="p"
          className={cn(
            "whitespace-pre-wrap wrap-break-word text-sm font-medium",
            message.decryptFailed ? "italic text-muted" : "text-foreground",
          )}
        >
          {body}
        </Typography>
        <Typography
          variant="span"
          className=" block text-right text-[10px] text-muted"
        >
          {formatMessageTime(message.createdAt)}
        </Typography>
      </div>
    </div>
  );
}
