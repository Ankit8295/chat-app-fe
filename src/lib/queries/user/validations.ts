import * as z from "zod";

type Translate = (key: string) => string;

export const PROFILE_NAME_MAX = 80;
export const PROFILE_ABOUT_MAX = 160;
export const PROFILE_AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const PROFILE_AVATAR_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const createGroupFormSchema = (t: Translate) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, { error: t("validation-group-name-min") })
      .max(50, { error: t("validation-group-name-max") }),
    about: z
      .string()
      .trim()
      .max(200, { error: t("validation-group-about-max") }),
    participantIds: z
      .array(z.string())
      .min(1, { error: t("validation-group-participants-min") }),
  });

export type CreateGroupFormValues = z.infer<
  ReturnType<typeof createGroupFormSchema>
>;

export const createUpdateProfileNameSchema = (t: Translate) =>
  z
    .string()
    .trim()
    .min(2, { error: t("validation-name-min") })
    .max(PROFILE_NAME_MAX, { error: t("validation-profile-name-max") });

export const createUpdateProfileAboutSchema = (t: Translate) =>
  z
    .string()
    .trim()
    .max(PROFILE_ABOUT_MAX, { error: t("validation-profile-about-max") });

export const createAvatarFileSchema = (t: Translate) =>
  z
    .instanceof(File, { error: t("error-avatar-invalid-type") })
    .refine(
      (file) =>
        PROFILE_AVATAR_CONTENT_TYPES.includes(
          file.type as (typeof PROFILE_AVATAR_CONTENT_TYPES)[number],
        ),
      { error: t("error-avatar-invalid-type") },
    )
    .refine((file) => file.size <= PROFILE_AVATAR_MAX_BYTES, {
      error: t("error-avatar-too-large"),
    });
