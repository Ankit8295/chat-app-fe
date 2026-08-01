import * as z from "zod";

type Translate = (key: string) => string;

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
