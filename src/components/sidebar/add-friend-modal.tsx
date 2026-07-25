"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useLayoutStore } from "@/store/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import XIcon from "@/icons/x";
import SearchIcon from "@/icons/search";
import MessageIcon from "@/icons/message-icon";
import Typography from "@/components/ui/typography/typography";
import { getInitials } from "@/utils/string";
import { useSearchUsers, useCreateConversation } from "@/lib/queries/user/query";
import { ROUTES } from "../../../routes.config";

export default function AddFriendModal() {
  const t = useTranslations();
  const router = useRouter();

  const isAddFriendOpen = useLayoutStore((state) => state.isAddFriendOpen);
  const setAddFriendOpen = useLayoutStore((state) => state.setAddFriendOpen);
  const setActiveUserId = useLayoutStore((state) => state.setActiveUserId);

  const [searchQuery, setSearchQuery] = useState("");

  const { data: usersList = [], isLoading, isError } = useSearchUsers(searchQuery);
  const createConversation = useCreateConversation();

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
        <Dialog.Content className="fixed inset-0 m-auto z-50 flex h-[520px] w-full max-w-lg flex-col rounded-xl border border-border bg-surface-elevated p-6 shadow-2xl outline-none max-sm:h-full max-sm:w-full max-sm:max-h-full max-sm:max-w-none max-sm:m-0 max-sm:rounded-none max-sm:p-4 animate-scale-up">
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

          {/* User List */}
          <div className="flex-1 overflow-y-auto mt-4 pr-1 min-h-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <Typography variant="span" className="text-muted text-sm">
                  {t("label-searching-users") || "Searching users..."}
                </Typography>
              </div>
            ) : isError ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center mt-4">
                <Typography variant="span" className="text-muted text-sm">
                  {t("error-fetch-users-failed") || "Failed to load users. Please try again."}
                </Typography>
              </div>
            ) : usersList.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center mt-4">
                <Typography variant="span" className="text-muted text-sm">
                  {t("label-users-empty") || "No users found."}
                </Typography>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {usersList.map((user) => {
                  const initials = getInitials(user.name || user.email);
                  const isPendingThisUser =
                    createConversation.isPending &&
                    createConversation.variables === user.id;

                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-3.5 py-2.5 hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground shrink-0 overflow-hidden">
                          {user.img ? (
                            <img
                              src={user.img}
                              alt={user.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            initials
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <Typography
                            variant="span"
                            className="block truncate font-medium text-sm text-foreground"
                          >
                            {user.name}
                          </Typography>
                          <Typography
                            variant="span"
                            className="block truncate text-xs text-muted"
                          >
                            {user.email}
                          </Typography>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isPendingThisUser}
                        onClick={() => handleStartChat(user.id)}
                        title={t("label-start-chat") || "Message"}
                        className="flex items-center justify-center rounded-lg p-2 text-foreground/70 hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer outline-none shrink-0 disabled:opacity-50"
                      >
                        {isPendingThisUser ? (
                          <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <MessageIcon className="size-5 stroke-current" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
