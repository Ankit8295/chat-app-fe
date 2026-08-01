"use client";

import { cn } from "../../../cn.config";

type SkeletonMessage = {
  id: number;
  isOutgoing: boolean;
  widthClass: string;
  heightClass: string;
  showAvatar?: boolean;
};

const SKELETON_MESSAGES: SkeletonMessage[] = [
  { id: 1, isOutgoing: false, widthClass: "w-48 max-w-[65%]", heightClass: "h-10", showAvatar: true },
  { id: 2, isOutgoing: true, widthClass: "w-64 max-w-[70%]", heightClass: "h-12" },
  { id: 3, isOutgoing: false, widthClass: "w-72 max-w-[75%]", heightClass: "h-16", showAvatar: true },
  { id: 4, isOutgoing: true, widthClass: "w-40 max-w-[55%]", heightClass: "h-10" },
  { id: 5, isOutgoing: false, widthClass: "w-56 max-w-[65%]", heightClass: "h-12", showAvatar: true },
  { id: 6, isOutgoing: true, widthClass: "w-80 max-w-[80%]", heightClass: "h-14" },
  { id: 7, isOutgoing: false, widthClass: "w-36 max-w-[50%]", heightClass: "h-9", showAvatar: true },
  { id: 8, isOutgoing: true, widthClass: "w-52 max-w-[60%]", heightClass: "h-10" },
];

export default function MessageListSkeleton() {
  return (
    <div
      aria-label="Loading messages"
      className="flex h-full w-full flex-col justify-end p-4 md:p-6 gap-4 overflow-hidden animate-pulse select-none"
    >
      {SKELETON_MESSAGES.map((msg) =>
        msg.isOutgoing ? (
          /* Outgoing Message Skeleton (Right Aligned) */
          <div key={msg.id} className="flex w-full justify-end items-end gap-2">
            <div
              className={cn(
                "rounded-2xl rounded-tr-xs bg-primary/20 shrink-0",
                msg.widthClass,
                msg.heightClass,
              )}
            />
          </div>
        ) : (
          /* Incoming Message Skeleton (Left Aligned with Avatar) */
          <div key={msg.id} className="flex w-full justify-start items-end gap-2.5">
            {msg.showAvatar && (
              <div className="size-8 shrink-0 rounded-xl bg-secondary" />
            )}
            <div
              className={cn(
                "rounded-2xl rounded-tl-xs bg-secondary shrink-0",
                msg.widthClass,
                msg.heightClass,
              )}
            />
          </div>
        ),
      )}
    </div>
  );
}
