"use client";

import React, { useState, useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useLayoutStore } from "@/store/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import XIcon from "@/icons/x";
import SearchIcon from "@/icons/search";
import MessageIcon from "@/icons/message-icon";
import Typography from "@/components/ui/typography/typography";
import { UserListItem } from "@/components/ui/user-list-item";
import {
  useInfiniteSearchUsers,
  useCreateConversation,
} from "@/lib/queries/user/query";
import { ROUTES } from "../../../routes.config";

export default function AddFriendModal() {
  const t = useTranslations();
  const router = useRouter();

  const isAddFriendOpen = useLayoutStore((state) => state.isAddFriendOpen);
  const setAddFriendOpen = useLayoutStore((state) => state.setAddFriendOpen);
  const setActiveUserId = useLayoutStore((state) => state.setActiveUserId);

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchUsers(searchQuery);

  const createConversation = useCreateConversation();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver attached directly to the scroll container root
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

  // Fallback scroll listener on the container for modal viewports
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop - clientHeight < 60) {
      fetchNextPage();
    }
  };

  const allUsers = data?.pages.flatMap((page) => page.content) ?? [];
  const totalElements = data?.pages[0]?.totalElements ?? 0;

  const handleStartChat = (targetUserId: string) => {
    createConversation.mutate(targetUserId, {
      onSuccess: (conversation) => {
        setAddFriendOpen(false);
        setActiveUserId(conversation.id);
        router.push(ROUTES.CHAT(conversation.id));
      },
    });
  };

  return (
    <Dialog.Root open={isAddFriendOpen} onOpenChange={setAddFriendOpen}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in" />

        {/* Content Box */}
        <Dialog.Content className="fixed inset-0 m-auto z-50 flex h-[540px] w-full max-w-lg flex-col rounded-xl border border-border bg-surface-elevated p-6 shadow-2xl outline-none max-sm:h-full max-sm:w-full max-sm:max-h-full max-sm:max-w-none max-sm:m-0 max-sm:rounded-none max-sm:p-4 animate-scale-up">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
            <div>
              <Dialog.Title className="text-xl font-bold text-foreground max-sm:text-lg">
                {t("label-add-friend") || "Add Friend"}
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                Find friends and start new conversations.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full p-1.5 text-foreground/50 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer outline-none"
                aria-label={t("label-close") || "Close"}
              >
                <XIcon className="size-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Search Bar */}
          <div className="relative mt-4 shrink-0">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("placeholder-find-friends") || "Find friends..."}
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* User List Container with scroll listener and ref */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto mt-4 pr-1 min-h-0 flex flex-col gap-2"
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 my-auto">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <Typography variant="span" className="text-muted text-sm">
                  {t("label-searching-users") || "Searching users..."}
                </Typography>
              </div>
            ) : isError ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center mt-4">
                <Typography variant="span" className="text-muted text-sm">
                  {t("error-fetch-users-failed") ||
                    "Failed to load users. Please try again."}
                </Typography>
              </div>
            ) : allUsers.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center mt-4">
                <Typography variant="span" className="text-muted text-sm">
                  {t("label-users-empty") || "No users found."}
                </Typography>
              </div>
            ) : (
              <>
                <div className="text-xs font-semibold text-muted mb-1 px-1 flex justify-between items-center shrink-0">
                  <span>Results ({totalElements})</span>
                </div>

                {allUsers.map((user) => {
                  const isPendingThisUser =
                    createConversation.isPending &&
                    createConversation.variables === user.id;

                  return (
                    <UserListItem
                      key={user.id}
                      name={user.name}
                      email={user.email}
                      image={user.img}
                    >
                      <UserListItem.Action
                        disabled={isPendingThisUser}
                        onClick={() => handleStartChat(user.id)}
                        title={t("label-start-chat") || "Message"}
                        variant="default"
                      >
                        {isPendingThisUser ? (
                          <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <MessageIcon className="size-5 stroke-current" />
                        )}
                      </UserListItem.Action>
                    </UserListItem>
                  );
                })}

                {/* Infinite Scroll Trigger Sentinel & Loading Indicator */}
                <div
                  ref={loadMoreRef}
                  className="py-3 flex items-center justify-center shrink-0"
                >
                  {isFetchingNextPage ? (
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Loading more users...
                    </div>
                  ) : hasNextPage ? (
                    <span className="text-xs text-muted/60">
                      Scroll down for more...
                    </span>
                  ) : (
                    <span className="text-xs text-muted/40">
                      Reached end of results
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
