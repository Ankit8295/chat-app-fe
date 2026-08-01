"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import Button from "@/components/ui/buttons/button";
import Typography from "@/components/ui/typography/typography";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <Typography variant="h2">{t("something-went-wrong")}</Typography>
      <Button type="button" variant="text" onClick={() => reset()}>
        {t("try-again")}
      </Button>
    </div>
  );
}
