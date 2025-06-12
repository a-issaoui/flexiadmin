"use client";

import { useTransition, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Check } from "lucide-react";
import { setUserLocale } from "@/store/locale-store";
import { localesConfig, isValidLocaleCode, type LocaleCode } from "@/lib/config/locales";
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


export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
    const currentLocale = useLocale() as LocaleCode;
    const [isPending, startTransition] = useTransition();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleLocaleChange = (value: string) => {
        if (!isValidLocaleCode(value) || value === currentLocale) return;

        startTransition(async () => {
            try {
                await setUserLocale(value);
            } catch (error) {
                console.error("Failed to set user locale:", error);
            }
        });
    };

    if (!isClient) {
        return <Skeleton className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center" />;
    }

    const currentLocaleConfig = localesConfig.find(l => l.code === currentLocale);

    return (
        <div className="relative w-10 h-10 flex items-center justify-center">
            <div
                className="origin-center" // Ensures scaling happens from center
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={isPending}
                            className={cn(
                                "rounded-full cursor-pointer w-10 h-10 p-0",
                                className
                            )}
                        >
                            <span className="flex items-center justify-center text-[18px] w-7 h-7">
                                {currentLocaleConfig?.flag || "🌐"}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-1">
                        {localesConfig.map((locale) => (
                            <DropdownMenuItem
                                key={locale.code}
                                onClick={() => handleLocaleChange(locale.code)}
                                disabled={locale.code === currentLocale || isPending}
                                className="cursor-pointer"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <span className="text-lg">{locale.flag}</span>
                                    <div className="flex flex-col flex-1">
                                        <span className="font-medium">{locale.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {locale.nativeName}
                                        </span>
                                    </div>
                                    {locale.code === currentLocale && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}