'use client';
import React, { useState } from 'react';
import { Check, Globe, RotateCcw, Languages } from 'lucide-react';
import { useLocaleStore } from '@/stores/locale.store';
import {
    localesConfig,
    isValidLocaleCode,
    type LocaleCode,
} from '@/config/locales.config';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/i18n/useTranslations';

interface LanguageSelectorProps {
    className?: string;
    variant?: 'icon' | 'button' | 'compact' | 'full';
    showDirectionToggle?: boolean;
    showReset?: boolean;
}

export default function AdminLanguageSelector({
                                                  className,
                                                  variant = 'icon',
                                                  showDirectionToggle = true,
                                                  showReset = false
                                              }: LanguageSelectorProps) {
    const t = useTranslations('common');
    const {
        lang,
        dir,
        config,
        setLocale,
        setDirection,
        resetLocale,
        _hydrated
    } = useLocaleStore();

    const [isOpen, setIsOpen] = useState(false);

    const handleLocaleChange = (newLocale: LocaleCode) => {
        if (!isValidLocaleCode(newLocale) || newLocale === lang) return;
        setIsOpen(false);
        setLocale(newLocale); // ✨ Instant change!
    };

    const handleDirectionToggle = () => {
        setDirection(dir === 'ltr' ? 'rtl' : 'ltr');
    };

    const handleReset = () => {
        resetLocale();
    };

    if (!_hydrated) {
        return <Skeleton className="w-10 h-10 rounded-full animate-pulse" />;
    }

    // Compact variant for tight spaces
    if (variant === 'compact') {
        return (
            <select
                value={lang}
                onChange={(e) => handleLocaleChange(e.target.value as LocaleCode)}
                className={cn(
                    "px-2 py-1 text-sm bg-background border rounded focus:ring-2 focus:ring-primary",
                    dir === 'rtl' && "text-right",
                    className
                )}
                title={t('language')}
            >
                {localesConfig.map((locale) => (
                    <option key={locale.code} value={locale.code}>
                        {locale.flag} {locale.code.toUpperCase()}
                    </option>
                ))}
            </select>
        );
    }

    // Full variant with labels
    if (variant === 'full') {
        return (
            <div className={cn("flex items-center gap-3", className)}>
                <Languages className="h-4 w-4 text-muted-foreground" />
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "justify-between gap-3 min-w-[140px]",
                                dir === 'rtl' && "flex-row-reverse"
                            )}
                        >
                            <div className={cn(
                                "flex items-center gap-2",
                                dir === 'rtl' && "flex-row-reverse"
                            )}>
                                <span className="text-lg">{config.flag}</span>
                                <span className="font-medium">{config.nativeName}</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-56">
                        <DropdownMenuLabel>{t('selectLanguage')}</DropdownMenuLabel>
                        {localesConfig.map((locale) => (
                            <DropdownMenuItem
                                key={locale.code}
                                onClick={() => handleLocaleChange(locale.code)}
                                className="cursor-pointer"
                            >
                                <LocaleMenuItem
                                    locale={locale}
                                    isSelected={locale.code === lang}
                                    dir={dir}
                                />
                            </DropdownMenuItem>
                        ))}

                        {(showDirectionToggle || showReset) && (
                            <>
                                <DropdownMenuSeparator />
                                {showDirectionToggle && (
                                    <DropdownMenuItem onClick={handleDirectionToggle} className="cursor-pointer">
                                        <div className={cn(
                                            "flex items-center gap-3 w-full",
                                            dir === 'rtl' && "flex-row-reverse"
                                        )}>
                                            <RotateCcw className="h-4 w-4" />
                                            <span>{t('toggleDirection')}: {dir.toUpperCase()}</span>
                                        </div>
                                    </DropdownMenuItem>
                                )}
                                {showReset && (
                                    <DropdownMenuItem onClick={handleReset} className="cursor-pointer text-muted-foreground">
                                        <div className={cn(
                                            "flex items-center gap-3 w-full",
                                            dir === 'rtl' && "flex-row-reverse"
                                        )}>
                                            <Globe className="h-4 w-4" />
                                            <span>{t('resetToDefault')}</span>
                                        </div>
                                    </DropdownMenuItem>
                                )}
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    // Button variant
    if (variant === 'button') {
        return (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            "gap-2",
                            dir === 'rtl' && "flex-row-reverse",
                            className
                        )}
                    >
                        <span className="text-lg">{config.flag}</span>
                        <span className="hidden sm:inline">{config.nativeName}</span>
                        <span className="sm:hidden">{lang.toUpperCase()}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-48">
                    <DropdownMenuLabel>{t('selectLanguage')}</DropdownMenuLabel>
                    {localesConfig.map((locale) => (
                        <DropdownMenuItem
                            key={locale.code}
                            onClick={() => handleLocaleChange(locale.code)}
                            className="cursor-pointer"
                        >
                            <LocaleMenuItem
                                locale={locale}
                                isSelected={locale.code === lang}
                                dir={dir}
                            />
                        </DropdownMenuItem>
                    ))}

                    {showDirectionToggle && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleDirectionToggle} className="cursor-pointer">
                                <div className={cn(
                                    "flex items-center gap-3 w-full",
                                    dir === 'rtl' && "flex-row-reverse"
                                )}>
                                    <RotateCcw className="h-4 w-4" />
                                    <span>{t('toggleDirection')}</span>
                                </div>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    // Default icon variant
    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "rounded-full w-9 h-9 relative hover:bg-accent",
                        className
                    )}
                    title={`${t('currentLanguage')}: ${config.nativeName}`}
                >
                    <span className="text-lg">{config.flag}</span>
                    {dir === 'rtl' && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full flex items-center justify-center text-[8px] text-primary-foreground font-bold">
              ر
            </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-52">
                <DropdownMenuLabel>{t('selectLanguage')}</DropdownMenuLabel>
                {localesConfig.map((locale) => (
                    <DropdownMenuItem
                        key={locale.code}
                        onClick={() => handleLocaleChange(locale.code)}
                        className="cursor-pointer"
                    >
                        <LocaleMenuItem
                            locale={locale}
                            isSelected={locale.code === lang}
                            dir={dir}
                        />
                    </DropdownMenuItem>
                ))}

                {showDirectionToggle && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleDirectionToggle} className="cursor-pointer">
                            <div className={cn(
                                "flex items-center gap-3 w-full",
                                dir === 'rtl' && "flex-row-reverse"
                            )}>
                                <RotateCcw className="h-4 w-4" />
                                <div className="flex flex-col flex-1">
                                    <span className="font-medium">{t('toggleDirection')}</span>
                                    <span className="text-xs text-muted-foreground">
                    {t('current')}: {dir.toUpperCase()}
                  </span>
                                </div>
                            </div>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// LocaleMenuItem component
interface LocaleMenuItemProps {
    locale: typeof localesConfig[number];
    isSelected: boolean;
    dir: 'ltr' | 'rtl';
}

function LocaleMenuItem({ locale, isSelected, dir }: LocaleMenuItemProps) {
    return (
        <div className={cn(
            "flex items-center gap-3 w-full",
            dir === 'rtl' && "flex-row-reverse"
        )}>
            <span className="text-lg">{locale.flag}</span>
            <div className={cn(
                "flex flex-col flex-1",
                dir === 'rtl' && "items-end"
            )}>
                <span className="font-medium">{locale.name}</span>
                <span className="text-xs text-muted-foreground">
          {locale.nativeName}
        </span>
            </div>
            {isSelected && (
                <Check className="h-4 w-4 text-primary" />
            )}
        </div>
    );
}