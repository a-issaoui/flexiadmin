"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { setUserLocale } from "@/store/locale-store"
import { localesConfig, isValidLocaleCode, type LocaleCode } from "@/lib/config/locales"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface LocaleSwitcherProps {
    className?: string;
}

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
    const router = useRouter()
    const currentLocale = useLocale() as LocaleCode
    const [isPending, startTransition] = useTransition()

    const handleLocaleChange = async (value: string) => {
        if (!isValidLocaleCode(value) || value === currentLocale) {
            return
        }

        try {
            await setUserLocale(value)
            startTransition(() => {
                router.refresh()
            })
        } catch (error) {
            console.error("Failed to set user locale:", error)
        }
    }

    const currentLocaleConfig = localesConfig.find(l => l.code === currentLocale)

    return (
        <Select
            value={currentLocale}
            onValueChange={handleLocaleChange}
            disabled={isPending}
        >
            <SelectTrigger className={cn("w-[180px]", className)}>
                <SelectValue>
                    {currentLocaleConfig && (
                        <div className="flex items-center gap-2">
                            <span>{currentLocaleConfig.flag}</span>
                            <span>{currentLocaleConfig.name}</span>
                        </div>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {localesConfig.map((locale) => (
                        <SelectItem
                            key={locale.code}
                            value={locale.code}
                            disabled={locale.code === currentLocale}
                        >
                            <div className="flex items-center gap-2">
                                <span>{locale.flag}</span>
                                <div className="flex flex-col">
                                    <span>{locale.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {locale.nativeName}
                                    </span>
                                </div>
                                {locale.code === currentLocale && (
                                    <Check className="h-4 w-4 ml-auto" />
                                )}
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}