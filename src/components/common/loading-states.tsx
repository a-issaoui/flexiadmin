'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/common/icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Generic loading spinner with enhanced UX
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  delay?: number; // Delay before showing spinner to prevent flicker
  variant?: 'spin' | 'pulse' | 'bounce';
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  text, 
  delay = 200,
  variant = 'spin' 
}: LoadingSpinnerProps) {
  const [isVisible, setIsVisible] = React.useState(delay === 0);

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const animationClasses = {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      'flex items-center justify-center gap-2 transition-opacity duration-200 fade-in',
      className
    )}>
      <Icon 
        name="CircleNotchIcon" 
        size={size === 'sm' ? 16 : size === 'md' ? 24 : 32} 
        className={cn(animationClasses[variant], sizeClasses[size])} 
        role="status" 
        aria-label={text || 'Loading'}
      />
      {text && (
        <span className="text-sm text-muted-foreground animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
}

// Enhanced full page loading state with progress indication
export interface PageLoadingProps {
  title?: string;
  subtitle?: string;
  progress?: number; // 0-100
  showProgress?: boolean;
  className?: string;
}

export function PageLoading({ 
  title = 'Loading...', 
  subtitle,
  progress,
  showProgress = false,
  className 
}: PageLoadingProps) {
  return (
    <div className={cn(
      "flex items-center justify-center min-h-[400px] w-full",
      "animate-in fade-in duration-300",
      className
    )}>
      <div className="text-center space-y-6 max-w-md">
        <LoadingSpinner size="lg" delay={0} />
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {showProgress && progress !== undefined && (
          <div className="space-y-2">
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton for table rows
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Skeleton for table
export function TableSkeleton({ 
  columns = 4, 
  rows = 5,
  showHeader = true 
}: { 
  columns?: number; 
  rows?: number;
  showHeader?: boolean;
}) {
  return (
    <div className="w-full">
      {showHeader && (
        <div className="flex space-x-4 mb-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-6 flex-1" />
          ))}
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Card loading skeleton
export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
    </Card>
  );
}

// Form loading skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}

// User profile skeleton
export function UserProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Navigation skeleton
export function NavigationSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 flex-1" />
          </div>
          {i % 3 === 0 && (
            <div className="ml-7 space-y-2">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="flex items-center space-x-3">
                  <Skeleton className="h-3 w-3 rounded" />
                  <Skeleton className="h-3 flex-1" />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// List item skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

// Stats card skeleton
export function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

// Chart skeleton
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="w-full" style={{ height }} />
      <div className="flex justify-center space-x-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced button loading state with better UX
export interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  loadingText?: string;
  successIcon?: boolean;
  showSuccess?: boolean;
  successDuration?: number;
}

export function LoadingButton({
  loading,
  children,
  disabled,
  loadingText,
  successIcon = false,
  showSuccess = false,
  successDuration = 2000,
  ...props
}: LoadingButtonProps) {
  const [showSuccessState, setShowSuccessState] = React.useState(false);

  React.useEffect(() => {
    if (showSuccess && !loading) {
      setShowSuccessState(true);
      const timer = setTimeout(() => setShowSuccessState(false), successDuration);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, loading, successDuration]);

  const buttonContent = () => {
    if (showSuccessState && successIcon) {
      return (
        <>
          <Icon name="CheckIcon" size={16} className="mr-2 text-green-600" />
          Success
        </>
      );
    }
    
    if (loading) {
      return (
        <>
          <Icon name="CircleNotchIcon" size={16} className="mr-2 animate-spin" />
          {loadingText || children}
        </>
      );
    }
    
    return children;
  };

  return (
    <Button 
      disabled={loading || disabled || showSuccessState} 
      className={cn(
        "transition-all duration-200",
        showSuccessState && "bg-green-600 hover:bg-green-600"
      )}
      {...props}
    >
      {buttonContent()}
    </Button>
  );
}

// Refresh button with loading state
export function RefreshButton({
  onRefresh,
  loading,
  ...props
}: {
  onRefresh: () => void;
  loading: boolean;
} & React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onRefresh}
      disabled={loading}
      {...props}
    >
      <Icon name="ArrowCounterClockwiseIcon" size={16} className={cn(loading && 'animate-spin')} />
    </Button>
  );
}

// Enhanced content with loading overlay
export interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  loadingText?: string;
  blur?: boolean;
  opacity?: number;
}

export function LoadingOverlay({
  loading,
  children,
  className,
  loadingText,
  blur = true,
  opacity = 50,
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        "transition-all duration-200",
        loading && blur && "blur-[2px]",
        loading && "pointer-events-none"
      )}>
        {children}
      </div>
      {loading && (
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-200",
            `bg-background/${opacity}`
          )}
          role="progressbar"
          aria-label={loadingText || "Loading content"}
        >
          <LoadingSpinner size="lg" text={loadingText} delay={0} />
        </div>
      )}
    </div>
  );
}

// Progressive loading for lists and tables
export interface ProgressiveLoadingProps {
  items: unknown[];
  loading: boolean;
  renderItem: (item: unknown, index: number) => React.ReactNode;
  renderSkeleton: () => React.ReactNode;
  skeletonCount?: number;
  className?: string;
  staggered?: boolean;
}

export function ProgressiveLoading({
  items,
  loading,
  renderItem,
  renderSkeleton,
  skeletonCount = 5,
  className,
  staggered = true,
}: ProgressiveLoadingProps) {
  if (loading && items.length === 0) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "animate-in fade-in duration-200",
              staggered && `delay-${i * 100}`
            )}
          >
            {renderSkeleton()}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <div
          key={(item as { id?: string | number }).id || index}
          className="animate-in fade-in duration-200"
        >
          {renderItem(item, index)}
        </div>
      ))}
      {loading && items.length > 0 && (
        <div className="animate-in fade-in duration-200">
          {renderSkeleton()}
        </div>
      )}
    </div>
  );
}

// Suspense-like loading boundary
export function LoadingBoundary({
  loading,
  fallback,
  children,
}: {
  loading: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  if (loading) {
    return <>{fallback || <PageLoading />}</>;
  }

  return <>{children}</>;
}