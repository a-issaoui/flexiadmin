// src/components/__tests__/loading-states.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  LoadingSpinner,
  PageLoading,
  LoadingButton,
  RefreshButton,
  LoadingOverlay,
  LoadingBoundary,
} from '../common/loading-states';

describe('LoadingSpinner', () => {
  it('should render spinner with default size', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it('should render spinner with text', () => {
    render(<LoadingSpinner text="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('should apply size classes correctly', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass('h-4 w-4');

    rerender(<LoadingSpinner size="lg" />);
    spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass('h-8 w-8');
  });
});

describe('PageLoading', () => {
  it('should render with default title', () => {
    render(<PageLoading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render with custom title', () => {
    render(<PageLoading title="Loading page content..." />);
    expect(screen.getByText('Loading page content...')).toBeInTheDocument();
  });
});

describe('LoadingButton', () => {
  it('should render button with children when not loading', () => {
    render(
      <LoadingButton loading={false}>
        Submit
      </LoadingButton>
    );
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
  });

  it('should show spinner when loading', () => {
    render(
      <LoadingButton loading={true}>
        Submit
      </LoadingButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <LoadingButton loading={false} disabled={true}>
        Submit
      </LoadingButton>
    );
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should handle click events when not loading', () => {
    const handleClick = jest.fn();
    render(
      <LoadingButton loading={false} onClick={handleClick}>
        Submit
      </LoadingButton>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});

describe('RefreshButton', () => {
  it('should render refresh button', () => {
    const onRefresh = jest.fn();
    render(<RefreshButton onRefresh={onRefresh} loading={false} />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call onRefresh when clicked', () => {
    const onRefresh = jest.fn();
    render(<RefreshButton onRefresh={onRefresh} loading={false} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onRefresh).toHaveBeenCalled();
  });

  it('should be disabled when loading', () => {
    const onRefresh = jest.fn();
    render(<RefreshButton onRefresh={onRefresh} loading={true} />);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show spinning icon when loading', () => {
    const onRefresh = jest.fn();
    render(<RefreshButton onRefresh={onRefresh} loading={true} />);
    
    const button = screen.getByRole('button');
    const icon = button.querySelector('svg');
    expect(icon).toHaveClass('animate-spin');
  });
});

describe('LoadingOverlay', () => {
  it('should render children when not loading', () => {
    render(
      <LoadingOverlay loading={false}>
        <div>Content</div>
      </LoadingOverlay>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
  });

  it('should show overlay when loading', () => {
    render(
      <LoadingOverlay loading={true}>
        <div>Content</div>
      </LoadingOverlay>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });
});

describe('LoadingBoundary', () => {
  it('should render children when not loading', () => {
    render(
      <LoadingBoundary loading={false}>
        <div>Content</div>
      </LoadingBoundary>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render fallback when loading', () => {
    render(
      <LoadingBoundary loading={true}>
        <div>Content</div>
      </LoadingBoundary>
    );
    
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render custom fallback when loading', () => {
    render(
      <LoadingBoundary loading={true} fallback={<div>Custom Loading</div>}>
        <div>Content</div>
      </LoadingBoundary>
    );
    
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    expect(screen.getByText('Custom Loading')).toBeInTheDocument();
  });
});