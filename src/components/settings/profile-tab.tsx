"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useGetMe, useUpdateMe } from "@/lib/queries/user/query";
import {
  createUpdateProfileAboutSchema,
  createUpdateProfileNameSchema,
  PROFILE_ABOUT_MAX,
  PROFILE_NAME_MAX,
} from "@/lib/queries/user/validations";
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
  const updateMe = useUpdateMe();

  const nameSchema = useMemo(() => createUpdateProfileNameSchema(t), [t]);
  const aboutSchema = useMemo(() => createUpdateProfileAboutSchema(t), [t]);

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [nameError, setNameError] = useState<string>();
  const [aboutError, setAboutError] = useState<string>();
  const [saveError, setSaveError] = useState<string>();

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
    const parsed = nameSchema.safeParse(name);
    if (!parsed.success) {
      setNameError(parsed.error.issues[0]?.message);
      return;
    }

    setNameError(undefined);
    setSaveError(undefined);

    if (parsed.data === currentUser?.name) {
      setIsEditingName(false);
      return;
    }

    updateMe.mutate(
      { name: parsed.data },
      {
        onSuccess: () => {
          setIsEditingName(false);
        },
        onError: () => {
          setSaveError(t("error-update-profile-failed"));
        },
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
    if (nextAbout === (currentUser?.about ?? "")) {
      setIsEditingAbout(false);
      return;
    }

    updateMe.mutate(
      { about: nextAbout },
      {
        onSuccess: () => {
          setIsEditingAbout(false);
        },
        onError: () => {
          setSaveError(t("error-update-profile-failed"));
        },
      },
    );
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

  const nameCharsLeft = PROFILE_NAME_MAX - name.length;
  const aboutCharsLeft = PROFILE_ABOUT_MAX - about.length;
  const isSaving = updateMe.isPending;

  return (
    <div className="w-full flex flex-col items-center gap-8 max-sm:gap-6 py-2">
      <Avatar
        src={currentUser?.image ?? currentUser?.img}
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
          onChange={(e) => {
            setAbout(e.target.value);
            setAboutError(undefined);
            setSaveError(undefined);
          }}
          readOnly={!isEditingAbout}
          disabled={isSaving && isEditingAbout}
          onClick={() => !isEditingAbout && !isSaving && setIsEditingAbout(true)}
          maxLength={PROFILE_ABOUT_MAX}
          error={aboutError}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isEditingAbout && !isSaving) handleSaveAbout();
          }}
          rightContent={
            isEditingAbout ? (
              <CustomInput.RightActions
                charsLeft={aboutCharsLeft}
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

        <CustomInput
          ref={nameInputRef}
          label={t("label-name")}
          variant="underlined"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(undefined);
            setSaveError(undefined);
          }}
          readOnly={!isEditingName}
          disabled={isSaving && isEditingName}
          onClick={() => !isEditingName && !isSaving && setIsEditingName(true)}
          maxLength={PROFILE_NAME_MAX}
          error={nameError}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isEditingName && !isSaving) handleSaveName();
          }}
          rightContent={
            isEditingName ? (
              <CustomInput.RightActions
                charsLeft={nameCharsLeft}
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
          helperText={t("label-name-hint")}
        />

        {saveError && (
          <Typography variant="span" className="text-destructive text-center">
            {saveError}
          </Typography>
        )}
      </div>
    </div>
  );
}
