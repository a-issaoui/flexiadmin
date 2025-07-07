// src/components/language-selector.tsx
"use client";

import React, { useTransition, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useLocaleStore } from "@/stores/locale.store";
import {
    SUPPORTED_LOCALES,
    isSupportedLocale,
    type LocaleCode,
} from "@/config/locales.config";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface LocaleSwitcherProps {
    className?: string;
}

export default function LanguageSelector({ className }: LocaleSwitcherProps) {
    const { locale: currentLocale, direction, setLocale, isHydrated, isLoading } = useLocaleStore();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);

    const isDisabled = isPending || isLoading;

    const handleLocaleChange = (value: string) => {
        if (!isSupportedLocale(value) || value === currentLocale || isDisabled) return;

        startTransition(() => {
            try {
                setLocale(value as LocaleCode);
                setIsOpen(false);
            } catch (error) {
                console.error("Failed to set user locale:", error);
            }
        });
    };

    // Show skeleton until hydrated
    if (!isHydrated) {
        return (
            <Skeleton
                aria-hidden
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center"
            />
        );
    }

    const currentLocaleConfig = SUPPORTED_LOCALES.find((l) => l.code === currentLocale);

    return (
        <div className="relative w-10 h-10 flex items-center justify-center">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={isDisabled}
                        className={cn(
                            "rounded-full cursor-pointer w-10 h-10 transition-all duration-200",
                            "focus:outline-none focus-visible:ring-0 focus:ring-0",
                            isOpen && "bg-accent",
                            isDisabled && "opacity-50",
                            className
                        )}
                        aria-label={`Change language. Current: ${currentLocaleConfig?.name || currentLocale}`}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <span className="flex items-center justify-center text-[18px] w-7 h-7">
                                {currentLocaleConfig?.flag || "🌐"}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side="bottom"
                    align="end"

                    className="w-42 p-1"

                >
                    {SUPPORTED_LOCALES.map((locale) => {
                        const isCurrentLocale = locale.code === currentLocale;
                        const isItemDisabled = isCurrentLocale || isDisabled;

                        return (
                            <DropdownMenuItem
                                key={locale.code}
                                onClick={() => handleLocaleChange(locale.code)}
                                disabled={isItemDisabled}
                                className={cn(
                                    "cursor-pointer transition-colors duration-150",
                                    isCurrentLocale && "bg-accent",
                                    isItemDisabled && "opacity-50"
                                )}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <span className="text-lg" role="img" aria-label={`${locale.name} flag`}>
                                        {locale.flag}
                                    </span>
                                    <div className="flex flex-col flex-1">
                                        <span className="font-medium">{locale.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {locale.nativeName}
                                        </span>
                                    </div>
                                    {isCurrentLocale && (
                                        <Check className="h-4 w-4 text-primary" aria-label="Currently selected" />
                                    )}
                                </div>
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}