"use client";

import React from "react";
import { useGetMe } from "@/lib/queries/user/query";
import { useTranslations } from "next-intl";
import { getInitials } from "@/utils/string";
import Typography from "@/components/ui/typography/typography";
import CustomInput from "@/components/ui/inputs/input";

export default function ProfileTab() {
  const t = useTranslations();
  const { data: currentUser, isLoading: isProfileLoading, error: profileError } = useGetMe();

  const profileInitials = currentUser?.name ? getInitials(currentUser.name) : "?";

  if (isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 my-auto">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <Typography variant="span" className="text-muted">
          {t("label-loading-profile")}
        </Typography>
      </div>
    );
  }

  if (profileError) {
    return (
      <Typography variant="p" className="text-destructive font-medium my-auto text-center">
        {t("something-went-wrong")}
      </Typography>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 max-sm:gap-4 max-sm:mt-2">
      {/* Large Initial Circle */}
      <div className="flex size-24 items-center justify-center rounded-full bg-primary/20 border-2 border-primary text-2xl font-bold text-primary shadow-inner shrink-0 max-sm:size-20">
        {currentUser?.img ? (
          <img
            src={currentUser.img}
            alt={currentUser.name}
            className="size-full rounded-full object-cover"
          />
        ) : (
          profileInitials
        )}
      </div>

      {/* Profile Form Details */}
      <div className="w-full flex flex-col gap-4 max-sm:gap-3">
        <Typography variant="h4" className="text-center font-bold text-foreground max-sm:text-base">
          {t("label-profile-details")}
        </Typography>

        <CustomInput
          label={t("label-name")}
          value={currentUser?.name}
          readOnly
          variant="bordered"
          classNames={{ inputWrapper: "bg-secondary/40 border-border cursor-not-allowed" }}
        />

        <CustomInput
          label={t("label-email")}
          value={currentUser?.email}
          readOnly
          variant="bordered"
          classNames={{ inputWrapper: "bg-secondary/40 border-border cursor-not-allowed" }}
        />
      </div>
    </div>
  );
}
