import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default medium size', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  it('renders with small size', () => {
    render(<LoadingSpinner size="small" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-4', 'h-4');
  });

  it('renders with large size', () => {
    render(<LoadingSpinner size="large" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    
    const container = screen.getByRole('status').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Загрузка...');
    
    const srText = screen.getByText('Загрузка...');
    expect(srText).toHaveClass('sr-only');
  });
});
