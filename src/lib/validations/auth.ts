import * as z from "zod";

type Translate = (key: string) => string;

export const createRegisterFormSchema = (t: Translate) =>
  z.object({
    name: z
      .string()
      .min(2, { error: t("validation-name-min") })
      .trim(),
    email: z.email({ error: t("validation-email-invalid") }).trim(),
    password: z
      .string()
      .min(8, { error: t("validation-password-min-length") })
      .regex(/[a-zA-Z]/, { error: t("validation-password-letter") })
      .regex(/[0-9]/, { error: t("validation-password-number") })
      .regex(/[^a-zA-Z0-9]/, {
        error: t("validation-password-special"),
      })
      .trim(),
  });

export const createLoginFormSchema = (t: Translate) =>
  z.object({
    email: z.email({ error: t("validation-email-invalid") }).trim(),
    password: z
      .string()
      .min(8, { error: t("validation-password-min-length") })
      .regex(/[a-zA-Z]/, { error: t("validation-password-letter") })
      .regex(/[0-9]/, { error: t("validation-password-number") })
      .regex(/[^a-zA-Z0-9]/, {
        error: t("validation-password-special"),
      })
      .trim(),
  });

export type RegisterFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export type LoginFormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};
