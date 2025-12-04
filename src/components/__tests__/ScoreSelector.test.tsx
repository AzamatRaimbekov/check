import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { ScoreSelector } from '../ScoreSelector';

describe('ScoreSelector', () => {
  const mockOnScoreSelect = vi.fn();

  beforeEach(() => {
    mockOnScoreSelect.mockClear();
  });

  it('renders all score buttons', () => {
    render(
      <ScoreSelector 
        selectedScore={null} 
        onScoreSelect={mockOnScoreSelect} 
      />
    );

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole('button', { name: new RegExp(`Оценка ${i}`) })).toBeInTheDocument();
    }
  });

  it('highlights selected score', () => {
    render(
      <ScoreSelector 
        selectedScore={4} 
        onScoreSelect={mockOnScoreSelect} 
      />
    );

    const selectedButton = screen.getByRole('button', { name: /Оценка 4/ });
    expect(selectedButton).toHaveClass('selected');
  });

  it('calls onScoreSelect when button is clicked', () => {
    render(
      <ScoreSelector 
        selectedScore={null} 
        onScoreSelect={mockOnScoreSelect} 
      />
    );

    const scoreButton = screen.getByRole('button', { name: /Оценка 3/ });
    fireEvent.click(scoreButton);

    expect(mockOnScoreSelect).toHaveBeenCalledWith(3);
  });

  it('shows score label when score is selected', () => {
    render(
      <ScoreSelector 
        selectedScore={5} 
        onScoreSelect={mockOnScoreSelect} 
      />
    );

    expect(screen.getByText('Отлично')).toBeInTheDocument();
  });

  it('disables buttons when disabled prop is true', () => {
    render(
      <ScoreSelector 
        selectedScore={null} 
        onScoreSelect={mockOnScoreSelect} 
        disabled={true}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
});
