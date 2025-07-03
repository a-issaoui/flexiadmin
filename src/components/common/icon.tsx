// src/components/common/icon.tsx

"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import type { IconProps as PhosphorIconProps } from "@phosphor-icons/react"

// Import all the icons your navigation configurations use
import {
    // Core UI Icons
    HouseIcon,
    MagnifyingGlassIcon,
    GearIcon,
    UserIcon,
    UsersIcon,
    UserCircleIcon,

    // Navigation Icons
    CaretUpIcon,
    CaretDownIcon,
    CaretLeftIcon,
    CaretRightIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowLineRightIcon,

    // Action Icons
    PlusIcon,
    MinusIcon,
    XIcon,
    CheckIcon,
    TrashIcon,
    PencilSimpleIcon,
    DownloadIcon,
    UploadIcon,

    // Status Icons
    WarningIcon,
    InfoIcon,
    CheckCircleIcon,
    XCircleIcon,
    QuestionMarkIcon,

    // Communication Icons
    BellIcon,
    EnvelopeIcon,
    ChatCircleIcon,

    // Data Icons
    CalendarIcon,
    ClockIcon,
    FolderIcon,
    FileIcon,

    // Utility Icons
    MoonIcon,
    SunIcon,
    DotsThreeOutlineIcon,
    ListIcon,
    CircleNotchIcon,
    QuestionIcon,
    SignOutIcon,
    ShieldIcon,
    LockIcon,
    DetectiveIcon,
    ListChecksIcon,
    WindowsLogoIcon,
    TrashSimpleIcon,
    ProhibitIcon,

    // New icons for enhanced navigation
    BookIcon,
    ChartBarIcon,
    StarIcon,
    TableIcon,
    DatabaseIcon,
    ArrowCounterClockwiseIcon,
    SpeakerNoneIcon,
    TrendUpIcon,
    CalculatorIcon,

    // Additional icons that might be needed
    ArrowClockwiseIcon,
} from "@phosphor-icons/react"

// Enhanced icon registry with all the icons used in navigation
const iconRegistry = {
    // Existing icons
    HouseIcon,
    MagnifyingGlassIcon,
    GearIcon,
    UserIcon,
    UsersIcon,
    UserCircleIcon,
    CaretUpIcon,
    CaretDownIcon,
    CaretLeftIcon,
    CaretRightIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowLineRightIcon,
    PlusIcon,
    MinusIcon,
    XIcon,
    CheckIcon,
    TrashIcon,
    PencilSimpleIcon,
    WarningIcon,
    InfoIcon,
    CheckCircleIcon,
    XCircleIcon,
    QuestionMarkIcon,
    BellIcon,
    EnvelopeIcon,
    ChatCircleIcon,
    CalendarIcon,
    ClockIcon,
    FolderIcon,
    FileIcon,
    DownloadIcon,
    UploadIcon,
    DotsThreeOutlineIcon,
    ListIcon,
    CircleNotchIcon,
    QuestionIcon,
    SignOutIcon,
    ShieldIcon,
    LockIcon,
    DetectiveIcon,
    ListChecksIcon,
    WindowsLogoIcon,
    ProhibitIcon,
    MoonIcon,
    SunIcon,
    TrashSimpleIcon,

    // Enhanced navigation icons
    BookIcon,
    ChartBarIcon,
    StarIcon,
    TableIcon,
    DatabaseIcon,
    ArrowCounterClockwiseIcon,
    SpeakerNoneIcon,
    TrendUpIcon,
    CalculatorIcon,

    // Additional icons that might be needed
    ArrowClockwiseIcon,
} as const

// Export the enhanced type for use in other components
export type IconName = keyof typeof iconRegistry

// Enhanced props interface
export interface IconProps extends Omit<PhosphorIconProps, 'ref'> {
    name: IconName
    className?: string
}

// Enhanced Icon component with better error handling
export const Icon = forwardRef<SVGSVGElement, IconProps>(({
                                                              name,
                                                              size = 20,
                                                              weight = "regular",
                                                              color = "currentColor",
                                                              className,
                                                              mirrored = false,
                                                              ...props
                                                          }, ref) => {
    const IconComponent = iconRegistry[name]

    // Enhanced development error messages
    if (!IconComponent) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(
                `Icon "${name}" not found in registry.\n` +
                `Available icons: ${Object.keys(iconRegistry).join(', ')}\n` +
                `To add a new icon, import it from @phosphor-icons/react and add it to the iconRegistry.`
            )
        }
        const FallbackIcon = iconRegistry.QuestionIcon
        return (
            <FallbackIcon
                ref={ref}
                size={size}
                weight={weight}
                color={color}
                mirrored={mirrored}
                className={cn("inline-flex shrink-0", className)}
                {...props}
            />
        )
    }

    return (
        <IconComponent
            ref={ref}
            size={size}
            weight={weight}
            color={color}
            mirrored={mirrored}
            className={cn("inline-flex shrink-0", className)}
            {...props}
        />
    )
})

Icon.displayName = "Icon"