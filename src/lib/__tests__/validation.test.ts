// src/lib/__tests__/validation.test.ts

import { Validator, ValidationPatterns, ValidationUtils, CommonValidationRules } from '../validation';

describe('ValidationPatterns', () => {
  describe('email pattern', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'firstname+lastname@example.org',
      ];

      validEmails.forEach(email => {
        expect(ValidationPatterns.email.test(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'plainaddress',
        'username@',
        '@domain.com',
        'username@.com',
      ];

      invalidEmails.forEach(email => {
        expect(ValidationPatterns.email.test(email)).toBe(false);
      });
    });
  });

  describe('phone pattern', () => {
    it('should validate phone numbers', () => {
      const validPhones = [
        '+1234567890',
        '1234567890',
      ];

      validPhones.forEach(phone => {
        expect(ValidationPatterns.phone.test(phone)).toBe(true);
      });
    });
  });

  describe('strong password pattern', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'MyP@ssw0rd123',
        'Str0ng!Password',
        'C0mpl3x&Pass',
      ];

      strongPasswords.forEach(password => {
        expect(ValidationPatterns.strongPassword.test(password)).toBe(true);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'password',
        'PASSWORD',
        'Password',
        'Pass123',
        'P@ss',
      ];

      weakPasswords.forEach(password => {
        expect(ValidationPatterns.strongPassword.test(password)).toBe(false);
      });
    });
  });
});

describe('Validator', () => {
  describe('validateSingleField', () => {
    it('should validate required fields', () => {
      const rules = { required: true };
      
      expect(Validator.validateSingleField('', rules)).toBe('This field is required');
      expect(Validator.validateSingleField(null, rules)).toBe('This field is required');
      expect(Validator.validateSingleField(undefined, rules)).toBe('This field is required');
      expect(Validator.validateSingleField('value', rules)).toBeNull();
    });

    it('should validate string length', () => {
      const rules = { minLength: 3, maxLength: 10 };
      
      expect(Validator.validateSingleField('ab', rules)).toBe('Must be at least 3 characters long');
      expect(Validator.validateSingleField('abcdefghijk', rules)).toBe('Must be no more than 10 characters long');
      expect(Validator.validateSingleField('abc', rules)).toBeNull();
      expect(Validator.validateSingleField('abcdefghij', rules)).toBeNull();
    });

    it('should validate number ranges', () => {
      const rules = { min: 1, max: 100 };
      
      expect(Validator.validateSingleField(0, rules)).toBe('Must be at least 1');
      expect(Validator.validateSingleField(101, rules)).toBe('Must be no more than 100');
      expect(Validator.validateSingleField(50, rules)).toBeNull();
    });

    it('should validate email format', () => {
      const rules = { email: true };
      
      expect(Validator.validateSingleField('invalid-email', rules)).toBe('Please enter a valid email address');
      expect(Validator.validateSingleField('valid@email.com', rules)).toBeNull();
    });

    it('should validate equalTo constraint', () => {
      const rules = { equalTo: 'password' };
      const allValues = { password: 'secret123', confirmPassword: 'secret456' };
      
      expect(Validator.validateSingleField('secret456', rules, allValues)).toBe('Must match password');
      expect(Validator.validateSingleField('secret123', rules, allValues)).toBeNull();
    });

    it('should validate custom rules', () => {
      const rules = {
        custom: (value: string) => {
          if (value === 'forbidden') return 'This value is not allowed';
          if (value.length < 5) return false;
          return true;
        }
      };
      
      expect(Validator.validateSingleField('forbidden', rules)).toBe('This value is not allowed');
      expect(Validator.validateSingleField('abc', rules)).toBe('Invalid value');
      expect(Validator.validateSingleField('valid', rules)).toBeNull();
    });
  });

  describe('validateForm', () => {
    it('should validate entire form', () => {
      const formState = {
        email: {
          value: 'invalid-email',
          rules: { required: true, email: true }
        },
        password: {
          value: 'weak',
          rules: { required: true, minLength: 8 }
        },
        confirmPassword: {
          value: 'different',
          rules: { required: true, equalTo: 'password' }
        },
        name: {
          value: 'John Doe',
          rules: { required: true, minLength: 2 }
        }
      };

      const result = Validator.validateForm(formState);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
      expect(result.errors.password).toBe('Must be at least 8 characters long');
      expect(result.errors.confirmPassword).toBe('Must match password');
      expect(result.errors.name).toBeUndefined();
    });

    it('should return valid result for valid form', () => {
      const formState = {
        email: {
          value: 'test@example.com',
          rules: { required: true, email: true }
        },
        name: {
          value: 'John Doe',
          rules: { required: true, minLength: 2 }
        }
      };

      const result = Validator.validateForm(formState);
      
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
  });
});

describe('ValidationUtils', () => {
  describe('isValidEmail', () => {
    it('should correctly validate emails', () => {
      expect(ValidationUtils.isValidEmail('test@example.com')).toBe(true);
      expect(ValidationUtils.isValidEmail('invalid-email')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('should correctly validate strong passwords', () => {
      expect(ValidationUtils.isStrongPassword('MyP@ssw0rd123')).toBe(true);
      expect(ValidationUtils.isStrongPassword('weakpassword')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize dangerous characters', () => {
      expect(ValidationUtils.sanitizeInput('  <script>alert("xss")</script>  ')).toBe('alert("xss")');
      expect(ValidationUtils.sanitizeInput('normal text')).toBe('normal text');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format US phone numbers', () => {
      expect(ValidationUtils.formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
      expect(ValidationUtils.formatPhoneNumber('123')).toBe('123');
    });
  });
});

describe('CommonValidationRules', () => {
  it('should provide correct email validation rules', () => {
    const rules = CommonValidationRules.email;
    expect(rules.required).toBe(true);
    expect(rules.email).toBe(true);
    expect(rules.maxLength).toBe(255);
  });

  it('should provide correct password validation rules', () => {
    const rules = CommonValidationRules.password;
    expect(rules.required).toBe(true);
    expect(rules.minLength).toBe(8);
    expect(rules.pattern).toBe(ValidationPatterns.strongPassword);
    expect(typeof rules.custom).toBe('function');
  });

  it('should validate password with custom rule', () => {
    const rules = CommonValidationRules.password;
    const customValidation = rules.custom as (value: string) => boolean | string;
    
    expect(customValidation('Weak123')).toBe('Must contain at least one special character');
    expect(customValidation('MyP@ssw0rd123')).toBe(true);
  });
});