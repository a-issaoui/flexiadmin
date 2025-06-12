// LocaleSwitcher.tsx
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

export function LocaleSwitcher() {
    const router = useRouter()
    const currentLocale = useLocale() as LocaleCode // next-intl provides current locale
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
            <SelectTrigger className="w-[180px]">
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
                        <SelectItem key={locale.code} value={locale.code}>
                            <div className="flex items-center gap-2">
                                <span>{locale.flag}</span>
                                <span>{locale.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}