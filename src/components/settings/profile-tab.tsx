"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGetMe } from "@/lib/queries/user/query";
import { useTranslations } from "next-intl";
import { getInitials } from "@/utils/string";
import Typography from "@/components/ui/typography/typography";
import CustomInput from "@/components/ui/inputs/input";
import PencilIcon from "@/icons/pencil";
import CheckIcon from "@/icons/check";

export default function ProfileTab() {
  const t = useTranslations();
  const {
    data: currentUser,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetMe();

  const profileInitials = currentUser?.name
    ? getInitials(currentUser.name)
    : "?";

  // Editable states
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const aboutInputRef = useRef<HTMLInputElement>(null);

  // Sync state with currentUser when fetched
  useEffect(() => {
    setName(currentUser?.name ?? "");
    setAbout(currentUser?.about ?? "");
  }, [currentUser]);

  // Focus input when editing starts
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
    setIsEditingName(false);
  };

  const handleSaveAbout = () => {
    setIsEditingAbout(false);
  };

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
      <Typography
        variant="p"
        className="text-destructive font-medium my-auto text-center"
      >
        {t("something-went-wrong")}
      </Typography>
    );
  }

  const nameMaxLength = 25;
  const aboutMaxLength = 100;

  const nameCharsLeft = nameMaxLength - name.length;
  const aboutCharsLeft = aboutMaxLength - about.length;

  return (
    <div className="w-full flex flex-col items-center gap-8 max-sm:gap-6 py-2">
      {/* Profile Picture */}
      <div className="flex size-28 items-center justify-center rounded-full bg-secondary border-2 border-border text-3xl font-bold text-foreground shadow-lg shrink-0 max-sm:size-24 overflow-hidden relative group">
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

      {/* Profile Sections Container */}
      <div className="w-full flex flex-col gap-7 max-sm:gap-5">
        {/* About Section */}
        <div className="w-full flex flex-col gap-1.5 relative">
          <Typography
            variant="span"
            className="text-xs font-semibold text-muted tracking-wide"
          >
            {t("label-about")}
          </Typography>

          {isEditingAbout ? (
            <div className="relative w-full">
              <CustomInput
                ref={aboutInputRef}
                variant="underlined"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                maxLength={aboutMaxLength}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveAbout();
                }}
                rightContent={
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted font-medium select-none">
                      {aboutCharsLeft}
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveAbout}
                      className="text-foreground hover:text-primary transition-colors cursor-pointer outline-none"
                      title={t("label-save")}
                    >
                      <CheckIcon className="size-5" />
                    </button>
                  </div>
                }
              />
            </div>
          ) : (
            <div
              onClick={() => setIsEditingAbout(true)}
              className="flex items-center justify-between group cursor-pointer py-1 border-b border-transparent hover:border-border transition-colors min-h-8"
            >
              <Typography
                variant="p"
                className="text-base font-medium text-foreground truncate pr-2 min-h-6"
              >
                {about}
              </Typography>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingAbout(true);
                }}
                className="text-muted group-hover:text-foreground transition-colors cursor-pointer outline-none shrink-0"
                title={t("label-edit")}
              >
                <PencilIcon className="size-5" />
              </button>
            </div>
          )}
        </div>

        {/* Name Section */}
        <div className="w-full flex flex-col gap-1.5 relative">
          <Typography
            variant="span"
            className="text-xs font-semibold text-muted tracking-wide"
          >
            {t("label-name")}
          </Typography>

          {isEditingName ? (
            <div className="relative w-full">
              <CustomInput
                ref={nameInputRef}
                variant="underlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={nameMaxLength}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                }}
                rightContent={
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted font-medium select-none">
                      {nameCharsLeft}
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveName}
                      className="text-foreground hover:text-primary transition-colors cursor-pointer outline-none"
                      title={t("label-save")}
                    >
                      <CheckIcon className="size-5" />
                    </button>
                  </div>
                }
              />
            </div>
          ) : (
            <div
              onClick={() => setIsEditingName(true)}
              className="flex items-center justify-between group cursor-pointer py-1 border-b border-transparent hover:border-border transition-colors min-h-8"
            >
              <Typography
                variant="p"
                className="text-base font-medium text-foreground truncate pr-2 min-h-6"
              >
                {name}
              </Typography>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                }}
                className="text-muted group-hover:text-foreground transition-colors cursor-pointer outline-none shrink-0"
                title={t("label-edit")}
              >
                <PencilIcon className="size-5" />
              </button>
            </div>
          )}

          <Typography
            variant="p"
            className="text-xs text-muted mt-0.5 leading-relaxed"
          >
            {t("label-name-hint")}
          </Typography>
        </div>
      </div>
    </div>
  );
}
