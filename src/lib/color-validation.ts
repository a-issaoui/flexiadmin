// src/lib/color-validation.ts

/**
 * Validates and sanitizes color values for safe usage in styles.
 * This prevents XSS attacks and ensures consistent color handling.
 */

// Define allowed color formats
type HexColor = `#${string}`;
type RgbColor = `rgb(${string})`;
type RgbaColor = `rgba(${string})`;
type HslColor = `hsl(${string})`;
type HslaColor = `hsla(${string})`;
type CssColorKeyword = 'red' | 'blue' | 'green' | 'yellow' | 'black' | 'white' |
    'gray' | 'grey' | 'orange' | 'purple' | 'pink' | 'brown' | 'transparent' | 'currentColor';

export type SafeColor = HexColor | RgbColor | RgbaColor | HslColor | HslaColor | CssColorKeyword;

// Comprehensive list of CSS color keywords
const CSS_COLOR_KEYWORDS = new Set([
    'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque',
    'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue',
    'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan',
    'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgrey', 'darkgreen',
    'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred',
    'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey',
    'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey',
    'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro',
    'ghostwhite', 'gold', 'goldenrod', 'gray', 'grey', 'green', 'greenyellow',
    'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender',
    'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan',
    'lightgoldenrodyellow', 'lightgray', 'lightgrey', 'lightgreen', 'lightpink',
    'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey',
    'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon',
    'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen',
    'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred',
    'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy',
    'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod',
    'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru',
    'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue',
    'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver',
    'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue',
    'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white',
    'whitesmoke', 'yellow', 'yellowgreen',
    // CSS system colors
    'transparent', 'currentcolor', 'inherit', 'initial', 'revert', 'unset'
]);

/**
 * Validates a hex color string
 */
function isValidHexColor(color: string): boolean {
    // Check for 3 or 6 digit hex colors
    return /^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Validates RGB/RGBA color format
 */
function isValidRgbColor(color: string): boolean {
    // Match rgb(r, g, b) or rgba(r, g, b, a)
    const rgbPattern = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[\d.]+\s*)?\)$/;
    if (!rgbPattern.test(color)) return false;

    // Extract and validate individual values
    const matches = color.match(/\d+/g);
    if (!matches) return false;

    const [r, g, b] = matches.map(Number);
    return r <= 255 && g <= 255 && b <= 255;
}

/**
 * Validates HSL/HSLA color format
 */
function isValidHslColor(color: string): boolean {
    // Match hsl(h, s%, l%) or hsla(h, s%, l%, a)
    const hslPattern = /^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*[\d.]+\s*)?\)$/;
    if (!hslPattern.test(color)) return false;

    // Extract and validate hue (0-360)
    const hueMatch = color.match(/\d+/);
    if (!hueMatch) return false;

    const hue = Number(hueMatch[0]);
    return hue <= 360;
}

/**
 * Main validation function that checks if a color string is safe to use
 */
export function isValidColor(color: string | undefined | null): color is SafeColor {
    if (!color || typeof color !== 'string') return false;

    // Trim and lowercase for comparison
    const trimmedColor = color.trim();
    const lowerColor = trimmedColor.toLowerCase();

    // Check against known CSS keywords
    if (CSS_COLOR_KEYWORDS.has(lowerColor)) return true;

    // Check hex colors
    if (trimmedColor.startsWith('#')) {
        return isValidHexColor(trimmedColor);
    }

    // Check RGB/RGBA
    if (lowerColor.startsWith('rgb')) {
        return isValidRgbColor(lowerColor);
    }

    // Check HSL/HSLA
    if (lowerColor.startsWith('hsl')) {
        return isValidHslColor(lowerColor);
    }

    return false;
}

/**
 * Sanitizes a color value, returning the color if valid or undefined if not
 */
export function sanitizeColor(color: string | undefined | null): SafeColor | undefined {
    if (isValidColor(color)) {
        return color;
    }

    // Log invalid colors in development
    if (process.env.NODE_ENV === 'development' && color) {
        console.warn(`Invalid color value detected: "${color}". This color will be ignored.`);
    }

    return undefined;
}

/**
 * Gets a safe color value with a fallback
 */
export function getSafeColor(
    color: string | undefined | null,
    fallback?: SafeColor
): SafeColor | undefined {
    const sanitized = sanitizeColor(color);
    return sanitized || fallback;
}