// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from "@/providers/theme-provider";
import ProgressBar from "@/components/common/progress-bar";
import { getLocaleDataSSR } from "@/lib/cookies/locale/locale-cookie.server";
import LocaleHydrator from "@/components/common/hydration/locale-hydrator";

import "./globals.css";

interface RootLayoutProps {
    children: React.ReactNode;
}

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: 'swap',
    preload: true,
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: 'swap',
});

export const metadata: Metadata = {
    // your existing metadata here unchanged
};

export const viewport: Viewport = {
    // your existing viewport here unchanged
};

export default async function RootLayout({ children }: RootLayoutProps) {
    // Get locale data from cookie (includes both locale and direction)
    const { locale, direction } = await getLocaleDataSSR();
    const messages = await getMessages();

    return (
        <html lang={locale} dir={direction} suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <ProgressBar />
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="flexiadmin-theme"
        >
            <NextIntlClientProvider locale={locale} messages={messages}>
                <LocaleHydrator initialLocale={locale} initialDirection={direction} />
                {children}
            </NextIntlClientProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}