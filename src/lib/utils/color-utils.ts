// Simple Color Utilities for Admin Dashboard
export type SafeColor = string;

// Basic color validation for admin dashboard
export function isValidColor(color: string | undefined | null): color is SafeColor {
    if (!color || typeof color !== 'string') return false;
    
    const trimmedColor = color.trim();
    
    // Basic hex colors
    if (trimmedColor.startsWith('#')) {
        return /^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/.test(trimmedColor);
    }
    
    // Basic CSS color keywords
    const basicColors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'gray', 'grey', 'orange', 'purple', 'pink', 'brown', 'transparent'];
    return basicColors.includes(trimmedColor.toLowerCase());
}

// Sanitize color with fallback
export function sanitizeColor(color: string | undefined | null): SafeColor | undefined {
    return isValidColor(color) ? color : undefined;
}