"use client";

import { useState, useEffect, useRef } from "react";
import { useLayoutStore } from "@/store/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import SearchIcon from "@/icons/search";
import Typography from "@/components/ui/typography/typography";
import InfoBox from "@/components/ui/info-box";
import { UserListItem } from "@/components/ui/user-list-item";
import SlidePanel from "@/components/ui/slide-panel";
import {
  useInfiniteSearchUsers,
  useCreateConversation,
} from "@/lib/queries/user/query";
import { ROUTES } from "../../../routes.config";

export default function NewChatModal() {
  const t = useTranslations();
  const router = useRouter();

  const isNewChatOpen = useLayoutStore((state) => state.isNewChatOpen);
  const setNewChatOpen = useLayoutStore((state) => state.setNewChatOpen);
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
    createConversation.mutate(
      { type: "DIRECT", userId: targetUserId },
      {
        onSuccess: (conversation) => {
          setNewChatOpen(false);
          setActiveConversationId(conversation.id);
          router.push(ROUTES.CONVERSATION(conversation.id));
        },
      },
    );
  };

  return (
    <SlidePanel
      open={isNewChatOpen}
      onClose={() => setNewChatOpen(false)}
      title={t("label-new-chat")}
    >
      <div className="shrink-0 border-b border-border px-2.5 py-3">
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("placeholder-find-people")}
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
            autoFocus={isNewChatOpen}
          />
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2.5 py-3"
      >
        {!trimmedQuery ? (
          <div className="my-auto">
            <InfoBox
              icon={<SearchIcon className="size-8 stroke-current" />}
              iconContainerClassName="size-16 bg-secondary text-primary/80"
              title={t("label-search-people-prompt")}
              titleClassName="text-base font-semibold"
              description={t("label-search-people-hint")}
              descriptionClassName="text-xs max-w-xs leading-relaxed"
              className="p-8 gap-3"
            />
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 my-auto">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <Typography variant="span" className="text-muted text-sm">
              {t("label-searching-users")}
            </Typography>
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center my-auto">
            <Typography variant="span" className="text-muted text-sm">
              {t("error-fetch-users-failed")}
            </Typography>
          </div>
        ) : allUsers.length === 0 ? (
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
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-muted mb-1 px-1 flex justify-between items-center shrink-0">
              <Typography variant="span">
                {t("label-results")} ({totalElements})
              </Typography>
            </div>

            {allUsers.map((user) => {
              const isPendingThisUser =
                createConversation.isPending &&
                createConversation.variables?.type === "DIRECT" &&
                createConversation.variables.userId === user.id;

              return (
                <UserListItem
                  key={user.id}
                  name={user.name}
                  email={user.email}
                  image={user.img}
                >
                  {isPendingThisUser ? (
                    <div
                      aria-label={t("label-start-chat")}
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl"
                    >
                      <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  ) : (
                    <UserListItem.Action
                      name="message"
                      label={t("label-start-chat")}
                      disabled={isPendingThisUser}
                      onClick={() => handleStartChat(user.id)}
                    />
                  )}
                </UserListItem>
              );
            })}

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
                <Typography variant="span" className="text-xs text-muted/60">
                  {t("label-scroll-for-more")}
                </Typography>
              ) : (
                <Typography variant="span" className="text-xs text-muted/40">
                  {t("label-end-of-results")}
                </Typography>
              )}
            </div>
          </div>
        )}
      </div>
    </SlidePanel>
  );
}
