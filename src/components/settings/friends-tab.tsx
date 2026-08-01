"use client";

import React, { useEffect, useRef } from "react";
import { useInfiniteGetFriendsOnly } from "@/lib/queries/user/query";
import { useTranslations } from "next-intl";
import Typography from "@/components/ui/typography/typography";
import InfoBox from "@/components/ui/info-box";
import FriendItem from "./friend-item";

export default function FriendsTab() {
  const t = useTranslations();
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteGetFriendsOnly();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const scrollContainer = scrollContainerRef.current;
    const sentinel = loadMoreRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: scrollContainer,
        threshold: 0.1,
      },
    );

    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data?.pages.length]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop - clientHeight < 60) {
      fetchNextPage();
    }
  };

  const allFriends = data?.pages.flatMap((page) => page.content) ?? [];
  const totalElements = data?.pages[0]?.totalElements ?? 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 my-auto">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <Typography variant="span" className="text-muted text-sm">
          {t("label-loading-friends")}
        </Typography>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <Typography variant="span" className="text-muted text-sm">
          {t("error-fetch-friends-failed")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-sm:gap-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <Typography
            variant="span"
            className="text-xs font-bold uppercase tracking-wider text-muted block"
          >
            {t("label-manage-friends")} ({totalElements})
          </Typography>
        </div>

        {allFriends.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border">
            <InfoBox
              title={t("label-no-friends")}
              titleClassName="text-sm text-muted font-normal"
              className="p-6 gap-0"
            />
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex flex-col gap-2 max-h-87.5 max-sm:max-h-75 overflow-y-auto pr-1"
          >
            {allFriends.map((friend) => (
              <FriendItem key={friend.userId} friend={friend} />
            ))}

            {/* Sentinel for Infinite Scroll Trigger */}
            <div
              ref={loadMoreRef}
              className="py-2 flex items-center justify-center shrink-0"
            >
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2 text-xs text-muted">
                  <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <Typography variant="span">
                    {t("label-loading-more-friends")}
                  </Typography>
                </div>
              ) : hasNextPage ? (
                <Typography variant="span" className="text-xs text-muted/60">
                  {t("label-scroll-for-more")}
                </Typography>
              ) : (
                <Typography variant="span" className="text-xs text-muted/40">
                  {t("label-end-of-friends")}
                </Typography>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
