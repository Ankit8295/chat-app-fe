"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "../../../cn.config";
import ActionIcon from "@/components/ui/action-icon";
import Avatar from "@/components/ui/avatar/avatar";
import Button from "@/components/ui/buttons/button";
import CustomInput from "@/components/ui/inputs/input";
import PanelHeader from "@/components/ui/panel-header";
import Typography from "@/components/ui/typography/typography";
import UserListItem from "@/components/ui/user-list-item";
import ConversationInfoRow from "@/components/conversation/conversation-info-row";
import AddGroupMembersModal from "@/components/conversation/add-group-members-modal";
import ViewAllMembersModal from "@/components/conversation/view-all-members-modal";
import VerifyEncryptionSheet from "@/components/conversation/verify-encryption-sheet";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import type { ConversationDetail } from "@/lib/queries/chat/types";
import {
  useDeleteConversation,
  useUpdateGroupConversation,
} from "@/lib/queries/chat/query";
import {
  createUpdateGroupAboutSchema,
  createUpdateGroupNameSchema,
  GROUP_ABOUT_MAX,
  GROUP_NAME_MAX,
} from "@/lib/queries/chat/validations";
import {
  useBlockFriend,
  useGetMe,
  useSetUserPreferences,
  useUnblockFriend,
} from "@/lib/queries/user/query";
import { useLayoutStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../../routes.config";
import BellIcon from "@/icons/bell";
import BlockIcon from "@/icons/block";
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
  const router = useRouter();
  const { data: me } = useGetMe();
  const updateGroup = useUpdateGroupConversation(conversation.id);
  const blockFriend = useBlockFriend();
  const unblockFriend = useUnblockFriend();
  const deleteConversation = useDeleteConversation();
  const { mutate: setUserPreference } = useSetUserPreferences();
  const setActiveConversationId = useLayoutStore(
    (state) => state.setActiveConversationId,
  );

  const nameSchema = useMemo(() => createUpdateGroupNameSchema(t), [t]);
  const aboutSchema = useMemo(() => createUpdateGroupAboutSchema(t), [t]);

  const [muted, setMuted] = useState(false);
  const [isAddMembersOpen, setAddMembersOpen] = useState(false);
  const [isViewAllMembersOpen, setViewAllMembersOpen] = useState(false);
  const [isVerifyOpen, setVerifyOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "block" | "unblock" | "delete" | null
  >(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [nameError, setNameError] = useState<string>();
  const [aboutError, setAboutError] = useState<string>();
  const [saveError, setSaveError] = useState<string>();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const aboutInputRef = useRef<HTMLInputElement>(null);

  const isDirect = conversation.type === "direct";
  const blockStatus = conversation.blockStatus ?? "none";
  const peerId = conversation.friend?.id;
  const canEditGroup =
    !isDirect && !!me?.id && conversation.createdBy === me.id;
  const displayName = conversation.name ?? conversation.id;
  const mediaCount = 0;
  const groupsInCommon = 0;
  const participantCount = conversation.participants.length;
  const previewParticipants = conversation.participants.slice(
    0,
    PARTICIPANTS_PREVIEW_LIMIT,
  );
  const hasMoreParticipants = participantCount > PARTICIPANTS_PREVIEW_LIMIT;
  const isSaving = updateGroup.isPending;
  const isActionPending =
    blockFriend.isPending ||
    unblockFriend.isPending ||
    deleteConversation.isPending;

  useEffect(() => {
    setName(conversation.name ?? "");
    setAbout(conversation.about ?? "");
    setNameError(undefined);
    setAboutError(undefined);
    setSaveError(undefined);
    setIsEditingName(false);
    setIsEditingAbout(false);
  }, [conversation]);

  useEffect(() => {
    if (!open) {
      setAddMembersOpen(false);
      setViewAllMembersOpen(false);
      setVerifyOpen(false);
      setIsEditingName(false);
      setIsEditingAbout(false);
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (isAddMembersOpen || isViewAllMembersOpen || isVerifyOpen) return;
      onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, isAddMembersOpen, isViewAllMembersOpen, isVerifyOpen]);

  useEffect(() => {
    if (isEditingName) {
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [isEditingName]);

  useEffect(() => {
    if (isEditingAbout) {
      setTimeout(() => aboutInputRef.current?.focus(), 50);
    }
  }, [isEditingAbout]);

  const handleSaveName = () => {
    const parsed = nameSchema.safeParse(name);
    if (!parsed.success) {
      setNameError(parsed.error.issues[0]?.message);
      return;
    }

    setNameError(undefined);
    setSaveError(undefined);

    if (parsed.data === (conversation.name ?? "")) {
      setIsEditingName(false);
      return;
    }

    updateGroup.mutate(
      { name: parsed.data },
      {
        onSuccess: () => setIsEditingName(false),
        onError: () => setSaveError(t("error-update-group-failed")),
      },
    );
  };

  const handleSaveAbout = () => {
    const parsed = aboutSchema.safeParse(about);
    if (!parsed.success) {
      setAboutError(parsed.error.issues[0]?.message);
      return;
    }

    setAboutError(undefined);
    setSaveError(undefined);

    const nextAbout = parsed.data;
    if (nextAbout === (conversation.about ?? "")) {
      setIsEditingAbout(false);
      return;
    }

    updateGroup.mutate(
      { about: nextAbout },
      {
        onSuccess: () => setIsEditingAbout(false),
        onError: () => setSaveError(t("error-update-group-failed")),
      },
    );
  };

  const handleConfirmAction = () => {
    setActionError(null);
    if (confirmAction === "block" && peerId) {
      blockFriend.mutate(peerId, {
        onSuccess: () => setConfirmAction(null),
        onError: () => setActionError(t("error-block-failed")),
      });
      return;
    }
    if (confirmAction === "unblock" && peerId) {
      unblockFriend.mutate(peerId, {
        onSuccess: () => setConfirmAction(null),
        onError: () => setActionError(t("error-unblock-failed")),
      });
      return;
    }
    if (confirmAction === "delete") {
      deleteConversation.mutate(conversation.id, {
        onSuccess: () => {
          setConfirmAction(null);
          onClose();
          setActiveConversationId(null);
          setUserPreference(null);
          router.push(ROUTES.HOME);
        },
        onError: () => setActionError(t("error-delete-chat-failed")),
      });
    }
  };

  return (
    <>
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
          "max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:z-40 max-lg:w-full max-lg:shadow-2xl max-lg:transition-transform max-lg:will-change-transform",
          open ? "max-lg:translate-x-0" : "max-lg:translate-x-full",
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
              {!canEditGroup && (
                <>
                  <Typography
                    variant="h2"
                    className="text-center text-xl font-semibold text-foreground"
                  >
                    {displayName}
                  </Typography>
                  {!isDirect && conversation.about && (
                    <Typography
                      variant="p"
                      className="text-center text-sm text-muted"
                    >
                      {conversation.about}
                    </Typography>
                  )}
                </>
              )}
              {!isDirect && (
                <Typography variant="span" className="text-muted">
                  {t("label-members-count", {
                    count: participantCount,
                  })}
                </Typography>
              )}
            </div>

            {canEditGroup && (
              <div className="flex flex-col gap-5 border-b border-border px-4 py-5">
                <CustomInput
                  ref={nameInputRef}
                  label={t("label-group-name")}
                  variant="underlined"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError(undefined);
                    setSaveError(undefined);
                  }}
                  readOnly={!isEditingName}
                  disabled={isSaving && isEditingName}
                  onClick={() =>
                    !isEditingName && !isSaving && setIsEditingName(true)
                  }
                  maxLength={GROUP_NAME_MAX}
                  error={nameError}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isEditingName && !isSaving) {
                      handleSaveName();
                    }
                  }}
                  rightContent={
                    isEditingName ? (
                      <CustomInput.RightActions
                        charsLeft={GROUP_NAME_MAX - name.length}
                        onSave={isSaving ? undefined : handleSaveName}
                        saveTitle={t("label-save")}
                      />
                    ) : (
                      <ActionIcon
                        name="pencil"
                        label={t("label-edit")}
                        className="size-8 text-muted hover:bg-transparent hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isSaving) setIsEditingName(true);
                        }}
                      />
                    )
                  }
                />

                <CustomInput
                  ref={aboutInputRef}
                  label={t("label-group-about")}
                  variant="underlined"
                  value={about}
                  onChange={(e) => {
                    setAbout(e.target.value);
                    setAboutError(undefined);
                    setSaveError(undefined);
                  }}
                  readOnly={!isEditingAbout}
                  disabled={isSaving && isEditingAbout}
                  onClick={() =>
                    !isEditingAbout && !isSaving && setIsEditingAbout(true)
                  }
                  maxLength={GROUP_ABOUT_MAX}
                  error={aboutError}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isEditingAbout && !isSaving) {
                      handleSaveAbout();
                    }
                  }}
                  rightContent={
                    isEditingAbout ? (
                      <CustomInput.RightActions
                        charsLeft={GROUP_ABOUT_MAX - about.length}
                        onSave={isSaving ? undefined : handleSaveAbout}
                        saveTitle={t("label-save")}
                      />
                    ) : (
                      <ActionIcon
                        name="pencil"
                        label={t("label-edit")}
                        className="size-8 text-muted hover:bg-transparent hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isSaving) setIsEditingAbout(true);
                        }}
                      />
                    )
                  }
                />

                {saveError && (
                  <Typography
                    variant="span"
                    className="text-destructive text-center"
                  >
                    {saveError}
                  </Typography>
                )}
              </div>
            )}

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
                onClick={() => setVerifyOpen(true)}
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
              {isDirect && blockStatus === "none" && peerId ? (
                <ConversationInfoRow
                  icon={<BlockIcon className="size-5" />}
                  label={t("label-block")}
                  variant="danger"
                  onClick={() => {
                    setActionError(null);
                    setConfirmAction("block");
                  }}
                />
              ) : null}
              {isDirect && blockStatus === "blocked_by_me" && peerId ? (
                <ConversationInfoRow
                  icon={<BlockIcon className="size-5" />}
                  label={t("label-unblock")}
                  onClick={() => {
                    setActionError(null);
                    setConfirmAction("unblock");
                  }}
                />
              ) : null}
              <ConversationInfoRow
                icon={<TrashIcon className="size-5" />}
                label={t("label-delete-chat")}
                variant="danger"
                onClick={() => {
                  setActionError(null);
                  setConfirmAction("delete");
                }}
              />
            </div>
          </div>
        </div>
      </aside>

      <ConfirmDialog
        open={confirmAction !== null}
        title={
          confirmAction === "block"
            ? t("label-confirm-block")
            : confirmAction === "unblock"
              ? t("label-confirm-unblock")
              : t("label-confirm-delete-chat")
        }
        description={
          confirmAction === "block"
            ? t("description-confirm-block")
            : confirmAction === "unblock"
              ? t("description-confirm-unblock")
              : t("description-confirm-delete-chat")
        }
        confirmLabel={
          confirmAction === "block"
            ? t("label-block")
            : confirmAction === "unblock"
              ? t("label-unblock")
              : t("label-delete-chat")
        }
        cancelLabel={t("label-cancel")}
        isPending={isActionPending}
        error={actionError}
        onConfirm={handleConfirmAction}
        onCancel={() => {
          if (isActionPending) return;
          setActionError(null);
          setConfirmAction(null);
        }}
      />

      <VerifyEncryptionSheet
        conversation={conversation}
        open={isVerifyOpen}
        onClose={() => setVerifyOpen(false)}
      />

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
