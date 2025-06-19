import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// --- Color Utility Functions ---

/**
 * Validates if a string is a 6-digit hex color.
 */
const isValidHexColor = (color: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(color);

/**
 * Calculates a contrasting text color (black or white) for a given hex background.
 */
const getContrastingTextColor = (hexColor: string): string => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    // Using the YIQ formula to determine luminance
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
};

/**
 * Converts a hex color string to an RGBA color string.
 */
const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// --- Component Definition ---

const badgeVariants = cva(
    "inline-flex items-center justify-center text-xs font-medium shrink-0 overflow-hidden border transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 gap-0.5 whitespace-nowrap [&>svg]:size-2.5",
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
                circular: "rounded-full aspect-square w-5 h-5 ",
            },
        },
        defaultVariants: {
            variant: "default",
            shape: "default",
        },
    }
);

export type BadgeVariant = "default" | "outline" | "ghost"
export type BadgeShape = "default" | "square" | "circular"

export type BadgeProps = React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    color?: string; // Accepts a 6-digit hex color string (e.g., "#RRGGBB")
};

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

    const customStyles = React.useMemo(() => {
        if (!color || !isValidHexColor(color)) {
            return style || {};
        }

        const baseStyles = style || {};

        // Define styles based on the variant and custom color
        switch (variant) {
            case 'outline':
                return {
                    ...baseStyles,
                    backgroundColor: 'transparent',
                    color: color,
                    borderColor: color,
                };
            case 'ghost':
                return {
                    ...baseStyles,
                    backgroundColor: hexToRgba(color, 0.15),
                    color: color,
                    borderColor: 'transparent',
                };
            default: // 'default' variant
                return {
                    ...baseStyles,
                    backgroundColor: color,
                    color: getContrastingTextColor(color),
                    borderColor: 'transparent',
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

export { Badge, badgeVariants };