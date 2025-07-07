// src/lib/validation.ts

// Validation utilities and rules

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  custom?: (value: any) => boolean | string;
  equalTo?: string; // Field name to compare with
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  firstError?: string;
}

export interface FormField {
  value: any;
  rules?: ValidationRule;
  touched?: boolean;
  error?: string;
}

export interface FormState {
  [key: string]: FormField;
}

// Built-in validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphabetic: /^[a-zA-Z]+$/,
  numeric: /^\d+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  ipAddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
};

// Validation utility class
export class Validator {
  private static validateField(value: any, rules: ValidationRule, allValues?: Record<string, any>): string | null {
    // Required validation
    if (rules.required && (value === undefined || value === null || value === '')) {
      return 'This field is required';
    }

    // Skip other validations if field is empty and not required
    if (!rules.required && (value === undefined || value === null || value === '')) {
      return null;
    }

    // String length validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `Must be at least ${rules.minLength} characters long`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `Must be no more than ${rules.maxLength} characters long`;
      }
    }

    // Number range validations
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return `Must be at least ${rules.min}`;
      }
      if (rules.max !== undefined && value > rules.max) {
        return `Must be no more than ${rules.max}`;
      }
    }

    // Email validation
    if (rules.email && !ValidationPatterns.email.test(value)) {
      return 'Please enter a valid email address';
    }

    // URL validation
    if (rules.url && !ValidationPatterns.url.test(value)) {
      return 'Please enter a valid URL';
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid format';
    }

    // Equal to validation
    if (rules.equalTo && allValues && value !== allValues[rules.equalTo]) {
      return `Must match ${rules.equalTo}`;
    }

    // Custom validation
    if (rules.custom) {
      const result = rules.custom(value);
      if (typeof result === 'string') {
        return result;
      }
      if (result === false) {
        return 'Invalid value';
      }
    }

    return null;
  }

  static validateForm(formState: FormState): ValidationResult {
    const errors: Record<string, string> = {};
    const allValues = Object.keys(formState).reduce((acc, key) => {
      acc[key] = formState[key].value;
      return acc;
    }, {} as Record<string, any>);

    Object.keys(formState).forEach(fieldName => {
      const field = formState[fieldName];
      if (field.rules) {
        const error = this.validateField(field.value, field.rules, allValues);
        if (error) {
          errors[fieldName] = error;
        }
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      firstError: Object.values(errors)[0],
    };
  }

  static validateSingleField(value: any, rules: ValidationRule, allValues?: Record<string, any>): string | null {
    return this.validateField(value, rules, allValues);
  }
}

// Common validation rule sets
export const CommonValidationRules = {
  email: {
    required: true,
    email: true,
    maxLength: 255,
  } as ValidationRule,

  password: {
    required: true,
    minLength: 8,
    pattern: ValidationPatterns.strongPassword,
    custom: (value: string) => {
      if (!value) return true;
      if (!/(?=.*[a-z])/.test(value)) return 'Must contain at least one lowercase letter';
      if (!/(?=.*[A-Z])/.test(value)) return 'Must contain at least one uppercase letter';
      if (!/(?=.*\d)/.test(value)) return 'Must contain at least one number';
      if (!/(?=.*[@$!%*?&])/.test(value)) return 'Must contain at least one special character';
      return true;
    },
  } as ValidationRule,

  confirmPassword: (passwordField: string) => ({
    required: true,
    equalTo: passwordField,
  } as ValidationRule),

  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
  } as ValidationRule,

  phone: {
    pattern: ValidationPatterns.phone,
  } as ValidationRule,

  url: {
    url: true,
  } as ValidationRule,

  requiredText: {
    required: true,
    minLength: 1,
    maxLength: 255,
  } as ValidationRule,

  optionalText: {
    maxLength: 255,
  } as ValidationRule,

  positiveNumber: {
    required: true,
    min: 0,
  } as ValidationRule,

  percentage: {
    min: 0,
    max: 100,
  } as ValidationRule,
};

// Note: Form validation hook should be moved to a separate file with React imports
// For now, commenting out to fix build issues

// Form validation hook
/*
export function useFormValidation(initialState: FormState) {
  const [formState, setFormState] = React.useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

// Hook implementation commented out - should be in a separate React hook file
*/

// Utility functions for common validations
export const ValidationUtils = {
  isValidEmail: (email: string): boolean => ValidationPatterns.email.test(email),
  isValidPhone: (phone: string): boolean => ValidationPatterns.phone.test(phone),
  isValidUrl: (url: string): boolean => ValidationPatterns.url.test(url),
  isStrongPassword: (password: string): boolean => ValidationPatterns.strongPassword.test(password),
  
  sanitizeInput: (input: string): string => {
    return input.trim().replace(/<[^>]*>/g, '');
  },
  
  formatPhoneNumber: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },
};