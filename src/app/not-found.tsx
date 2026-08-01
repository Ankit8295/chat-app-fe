"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ROUTES } from "../../routes.config";
import InfoBox from "@/components/ui/info-box";
import Button from "@/components/ui/buttons/button";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <InfoBox
        title={t("label-not-found")}
        description={t("label-not-found-description")}
      >
        <Link href={ROUTES.HOME}>
          <Button variant="flat">{t("label-return-home")}</Button>
        </Link>
      </InfoBox>
    </div>
  );
}
