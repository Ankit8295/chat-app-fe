"use client";

import { useMemo } from "react";
import { cn } from "../../../cn.config";
import { createSeededRandom } from "@/utils/seeded-random";

const WIDTH_CLASSES = [
  "w-36 max-w-[50%]",
  "w-40 max-w-[55%]",
  "w-48 max-w-[65%]",
  "w-52 max-w-[60%]",
  "w-56 max-w-[65%]",
  "w-64 max-w-[70%]",
  "w-72 max-w-[75%]",
  "w-80 max-w-[80%]",
] as const;

const SINGLE_HEIGHT_CLASSES = ["h-9", "h-10", "h-12"] as const;
const MULTIPLE_HEIGHT_CLASSES = ["h-12", "h-14", "h-16"] as const;

export type MessageSkeletonProps = {
  isOutgoing?: boolean;
  group?: "single" | "multiple";
  seed: string;
  className?: string;
};

export default function MessageSkeleton({
  isOutgoing = false,
  group = "single",
  seed,
  className,
}: MessageSkeletonProps) {
  const { widthClass, heightClass } = useMemo(() => {
    const random = createSeededRandom(`${seed}-${isOutgoing}-${group}`);
    const heights = group === "multiple" ? MULTIPLE_HEIGHT_CLASSES : SINGLE_HEIGHT_CLASSES;

    return {
      widthClass: WIDTH_CLASSES[Math.floor(random() * WIDTH_CLASSES.length)]!,
      heightClass: heights[Math.floor(random() * heights.length)]!,
    };
  }, [seed, isOutgoing, group]);

  const showAvatar = !isOutgoing && group === "single";

  if (isOutgoing) {
    return (
      <div
        className={cn(
          "flex w-full justify-end items-end gap-2",
          group === "single" ? "mt-4" : "mt-1.5",
          className,
        )}
      >
        <div
          className={cn(
            "rounded-2xl rounded-tr-xs bg-primary/20 shrink-0",
            widthClass,
            heightClass,
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full justify-start items-end gap-2.5",
        group === "single" ? "mt-4" : "mt-1.5",
        className,
      )}
    >
      {showAvatar ? (
        <div className="size-8 shrink-0 rounded-xl bg-secondary" />
      ) : (
        <div className="size-8 shrink-0" />
      )}
      <div
        className={cn(
          "rounded-2xl rounded-tl-xs bg-secondary shrink-0",
          widthClass,
          heightClass,
        )}
      />
    </div>
  );
}
