"use client";
import { ApiFormError, login } from "@/lib/queries/auth/api";
import {
  createLoginFormSchema,
  LoginFormState,
} from "@/lib/queries/auth/validations";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import CustomInput from "@/components/ui/inputs/input";
import PasswordInput from "@/components/ui/inputs/password-input";
import Button from "@/components/ui/buttons/button";
import Typography from "@/components/ui/typography/typography";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const [state, setState] = useState<LoginFormState>();
  const loginFormSchema = useMemo(() => createLoginFormSchema(t), [t]);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
    onError: (error: ApiFormError) => {
      setState({
        message: error.message,
        errors: error.fieldErrors,
      });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const validatedFields = loginFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      setState({
        errors: validatedFields.error.flatten().fieldErrors,
      });
      return;
    }

    setState(undefined);
    loginMutation.mutate(validatedFields.data);
  }

  const errorMessage =
    state?.message && (t.has(state.message) ? t(state.message) : state.message);

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full flex-col gap-5 p-5"
    >
      <div className="text-center">
        <Typography variant="h1">{t("label-login-form-title")}</Typography>
        <Typography variant="p" className="mt-2 text-muted">
          {t("label-login-form-description")}
        </Typography>
      </div>

      <CustomInput
        name="email"
        type="email"
        label={t("label-email")}
        placeholder={t("label-email-placeholder")}
        variant="bordered"
        error={state?.errors?.email?.[0]}
      />

      <PasswordInput
        name="password"
        label={t("label-password")}
        placeholder={t("label-password-placeholder")}
        error={state?.errors?.password?.[0]}
      />

      {state?.errors?.password && state.errors.password.length > 1 && (
        <div className="text-sm text-(--color-error-text)">
          <Typography variant="span">{t("label-password-must")}</Typography>
          <ul className="mt-1 list-inside list-disc">
            {state.errors.password.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {errorMessage && (
        <Typography variant="span" className="text-destructive">
          {errorMessage}
        </Typography>
      )}

      <Button type="submit" color="primary" disabled={loginMutation.isPending}>
        {t("label-login")}
      </Button>
    </form>
  );
}
