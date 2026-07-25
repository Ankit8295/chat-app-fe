"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
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
      <button onClick={() => reset()}>{t("try-again")}</button>
    </div>
  );
}
