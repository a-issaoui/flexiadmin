// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from "@/providers/theme-provider";
import TopLoader from "@/components/shared/top-loader";
import { getUserLocale } from "@/store/locale-store";

import "./globals.css";
import React from "react";

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
    title: {
        default: "FlexiAdmin",
        template: "%s | FlexiAdmin",
    },
    description: "Modern admin dashboard with internationalization support",
    keywords: ["admin", "dashboard", "next.js", "react", "tailwind", "i18n"],
    authors: [{ name: "FlexiAdmin Team" }],
    creator: "FlexiAdmin",
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3180'),
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        title: "FlexiAdmin",
        description: "Modern admin dashboard with internationalization support",
        siteName: "FlexiAdmin",
    },
    twitter: {
        card: "summary_large_image",
        title: "FlexiAdmin",
        description: "Modern admin dashboard with internationalization support",
    },
    robots: {
        index: false,
        follow: false,
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
    ],
};

export default async function RootLayout({ children }: RootLayoutProps) {
    const { lang, dir } = await getUserLocale();
    const messages = await getMessages();

    return (
        <html lang={lang} dir={dir} suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <TopLoader />
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="flexiadmin-theme"
        >
            <NextIntlClientProvider locale={lang} messages={messages} key={lang}>
                {children}
            </NextIntlClientProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
