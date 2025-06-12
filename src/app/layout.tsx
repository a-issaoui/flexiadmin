import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from "@/providers/theme-provider";
import NextTopLoader from 'nextjs-toploader';
import { getUserLocale } from "@/store/locale-store";
import "./globals.css";
import React from "react";

interface RootLayoutProps {
    children: React.ReactNode;
}

// Optimized font loading with display swap
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
    preload: false, // Only preload main font
});

// Enhanced metadata
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
        index: false, // Admin dashboard shouldn't be indexed
        follow: false,
    },
};

// Viewport configuration
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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="flexiadmin-theme"
        >
            <NextTopLoader
                showSpinner={false}
                color="hsl(var(--primary))"
                height={3}
                speed={200}
                shadow="0 0 10px hsl(var(--primary)),0 0 5px hsl(var(--primary))"
                template='<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            />
            <NextIntlClientProvider locale={lang} messages={messages} key={lang}>
                {children}
            </NextIntlClientProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}