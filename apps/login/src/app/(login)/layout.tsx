import "@/styles/globals.scss";

import {LanguageProvider} from "@/components/language-provider";
import {LanguageSwitcher} from "@/components/language-switcher";
import {Skeleton} from "@/components/skeleton";
import {Theme} from "@/components/theme";
import {ThemeProvider} from "@/components/theme-provider";
import {Analytics} from "@vercel/analytics/react";
import {Lato} from "next/font/google";
import {ReactNode, Suspense} from "react";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";

const lato = Lato({
    weight: ["400", "700", "900"],
    subsets: ["latin"],
});

export default async function RootLayout({
                                             children,
                                         }: {
    children: ReactNode;
}) {
    return (
        <html className={`${lato.className}`} suppressHydrationWarning>
        <head/>
        <body>
            <ThemeProvider>
                <Suspense
                    fallback={
                        <div
                            className={`relative min-h-[90%] bg-background-light-600 flex flex-col justify-center`}
                        >
                            
                        </div>
                    }
                >
                    <LanguageProvider>
                        <div
                            className={`relative  bg-background-light-100 flex flex-col justify-center items-center`}
                        >
                            <div className="min-w-[80%] p-1 rounded-xl shadow-xl">
                                <div className="flex gap-2">
                                    <BrandLogo/>
                                    <div className='basis-[25%]'>
                                        {children}
                                    </div>
                                </div>
                                {/*<div className="flex flex-row justify-end py-4 items-center space-x-4">
                    <LanguageSwitcher />
                    <Theme />
                  </div>*/}
                            </div>
                        </div>
                    </LanguageProvider>
                </Suspense>
            </ThemeProvider>
        <Analytics/>
        </body>
        </html>
    );
}
