'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/common/icon';
import { format } from 'date-fns';

export interface FormFieldProps {
  name: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'textarea' | 'select' | 'checkbox' | 'switch' | 'radio' | 'date' | 'file';
  placeholder?: string;
  value?: unknown;
  onChange?: (value: unknown) => void;
  onBlur?: () => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  multiple?: boolean;
  accept?: string; // For file inputs
  min?: number;
  max?: number;
  step?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  rows?: number; // For textarea
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required,
  disabled,
  readOnly,
  className,
  options,
  multiple,
  accept,
  min,
  max,
  step,
  autoComplete,
  autoFocus,
  rows = 3,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [dateOpen, setDateOpen] = React.useState(false);

  const fieldId = `field-${name}`;
  const hasError = !!error;

  const handleChange = (newValue: unknown) => {
    try {
      onChange?.(newValue);
    } catch (error) {
      console.error(`Error handling form field change for ${name}:`, error);
    }
  };

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            name={name}
            placeholder={placeholder}
            value={value as string || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            readOnly={readOnly}
            rows={rows}
            className={cn(hasError && 'border-destructive')}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
          />
        );

      case 'select':
        return (
          <Select
            value={value as string}
            onValueChange={handleChange}
            disabled={disabled}
          >
            <SelectTrigger className={cn(hasError && 'border-destructive')}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              name={name}
              checked={value as boolean || false}
              onCheckedChange={handleChange}
              disabled={disabled}
            />
            {label && (
              <Label htmlFor={fieldId} className="text-sm font-normal">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
          </div>
        );

      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={fieldId}
              name={name}
              checked={value as boolean || false}
              onCheckedChange={handleChange}
              disabled={disabled}
            />
            {label && (
              <Label htmlFor={fieldId} className="text-sm font-normal">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
          </div>
        );

      case 'radio':
        return (
          <RadioGroup
            value={value as string}
            onValueChange={handleChange}
            disabled={disabled}
          >
            {options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${fieldId}-${option.value}`}
                  disabled={option.disabled}
                />
                <Label htmlFor={`${fieldId}-${option.value}`} className="text-sm font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'date':
        return (
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !value && 'text-muted-foreground',
                  hasError && 'border-destructive'
                )}
                disabled={disabled}
              >
                <Icon name="CalendarIcon" size={16} className="mr-2" />
                {value ? format(new Date(value as string), 'PPP') : placeholder || 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value as string) : undefined}
                onSelect={(date) => {
                  handleChange(date);
                  setDateOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'file':
        return (
          <Input
            id={fieldId}
            name={name}
            type="file"
            onChange={(e) => {
              const file = multiple ? Array.from(e.target.files || []) : e.target.files?.[0];
              handleChange(file);
            }}
            onBlur={onBlur}
            disabled={disabled}
            multiple={multiple}
            accept={accept}
            className={cn(hasError && 'border-destructive')}
          />
        );

      case 'password':
        return (
          <div className="relative">
            <Input
              id={fieldId}
              name={name}
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              value={value as string || ''}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={onBlur}
              disabled={disabled}
              readOnly={readOnly}
              className={cn(hasError && 'border-destructive', 'pr-10')}
              autoComplete={autoComplete}
              autoFocus={autoFocus}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
            >
              {showPassword ? (
                <Icon name="EyeSlashIcon" size={16} />
              ) : (
                <Icon name="EyeIcon" size={16} />
              )}
            </Button>
          </div>
        );

      default:
        return (
          <Input
            id={fieldId}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value as string || ''}
            onChange={(e) => {
              const newValue = type === 'number' ? parseFloat(e.target.value) : e.target.value;
              handleChange(newValue);
            }}
            onBlur={onBlur}
            disabled={disabled}
            readOnly={readOnly}
            min={min}
            max={max}
            step={step}
            className={cn(hasError && 'border-destructive')}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
          />
        );
    }
  };

  // For checkbox and switch, don't render the label separately
  if (type === 'checkbox' || type === 'switch') {
    return (
      <div className={cn('space-y-2', className)}>
        {renderField()}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={fieldId} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

// Form container component
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}

export function Form({ children, onSubmit, className, ...props }: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-6', className)}
      {...props}
    >
      {children}
    </form>
  );
}

// Form section component for grouping fields
export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <div className="space-y-1">
          <h3 className="text-lg font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}