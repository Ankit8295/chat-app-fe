"use client";

import React, { useState, useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useLayoutStore } from "@/store/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ActionIcon from "@/components/ui/action-icon";
import SearchIcon from "@/icons/search";
import MessageIcon from "@/icons/message-icon";
import Typography from "@/components/ui/typography/typography";
import InfoBox from "@/components/ui/info-box";
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
  const setActiveConversationId = useLayoutStore(
    (state) => state.setActiveConversationId,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const trimmedQuery = searchQuery.trim();

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchUsers(trimmedQuery);

  const createConversation = useCreateConversation();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver attached directly to the scroll container root
  useEffect(() => {
    if (!trimmedQuery || !hasNextPage || isFetchingNextPage) return;

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
  }, [
    trimmedQuery,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    data?.pages.length,
  ]);

  // Fallback scroll listener on the container for modal viewports
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || !trimmedQuery || !hasNextPage || isFetchingNextPage)
      return;

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
        setActiveConversationId(conversation.id);
        router.push(ROUTES.CONVERSATION(conversation.id));
      },
    });
  };

  return (
    <Dialog.Root open={isAddFriendOpen} onOpenChange={setAddFriendOpen}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in" />

        {/* Content Box */}
        <Dialog.Content className="fixed inset-0 m-auto z-50 flex h-135 w-full max-w-lg flex-col rounded-xl border border-border bg-surface-elevated p-6 shadow-2xl outline-none max-sm:h-full max-sm:w-full max-sm:max-h-full max-sm:max-w-none max-sm:m-0 max-sm:rounded-none max-sm:p-4 animate-scale-up">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
            <div>
              <Dialog.Title className="text-xl font-bold text-foreground max-sm:text-lg">
                {t("label-add-friend")}
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                {t("description-add-friend-modal")}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <ActionIcon name="x" label={t("label-close")} />
            </Dialog.Close>
          </div>

          {/* Search Bar */}
          <div className="relative mt-4 shrink-0">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("placeholder-find-friends")}
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          {/* Main List / State Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto mt-4 pr-1 min-h-0 flex flex-col"
          >
            {!trimmedQuery ? (
              /* Prompt State when no query is typed */
              <div className="my-auto">
                <InfoBox
                  icon={<SearchIcon className="size-8 stroke-current" />}
                  iconContainerClassName="size-16 bg-secondary text-primary/80"
                  title={t("label-search-friends-prompt")}
                  titleClassName="text-base font-semibold"
                  description={t("label-search-friends-hint")}
                  descriptionClassName="text-xs max-w-xs leading-relaxed"
                  className="p-8 gap-3"
                />
              </div>
            ) : isLoading ? (
              /* Searching Loading State */
              <div className="flex flex-col items-center justify-center gap-3 py-12 my-auto">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <Typography variant="span" className="text-muted text-sm">
                  {t("label-searching-users")}
                </Typography>
              </div>
            ) : isError ? (
              /* Error State */
              <div className="rounded-lg border border-dashed border-border p-6 text-center my-auto">
                <Typography variant="span" className="text-muted text-sm">
                  {t("error-fetch-users-failed")}
                </Typography>
              </div>
            ) : allUsers.length === 0 ? (
              /* No Results State */
              <div className="my-auto rounded-lg border border-dashed border-border">
                <InfoBox
                  title={t("label-no-search-results")}
                  titleClassName="text-sm font-semibold"
                  description={t("label-no-search-results-hint")}
                  descriptionClassName="text-xs"
                  className="p-8 gap-2"
                />
              </div>
            ) : (
              /* Results List with Infinite Scrolling */
              <div className="flex flex-col gap-2">
                <div className="text-xs font-semibold text-muted mb-1 px-1 flex justify-between items-center shrink-0">
                  <Typography variant="span">
                    {t("label-results")} ({totalElements})
                  </Typography>
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
                        title={t("label-start-chat")}
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
                      <Typography variant="span">
                        {t("label-loading-more-users")}
                      </Typography>
                    </div>
                  ) : hasNextPage ? (
                    <Typography
                      variant="span"
                      className="text-xs text-muted/60"
                    >
                      {t("label-scroll-for-more")}
                    </Typography>
                  ) : (
                    <Typography
                      variant="span"
                      className="text-xs text-muted/40"
                    >
                      {t("label-end-of-results")}
                    </Typography>
                  )}
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
