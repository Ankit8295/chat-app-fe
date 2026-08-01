"use client";

import { useState, useEffect, useRef } from "react";
import { useGetMe } from "@/lib/queries/user/query";
import { useTranslations } from "next-intl";
import Typography from "@/components/ui/typography/typography";
import CustomInput from "@/components/ui/inputs/input";
import Avatar from "@/components/ui/avatar/avatar";
import ActionIcon from "@/components/ui/action-icon";

export default function ProfileTab() {
  const t = useTranslations();
  const {
    data: currentUser,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetMe();

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const aboutInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(currentUser?.name ?? "");
    setAbout(currentUser?.about ?? "");
  }, [currentUser]);

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
      <Avatar
        src={currentUser?.img}
        name={currentUser?.name}
        size="xl"
        shape="circle"
        className="size-28 max-sm:size-24 text-3xl shadow-lg border-2 border-border"
      />

      <div className="w-full flex flex-col gap-7 max-sm:gap-5">
        <CustomInput
          ref={aboutInputRef}
          label={t("label-about")}
          variant="underlined"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          readOnly={!isEditingAbout}
          onClick={() => !isEditingAbout && setIsEditingAbout(true)}
          maxLength={aboutMaxLength}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isEditingAbout) handleSaveAbout();
          }}
          rightContent={
            isEditingAbout ? (
              <CustomInput.RightActions
                charsLeft={aboutCharsLeft}
                onSave={handleSaveAbout}
                saveTitle={t("label-save")}
              />
            ) : (
              <ActionIcon
                name="pencil"
                label={t("label-edit")}
                className="size-8 text-muted hover:bg-transparent hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingAbout(true);
                }}
              />
            )
          }
        />

        <CustomInput
          ref={nameInputRef}
          label={t("label-name")}
          variant="underlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          readOnly={!isEditingName}
          onClick={() => !isEditingName && setIsEditingName(true)}
          maxLength={nameMaxLength}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isEditingName) handleSaveName();
          }}
          rightContent={
            isEditingName ? (
              <CustomInput.RightActions
                charsLeft={nameCharsLeft}
                onSave={handleSaveName}
                saveTitle={t("label-save")}
              />
            ) : (
              <ActionIcon
                name="pencil"
                label={t("label-edit")}
                className="size-8 text-muted hover:bg-transparent hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                }}
              />
            )
          }
          helperText={t("label-name-hint")}
        />
      </div>
    </div>
  );
}
