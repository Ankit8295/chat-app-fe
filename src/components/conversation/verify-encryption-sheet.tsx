"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import SlidePanel from "@/components/ui/slide-panel";
import Typography from "@/components/ui/typography/typography";
import UserListItem from "@/components/ui/user-list-item";
import type { ConversationDetail } from "@/lib/queries/chat/types";
import { getPublicCrypto } from "@/lib/queries/user/api";
import { UsersQueryKeys } from "@/lib/queries/query-keys";
import { useGetMe } from "@/lib/queries/user/query";
import { getMemoryIdentity } from "@/lib/crypto/store";
import { safetyNumber } from "@/lib/crypto/safety-number";
import { useCrypto } from "@/lib/crypto/crypto-provider";

type VerifyEncryptionSheetProps = {
  conversation: ConversationDetail;
  open: boolean;
  onClose: () => void;
};

function formatSafetyNumber(value: string) {
  const groups = value.split(" ");
  const rows: string[] = [];
  for (let i = 0; i < groups.length; i += 4) {
    rows.push(groups.slice(i, i + 4).join("  "));
  }
  return rows.join("\n");
}

export default function VerifyEncryptionSheet({
  conversation,
  open,
  onClose,
}: VerifyEncryptionSheetProps) {
  const t = useTranslations();
  const { data: me } = useGetMe();
  const { ready } = useCrypto();
  const isDirect = conversation.type === "direct";
  const myPublicKey = ready ? getMemoryIdentity()?.publicKey : undefined;
  const members = useMemo(() => {
    if (isDirect) {
      return conversation.friend ? [conversation.friend] : [];
    }
    return conversation.participants.filter((participant) => participant.id !== me?.id);
  }, [conversation.friend, conversation.participants, isDirect, me?.id]);
  const memberIds = useMemo(() => members.map((member) => member.id), [members]);

  const publicKeysQuery = useQuery({
    queryKey: [UsersQueryKeys.PUBLIC_KEYS, conversation.id, ...memberIds],
    queryFn: () => getPublicCrypto(memberIds),
    enabled: open && memberIds.length > 0,
    staleTime: Infinity,
  });

  const [numbers, setNumbers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open || !myPublicKey || !publicKeysQuery.data) {
      setNumbers({});
      return;
    }
    let cancelled = false;
    void Promise.all(
      publicKeysQuery.data.map(async (key) => ({
        userId: key.userId,
        value: await safetyNumber(myPublicKey, key.publicKey),
      })),
    ).then((rows) => {
      if (cancelled) return;
      setNumbers(
        Object.fromEntries(rows.map((row) => [row.userId, formatSafetyNumber(row.value)])),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [open, myPublicKey, publicKeysQuery.data]);

  const directNumber = conversation.friend ? numbers[conversation.friend.id] : undefined;

  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      title={t("label-verify-encryption")}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        <Typography variant="p" className="text-sm text-muted">
          {isDirect
            ? t("description-verify-encryption", {
                name: conversation.friend?.name ?? conversation.name ?? "",
              })
            : t("description-verify-encryption-group")}
        </Typography>

        {isDirect ? (
          directNumber ? (
            <Typography
              variant="p"
              className="rounded-lg bg-secondary/40 px-3 py-3 text-center font-mono text-sm tracking-widest whitespace-pre-wrap"
            >
              {directNumber}
            </Typography>
          ) : (
            <Typography variant="p" className="text-sm text-muted">
              {t("error-safety-number-unavailable")}
            </Typography>
          )
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((member) => (
              <div key={member.id} className="rounded-lg border border-border px-2 py-2">
                <UserListItem name={member.name} image={member.image ?? undefined} />
                <Typography
                  variant="p"
                  className="mt-2 px-2 pb-1 font-mono text-xs tracking-widest whitespace-pre-wrap text-muted"
                >
                  {numbers[member.id] ?? t("error-safety-number-unavailable")}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </div>
    </SlidePanel>
  );
}
