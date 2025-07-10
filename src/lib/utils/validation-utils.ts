// Simple Validation Utilities for Admin Dashboard

export const ValidationUtils = {
    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    isValidUrl: (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    isRequired: (value: unknown): boolean => {
        return value !== undefined && value !== null && value !== '';
    },
    
    minLength: (value: string, min: number): boolean => {
        return value.length >= min;
    },
    
    maxLength: (value: string, max: number): boolean => {
        return value.length <= max;
    },
    
    sanitizeInput: (input: string): string => {
        return input.trim().replace(/<[^>]*>/g, '');
    },
};