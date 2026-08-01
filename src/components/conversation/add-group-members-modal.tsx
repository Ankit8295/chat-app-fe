"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useInfiniteSearchUsers } from "@/lib/queries/user/query";
import type {
  ConversationParticipant,
  UserSearchResult,
} from "@/lib/queries/user/types";
import ActionIcon from "@/components/ui/action-icon";
import Avatar from "@/components/ui/avatar/avatar";
import Button from "@/components/ui/buttons/button";
import InfoBox from "@/components/ui/info-box";
import SlidePanel from "@/components/ui/slide-panel";
import Typography from "@/components/ui/typography/typography";
import { UserListItem } from "@/components/ui/user-list-item";
import CheckIcon from "@/icons/check";
import SearchIcon from "@/icons/search";
import { cn } from "../../../cn.config";

type AddGroupMembersModalProps = {
  open: boolean;
  onClose: () => void;
  existingParticipants: ConversationParticipant[];
};

export default function AddGroupMembersModal({
  open,
  onClose,
  existingParticipants,
}: AddGroupMembersModalProps) {
  const t = useTranslations();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserSearchResult[]>([]);

  const trimmedQuery = searchQuery.trim();
  const existingIds = useMemo(
    () => new Set(existingParticipants.map((participant) => participant.id)),
    [existingParticipants],
  );
  const selectedIds = useMemo(
    () => selectedUsers.map((user) => user.id),
    [selectedUsers],
  );

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchUsers(trimmedQuery);

  const allUsers =
    data?.pages
      .flatMap((page) => page.content)
      .filter((user) => !existingIds.has(user.id)) ?? [];

  useEffect(() => {
    if (open) return;
    setSearchQuery("");
    setSelectedUsers([]);
  }, [open]);

  useEffect(() => {
    if (!open || !trimmedQuery || !hasNextPage || isFetchingNextPage) return;

    const scrollContainer = scrollContainerRef.current;
    const sentinel = loadMoreRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: scrollContainer, threshold: 0.1 },
    );

    if (sentinel) observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [
    open,
    trimmedQuery,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    data?.pages.length,
  ]);

  const toggleParticipant = (user: UserSearchResult) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((item) => item.id === user.id);
      return exists
        ? prev.filter((item) => item.id !== user.id)
        : [...prev, user];
    });
  };

  const removeParticipant = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleAdd = () => {
    if (selectedUsers.length === 0) return;
    // API integration later
    onClose();
  };

  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      title={t("label-add-members")}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <Typography
              variant="span"
              className="text-xs font-bold uppercase tracking-wider text-muted"
            >
              {t("label-add-participants")}
            </Typography>
            <Typography variant="span" className="text-xs text-muted">
              {t("label-participants-selected", {
                count: selectedUsers.length,
              })}
            </Typography>
          </div>

          {selectedUsers.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/30 py-1 pl-1 pr-1.5"
                >
                  <Avatar
                    name={user.name}
                    src={user.img}
                    size="sm"
                    shape="rounded"
                  />
                  <Typography
                    variant="span"
                    className="max-w-24 truncate text-xs text-foreground"
                  >
                    {user.name}
                  </Typography>
                  <ActionIcon
                    name="x"
                    label={t("aria-remove-participant", { name: user.name })}
                    className="size-6 rounded-md"
                    iconClassName="size-3.5"
                    onClick={() => removeParticipant(user.id)}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="relative mb-3">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("placeholder-find-people")}
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {!trimmedQuery ? (
            <InfoBox
              icon={<SearchIcon className="size-8 stroke-current" />}
              iconContainerClassName="size-14 bg-secondary text-primary/80"
              title={t("label-search-participants-prompt")}
              titleClassName="text-sm font-semibold"
              description={t("label-search-add-members-hint")}
              descriptionClassName="text-xs max-w-xs leading-relaxed"
              className="p-6 gap-2"
            />
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <Typography variant="span" className="text-muted text-sm">
                {t("label-searching-users")}
              </Typography>
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <Typography variant="span" className="text-muted text-sm">
                {t("error-fetch-users-failed")}
              </Typography>
            </div>
          ) : allUsers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border">
              <InfoBox
                title={t("label-no-search-results")}
                titleClassName="text-sm font-semibold"
                description={t("label-no-search-results-hint")}
                descriptionClassName="text-xs"
                className="p-6 gap-2"
              />
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex flex-col gap-2 max-h-[min(24rem,50vh)] overflow-y-auto pr-1"
            >
              {allUsers.map((user) => {
                const selected = selectedIds.includes(user.id);
                return (
                  <UserListItem
                    key={user.id}
                    name={user.name}
                    email={user.email}
                    image={user.img}
                    selected={selected}
                    onClick={() => toggleParticipant(user)}
                  >
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-md border transition-colors",
                        selected
                          ? "border-primary bg-primary text-background"
                          : "border-border text-transparent",
                      )}
                    >
                      <CheckIcon className="size-3.5" />
                    </span>
                  </UserListItem>
                );
              })}

              <div
                ref={loadMoreRef}
                className="py-2 flex items-center justify-center shrink-0"
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
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border p-2.5">
          <Button
            type="button"
            fullWidth
            disabled={selectedUsers.length === 0}
            onClick={handleAdd}
          >
            {t("label-add-selected-members", { count: selectedUsers.length })}
          </Button>
        </div>
      </div>
    </SlidePanel>
  );
}
