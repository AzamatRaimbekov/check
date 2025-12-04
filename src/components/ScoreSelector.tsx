import React from 'react';
import { SCORE_LABELS } from '../types';

interface ScoreSelectorProps {
  selectedScore: number | null;
  onScoreSelect: (score: number) => void;
  disabled?: boolean;
}

export const ScoreSelector: React.FC<ScoreSelectorProps> = ({
  selectedScore,
  onScoreSelect,
  disabled = false,
}) => {
  const scores = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-4">
      <div className="flex justify-between space-x-2">
        {scores.map((score) => (
          <button
            key={score}
            onClick={() => onScoreSelect(score)}
            disabled={disabled}
            className={`score-button score-${score} ${
              selectedScore === score ? 'selected' : ''
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={`Оценка ${score} - ${SCORE_LABELS[score as keyof typeof SCORE_LABELS]}`}
          >
            {score}
          </button>
        ))}
      </div>
      
      {selectedScore && (
        <div className="text-center">
          <span className={`text-sm font-medium ${
            selectedScore >= 4 ? 'text-success-600' :
            selectedScore >= 3 ? 'text-warning-600' : 'text-danger-600'
          }`}>
            {SCORE_LABELS[selectedScore as keyof typeof SCORE_LABELS]}
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-5 gap-1 text-xs text-gray-500 text-center">
        <span>Критично</span>
        <span>Плохо</span>
        <span>Удовл.</span>
        <span>Хорошо</span>
        <span>Отлично</span>
      </div>
    </div>
  );
};
