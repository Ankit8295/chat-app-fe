"use client";

import {
  useEffect,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
  type TextareaHTMLAttributes,
} from "react";
import { useTranslations } from "next-intl";
import AddIcon from "@/icons/add";
import SmileIcon from "@/icons/smile";
import SendIcon from "@/icons/send";
import { cn } from "../../../cn.config";

const MAX_TEXTAREA_HEIGHT_PX = 160;

export type MessageComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend?: () => void;
  onAttach?: () => void;
  onEmoji?: () => void;
  disabled?: boolean;
  className?: string;
} & Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange" | "disabled" | "className"
>;

export default function MessageComposer({
  value,
  onChange,
  onSend,
  onAttach,
  onEmoji,
  disabled = false,
  className,
  ...textareaProps
}: MessageComposerProps) {
  const t = useTranslations();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !disabled;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)}px`;
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const handleSend = () => {
    if (!canSend) return;
    onSend?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    textareaProps.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        "flex w-full items-end gap-1 rounded-2xl border border-border bg-surface-elevated px-2 py-1.5",
        className,
      )}
    >
      <textarea
        {...textareaProps}
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder={t("placeholder-type-message")}
        aria-label={t("placeholder-type-message")}
        className={cn(
          "min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-base font-medium text-foreground outline-hidden",
          "placeholder:text-muted caret-primary",
          "disabled:cursor-not-allowed disabled:text-disable-text",
          "max-h-40 overflow-y-auto",
        )}
      />

      <div className="flex shrink-0 items-center gap-0.5 pb-0.5">
        <button
          type="button"
          onClick={onAttach}
          disabled={disabled}
          aria-label={t("aria-attach-file")}
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors",
            "hover:bg-secondary hover:text-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <AddIcon className="size-5" />
        </button>

        <button
          type="button"
          onClick={onEmoji}
          disabled={disabled}
          aria-label={t("aria-open-emoji")}
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors",
            "hover:bg-secondary hover:text-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <SmileIcon className="size-5" />
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label={t("aria-send-message")}
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-full transition-colors",
            "bg-primary text-background",
            "hover:opacity-90",
            "disabled:cursor-not-allowed disabled:bg-disable-bg disabled:text-disable-text",
          )}
        >
          <SendIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
