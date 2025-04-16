"use client";

import { Logo } from "@/components/logo";
import { BrandingSettings } from "@zitadel/proto/zitadel/settings/v2/branding_settings_pb";
import { ReactNode } from "react";
import { ThemeWrapper } from "./theme-wrapper";
import Image from "next/image";

export function DynamicTheme({
  branding,
  children,
}: {
  children: ReactNode;
  branding?: BrandingSettings;
}) {
  return (
    <ThemeWrapper branding={branding}>
      <div className="flex flex-col min-h-[99vh] justify-center bg-background-light-500 dark:bg-background-dark-500 px-8 py-12 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            {branding && (
              <Logo
                lightSrc={branding.lightTheme?.logoUrl || '/logo/everpro-logo.svg'}
                darkSrc={branding.darkTheme?.logoUrl || '/logo/everpro-logo.svg'}
                height={150}
                width={150}
              />
            )}
          </div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    </ThemeWrapper>
  );
}
