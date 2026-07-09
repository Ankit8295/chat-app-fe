"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ROUTES } from "../../routes.config";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      <h2>{t("label-not-found")}</h2>
      <p>{t("label-not-found-description")}</p>
      <Link href={ROUTES.HOME}>
        <button>{t("label-return-home")}</button>
      </Link>
    </div>
  );
}
