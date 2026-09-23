"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/ui/buttons/button";
import Typography from "@/components/ui/typography/typography";

type BlockedComposerBannerProps = {
  variant: "blocked_by_me" | "blocked_by_peer";
  onUnblock?: () => void;
  isUnblocking?: boolean;
};

export default function BlockedComposerBanner({
  variant,
  onUnblock,
  isUnblocking = false,
}: BlockedComposerBannerProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-5 text-center">
      <Typography variant="span" className="text-sm text-muted">
        {variant === "blocked_by_me"
          ? t("label-blocked-by-me")
          : t("label-blocked-by-peer")}
      </Typography>
      {variant === "blocked_by_me" && onUnblock ? (
        <Button
          type="button"
          color="primary"
          fullWidth={false}
          disabled={isUnblocking}
          onClick={onUnblock}
        >
          {t("label-unblock")}
        </Button>
      ) : null}
    </div>
  );
}
