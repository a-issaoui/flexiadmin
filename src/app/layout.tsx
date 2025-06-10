// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { ThemeProvider } from "@/providers/theme-provider";
import NextTopLoader from 'nextjs-toploader';
import { getUserLocale } from "@/store/locale-store";
import "./globals.css";
import React from "react";

interface RootLayoutProps {
    children: React.ReactNode;
}

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FlexiAdmin",
    description: "Modern admin dashboard with internationalization",
};

export default async function RootLayout({ children }: RootLayoutProps) {
    // Get locale and direction from next-intl (configured in request.ts)
    const locale = await getLocale();
    const messages = await getMessages();

    // Get direction from our locale store for the html dir attribute
    const { dir } = await getUserLocale();

    return (
        <html lang={locale} dir={dir} suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <NextTopLoader
                showSpinner={false}
                color="#2563eb"
                height={3}
            />
            <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
            </NextIntlClientProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}