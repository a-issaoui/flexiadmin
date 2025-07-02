import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// --- Color Utilities ---

const isValidHexColor = (color: string): boolean =>
    /^#[0-9A-Fa-f]{6}$/.test(color);

const isValidCssColorName = (color: string): boolean => {
    const s = new Option().style;
    s.color = color;
    return !!s.color;
};

const getContrastingTextColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#FFFFFF";
};

const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
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

// --- Badge Component ---

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
        const base = style || {};

        if (!color) return base;

        const isHex = isValidHexColor(color);
        const isNamed = isValidCssColorName(color);

        if (!isHex && !isNamed) return base;

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
                    backgroundColor: isHex ? hexToRgba(color, 0.15) : undefined,
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

export { Badge, badgeVariants };
