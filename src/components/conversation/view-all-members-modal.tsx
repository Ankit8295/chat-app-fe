"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { ConversationParticipant } from "@/lib/queries/chat/types";
import SlidePanel from "@/components/ui/slide-panel";
import Typography from "@/components/ui/typography/typography";
import UserListItem from "@/components/ui/user-list-item";
import InfoBox from "@/components/ui/info-box";
import SearchIcon from "@/icons/search";

type ViewAllMembersModalProps = {
  open: boolean;
  onClose: () => void;
  participants: ConversationParticipant[];
};

export default function ViewAllMembersModal({
  open,
  onClose,
  participants,
}: ViewAllMembersModalProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const filteredParticipants = useMemo(() => {
    if (!trimmedQuery) return participants;
    return participants.filter((participant) =>
      participant.name.toLowerCase().includes(trimmedQuery),
    );
  }, [participants, trimmedQuery]);

  return (
    <SlidePanel
      open={open}
      onClose={() => {
        setSearchQuery("");
        onClose();
      }}
      title={t("label-all-members-count", { count: participants.length })}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b border-border px-2.5 py-3">
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("placeholder-search-members")}
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-3">
          {filteredParticipants.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border">
              <InfoBox
                title={t("label-no-members-found")}
                titleClassName="text-sm font-semibold"
                description={t("label-no-members-found-hint")}
                descriptionClassName="text-xs"
                className="p-6 gap-2"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredParticipants.map((participant) => (
                <UserListItem
                  key={participant.id}
                  name={participant.name}
                  image={participant.image ?? undefined}
                />
              ))}
            </div>
          )}
        </div>

        {trimmedQuery ? (
          <div className="shrink-0 border-t border-border px-2.5 py-2">
            <Typography variant="span" className="text-xs text-muted">
              {t("label-members-showing", {
                shown: filteredParticipants.length,
                total: participants.length,
              })}
            </Typography>
          </div>
        ) : null}
      </div>
    </SlidePanel>
  );
}
