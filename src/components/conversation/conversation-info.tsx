"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "../../../cn.config";
import ActionIcon from "@/components/ui/action-icon";
import Avatar from "@/components/ui/avatar/avatar";
import Button from "@/components/ui/buttons/button";
import PanelHeader from "@/components/ui/panel-header";
import Typography from "@/components/ui/typography/typography";
import UserListItem from "@/components/ui/user-list-item";
import ConversationInfoRow from "@/components/conversation/conversation-info-row";
import AddGroupMembersModal from "@/components/conversation/add-group-members-modal";
import ViewAllMembersModal from "@/components/conversation/view-all-members-modal";
import type { ConversationDetail } from "@/lib/queries/chat/types";
import BellIcon from "@/icons/bell";
import ClearIcon from "@/icons/clear";
import HeartIcon from "@/icons/heart";
import LockIcon from "@/icons/lock";
import MediaIcon from "@/icons/media";
import PhoneIcon from "@/icons/phone";
import SearchIcon from "@/icons/search";
import TrashIcon from "@/icons/trash";
import VideoIcon from "@/icons/video";

/** How many participants to show in the group info preview before "View all". */
const PARTICIPANTS_PREVIEW_LIMIT = 5;

type ConversationInfoProps = {
  conversation: ConversationDetail;
  open: boolean;
  onClose: () => void;
};

export default function ConversationInfo({
  conversation,
  open,
  onClose,
}: ConversationInfoProps) {
  const t = useTranslations();
  const [muted, setMuted] = useState(false);
  const [isAddMembersOpen, setAddMembersOpen] = useState(false);
  const [isViewAllMembersOpen, setViewAllMembersOpen] = useState(false);
  const isDirect = conversation.type === "direct";
  const displayName = conversation.name ?? conversation.id;
  const mediaCount = 0;
  const groupsInCommon = 0;
  const participantCount = conversation.participants.length;
  const previewParticipants = conversation.participants.slice(
    0,
    PARTICIPANTS_PREVIEW_LIMIT,
  );
  const hasMoreParticipants = participantCount > PARTICIPANTS_PREVIEW_LIMIT;

  useEffect(() => {
    if (!open) {
      setAddMembersOpen(false);
      setViewAllMembersOpen(false);
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (isAddMembersOpen || isViewAllMembersOpen) return;
      onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, isAddMembersOpen, isViewAllMembersOpen]);

  return (
    <>
      {/* Mobile backdrop — drawer overlay like the menu sidebar */}
      <button
        type="button"
        aria-label={t("label-close")}
        onClick={onClose}
        className={cn(
          "absolute inset-0 z-30 bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      />

      <aside
        aria-hidden={!open}
        className={cn(
          "flex h-full min-h-0 flex-col overflow-hidden bg-surface transform-gpu ease-in-out duration-300",
          // Mobile: fixed full-screen drawer (like menu bar)
          "max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:z-40 max-lg:w-full max-lg:shadow-2xl max-lg:transition-transform max-lg:will-change-transform",
          open ? "max-lg:translate-x-0" : "max-lg:translate-x-full",
          // Desktop: inline column that squeezes the chat
          "lg:relative lg:inset-auto lg:z-auto lg:shrink-0 lg:border-l lg:border-border lg:shadow-none lg:transition-[width] lg:will-change-[width] lg:translate-x-0",
          open ? "lg:w-[min(40%,420px)]" : "lg:w-0 lg:border-l-0",
        )}
      >
        <div
          className={cn(
            "flex h-full min-h-0 w-full flex-col",
            "lg:w-[min(40vw,420px)]",
            !open && "lg:invisible",
          )}
        >
          <PanelHeader
            title={isDirect ? t("label-friend-info") : t("label-group-info")}
            onClose={onClose}
          />

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col items-center gap-3 border-b border-border px-4 py-8">
              <Avatar
                name={displayName}
                src={conversation.image ?? undefined}
                size="xl"
                shape="circle"
                className="size-28 text-3xl shadow-lg border-2 border-border"
              />
              <Typography
                variant="h2"
                className="text-center text-xl font-semibold text-foreground"
              >
                {displayName}
              </Typography>
              {!isDirect && (
                <Typography variant="span" className="text-muted">
                  {t("label-members-count", {
                    count: participantCount,
                  })}
                </Typography>
              )}
            </div>

            <div className="flex  items-center justify-center gap-8 border-b border-border px-4 py-5">
              <QuickAction
                icon={<PhoneIcon className="size-5" />}
                label={t("label-voice")}
                ariaLabel={t("aria-voice-call")}
              />
              <QuickAction
                icon={<VideoIcon className="size-5" />}
                label={t("label-video")}
                ariaLabel={t("aria-video-call")}
              />
              <QuickAction
                icon={<SearchIcon className="size-5" />}
                label={t("label-search")}
                ariaLabel={t("aria-search-chat")}
              />
            </div>

            <div className="border-b border-border ">
              <ConversationInfoRow
                icon={<MediaIcon className="size-5" />}
                label={t("label-media-links-docs")}
                trailing={
                  <Typography variant="span" className="text-muted">
                    {mediaCount}
                  </Typography>
                }
                onClick={() => undefined}
              />
              <ConversationInfoRow
                icon={<BellIcon className="size-5" />}
                label={t("label-mute-notifications")}
                trailing={
                  <button
                    type="button"
                    role="switch"
                    aria-checked={muted}
                    aria-label={t("label-mute-notifications")}
                    onClick={() => setMuted((value) => !value)}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors cursor-pointer outline-none",
                      muted ? "bg-primary" : "bg-secondary",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 size-5 rounded-full bg-background shadow transition-transform",
                        muted && "translate-x-5",
                      )}
                    />
                  </button>
                }
              />
              <ConversationInfoRow
                icon={<LockIcon className="size-5" />}
                label={t("label-encryption")}
                description={t("description-encryption")}
                onClick={() => undefined}
              />
            </div>

            {isDirect ? (
              <div className="border-b border-border px-4 py-4">
                <Typography variant="span" className="block text-sm text-muted">
                  {groupsInCommon > 0
                    ? t("label-groups-in-common", { count: groupsInCommon })
                    : t("label-no-groups-in-common")}
                </Typography>
              </div>
            ) : (
              <div className="border-b border-border px-4 py-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <Typography
                    variant="span"
                    className="text-sm font-medium text-muted"
                  >
                    {t("label-participants-with-count", {
                      count: participantCount,
                    })}
                  </Typography>
                  <ActionIcon
                    name="add"
                    label={t("aria-add-members")}
                    onClick={() => setAddMembersOpen(true)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {previewParticipants.map((participant) => (
                    <UserListItem
                      key={participant.id}
                      name={participant.name}
                      image={participant.image ?? undefined}
                    />
                  ))}
                </div>
                {hasMoreParticipants && (
                  <Button
                    type="button"
                    variant="text"
                    className="mt-3"
                    onClick={() => setViewAllMembersOpen(true)}
                  >
                    {t("label-view-all-members")}
                  </Button>
                )}
              </div>
            )}

            <div>
              <ConversationInfoRow
                icon={<HeartIcon className="size-5" />}
                label={t("label-add-to-favourites")}
                onClick={() => undefined}
              />
              <ConversationInfoRow
                icon={<ClearIcon className="size-5" />}
                label={t("label-clear-chat")}
                variant="danger"
                onClick={() => undefined}
              />
              <ConversationInfoRow
                icon={<TrashIcon className="size-5" />}
                label={t("label-delete-chat")}
                variant="danger"
                onClick={() => undefined}
              />
            </div>
          </div>
        </div>
      </aside>

      {!isDirect && (
        <>
          <AddGroupMembersModal
            open={isAddMembersOpen}
            onClose={() => setAddMembersOpen(false)}
            existingParticipants={conversation.participants}
          />
          <ViewAllMembersModal
            open={isViewAllMembersOpen}
            onClose={() => setViewAllMembersOpen(false)}
            participants={conversation.participants}
          />
        </>
      )}
    </>
  );
}

function QuickAction({
  icon,
  label,
  ariaLabel,
}: {
  icon: ReactNode;
  label: string;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="flex flex-col items-center gap-1.5 outline-none cursor-pointer group"
    >
      <span className="flex size-12 items-center justify-center rounded-full border border-border bg-secondary/30 text-foreground transition-colors group-hover:bg-secondary group-hover:text-primary">
        {icon}
      </span>
      <Typography variant="span" className="text-xs text-muted">
        {label}
      </Typography>
    </button>
  );
}
