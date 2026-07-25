"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ROUTES } from "../../routes.config";
import Typography from "@/components/ui/typography/typography";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      <Typography variant="h2">{t("label-not-found")}</Typography>
      <Typography variant="p">{t("label-not-found-description")}</Typography>
      <Link href={ROUTES.HOME}>
        <button>{t("label-return-home")}</button>
      </Link>
    </div>
  );
}
