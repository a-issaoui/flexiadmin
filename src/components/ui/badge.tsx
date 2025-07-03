import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// --- Enhanced Color Utilities (SSR-Safe) ---

const isValidHexColor = (color: string): boolean =>
    /^#[0-9A-Fa-f]{6}$/.test(color);

/**
 * SSR-safe color validation that works in both server and browser environments
 */
const isValidCssColorName = (color: string): boolean => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
        // Server-side: Use a conservative approach with known color names
        const commonCssColors = [
            'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink',
            'black', 'white', 'gray', 'grey', 'brown', 'cyan', 'magenta',
            'lime', 'navy', 'teal', 'silver', 'gold', 'transparent',
            'currentcolor', 'inherit', 'initial', 'unset', 'revert',
            // Add more common colors as needed
            'crimson', 'coral', 'tomato', 'orangered', 'gold', 'khaki',
            'lightgreen', 'darkgreen', 'lightblue', 'darkblue', 'violet'
        ];

        // Also check for CSS function patterns
        const cssFunctionPattern = /^(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\s*\(/i;

        return commonCssColors.includes(color.toLowerCase()) ||
            cssFunctionPattern.test(color) ||
            isValidHexColor(color);
    }

    // Browser-side: Use DOM-based validation for comprehensive checking
    try {
        const testElement = document.createElement('div');
        testElement.style.color = color;
        return testElement.style.color !== '';
    } catch {
        return false;
    }
};

/**
 * Enhanced contrast calculation with better algorithm
 */
const getContrastingTextColor = (hex: string): string => {
    // Remove the hash if present
    const cleanHex = hex.replace('#', '');

    // Parse RGB values
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);

    // Use relative luminance calculation (WCAG standard)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

/**
 * Convert hex color to RGBA with alpha transparency
 */
const hexToRgba = (hex: string, alpha: number): string => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// --- Badge Variants ---

const badgeVariants = cva(
    "inline-flex items-center justify-center gap-1 text-xs font-medium shrink-0 overflow-hidden border transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 whitespace-nowrap rtl:flex-row-reverse [&>svg]:size-2.5",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground",
                outline: "text-foreground border-foreground/50",
                ghost: "border-transparent bg-secondary text-secondary-foreground",
            },
            shape: {
                default: "rounded-md px-1.5 py-0.5",
                square: "rounded-md p-1 min-w-[1.5rem] h-[1.5rem]",
                circular: "rounded-full aspect-square w-5 h-5",
            },
        },
        defaultVariants: {
            variant: "default",
            shape: "default",
        },
    }
);

// --- Badge Component Types ---

export type BadgeVariant = "default" | "outline" | "ghost";
export type BadgeShape = "default" | "square" | "circular";

export type BadgeProps = React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    color?: string;
};

// --- Enhanced Badge Component ---

const Badge = React.memo(function Badge({
                                            className,
                                            variant,
                                            shape,
                                            color,
                                            asChild = false,
                                            style,
                                            ...props
                                        }: BadgeProps) {
    const Comp = asChild ? Slot : "span";

    // Memoize style calculations for performance
    const customStyles = React.useMemo(() => {
        const base = style || {};

        // If no custom color is provided, use default styling
        if (!color) return base;

        const isHex = isValidHexColor(color);
        const isNamed = isValidCssColorName(color);

        // If the color isn't valid, fall back to default styling
        if (!isHex && !isNamed) {
            console.warn(`Invalid color provided to Badge: ${color}`);
            return base;
        }

        // Apply color styling based on variant
        switch (variant) {
            case "outline":
                return {
                    ...base,
                    backgroundColor: "transparent",
                    color,
                    borderColor: color,
                };
            case "ghost":
                return {
                    ...base,
                    backgroundColor: isHex ? hexToRgba(color, 0.15) : `color-mix(in srgb, ${color} 15%, transparent)`,
                    color,
                    borderColor: "transparent",
                };
            default:
                return {
                    ...base,
                    backgroundColor: color,
                    color: isHex ? getContrastingTextColor(color) : undefined,
                    borderColor: "transparent",
                };
        }
    }, [color, variant, style]);

    return (
        <Comp
            role="status"
            className={cn(badgeVariants({ variant, shape }), className)}
            style={customStyles}
            {...props}
        />
    );
});

Badge.displayName = 'Badge';

export { Badge, badgeVariants };