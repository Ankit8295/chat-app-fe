"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import MessageSkeleton from "@/components/ui/message-skeleton";
import { createSeededRandom } from "@/utils/seeded-random";

type SkeletonMessageItem = {
  id: number;
  isOutgoing: boolean;
  group: "single" | "multiple";
};

function createSkeletonMessages(seed: string): SkeletonMessageItem[] {
  const random = createSeededRandom(seed);
  const count = 20 + Math.floor(random() * 6);
  const messages: SkeletonMessageItem[] = [];

  for (let i = 0; i < count; i++) {
    const isOutgoing = random() < 0.45;
    const prev = messages[i - 1];
    const group =
      prev && prev.isOutgoing === isOutgoing ? "multiple" : "single";

    messages.push({
      id: i + 1,
      isOutgoing,
      group,
    });
  }

  return messages;
}

type MessageListSkeletonProps = {
  seed?: string;
};

export default function MessageListSkeleton({
  seed = "messages",
}: MessageListSkeletonProps) {
  const messages = useMemo(() => createSkeletonMessages(seed), [seed]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      aria-label="Loading messages"
      className="flex h-full min-h-0 w-full flex-col overflow-y-auto px-2 pb-28 animate-pulse select-none"
    >
      <div className="mt-auto flex w-full flex-col">
        {messages.map((msg) => (
          <MessageSkeleton
            key={msg.id}
            seed={`${seed}-${msg.id}`}
            isOutgoing={msg.isOutgoing}
            group={msg.group}
          />
        ))}
      </div>
    </div>
  );
}
