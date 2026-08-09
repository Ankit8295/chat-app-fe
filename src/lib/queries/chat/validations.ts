import * as z from "zod";

type Translate = (key: string) => string;

export const GROUP_NAME_MAX = 50;
export const GROUP_ABOUT_MAX = 200;

export const createUpdateGroupNameSchema = (t: Translate) =>
  z
    .string()
    .trim()
    .min(2, { error: t("validation-group-name-min") })
    .max(GROUP_NAME_MAX, { error: t("validation-group-name-max") });

export const createUpdateGroupAboutSchema = (t: Translate) =>
  z
    .string()
    .trim()
    .max(GROUP_ABOUT_MAX, { error: t("validation-group-about-max") });
