"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

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
      <h2>{t("something-went-wrong")}</h2>
      <button onClick={() => reset()}>{t("try-again")}</button>
    </div>
  );
}
