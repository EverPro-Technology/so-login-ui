"use client";

import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {Button, ButtonSizes, ButtonVariants} from "./button";

interface BackButtonProps {
  text?: string
}

export function BackButton({ text= "Back" }: BackButtonProps) {
  const t = useTranslations("common");
  const router = useRouter();
  
  return (
    <Button
      onClick={() => router.back()}
      type="button"
      variant={ButtonVariants.Secondary}
      size={ButtonSizes.Medium}
    >
      {text ? text : t("back") }
    </Button>
  );
}
