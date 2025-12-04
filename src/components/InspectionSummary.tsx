import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Star, Signature } from 'lucide-react';
import type { InspectionInstance, ChecklistTemplate } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface InspectionSummaryProps {
  inspection: InspectionInstance;
  template: ChecklistTemplate;
  onComplete: (signature: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const InspectionSummary: React.FC<InspectionSummaryProps> = ({
  inspection,
  template,
  onComplete,
  onBack,
  isLoading,
}) => {
  const [signature, setSignature] = useState('');
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const completedItems = inspection.items.filter(item => item.score !== null);
  const totalItems = inspection.items.length;
  const averageScore = completedItems.length > 0 
    ? completedItems.reduce((sum, item) => sum + (item.score || 0), 0) / completedItems.length 
    : 0;

  const criticalIssues = completedItems.filter(item => item.score && item.score <= 2);
  const warningIssues = completedItems.filter(item => item.score === 3);
  const goodItems = completedItems.filter(item => item.score && item.score >= 4);

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-success-600';
    if (score >= 3.5) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 4.5) return 'bg-success-50 border-success-200';
    if (score >= 3.5) return 'bg-warning-50 border-warning-200';
    return 'bg-danger-50 border-danger-200';
  };

  const handleCompleteClick = () => {
    if (completedItems.length < totalItems) {
      const confirmComplete = confirm(
        `Не все пункты заполнены (${completedItems.length}/${totalItems}). Завершить проверку?`
      );
      if (!confirmComplete) return;
    }
    setShowSignatureModal(true);
  };

  const handleSignatureSubmit = () => {
    if (!signature.trim()) {
      alert('Пожалуйста, введите подпись');
      return;
    }
    onComplete(signature.trim());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Итоги проверки</h1>
          <button
            onClick={onBack}
            className="btn btn-secondary text-sm"
          >
            Назад к проверке
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <p>{template.title}</p>
          <p>Магазин #{inspection.storeId}</p>
          <p>{new Date(inspection.date).toLocaleDateString('ru-RU')}</p>
        </div>
      </div>

      {/* Overall Score */}
      <div className={`card border-2 ${getScoreBgColor(averageScore)}`}>
        <div className="text-center">
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(averageScore)}`}>
            {averageScore.toFixed(1)}
          </div>
          <div className="flex items-center justify-center text-gray-600 mb-2">
            <Star className="w-4 h-4 mr-1" />
            <span>Средняя оценка</span>
          </div>
          <div className="text-sm text-gray-500">
            Общий балл: {completedItems.reduce((sum, item) => sum + (item.score || 0), 0)} из {totalItems * 5}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Прогресс</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Завершено пунктов:</span>
            <span className="font-medium">{completedItems.length}/{totalItems}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(completedItems.length / totalItems) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Issues Summary */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Анализ результатов</h3>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-danger-600">
              {criticalIssues.length}
            </div>
            <div className="text-sm text-gray-600">Критичных</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold text-warning-600">
              {warningIssues.length}
            </div>
            <div className="text-sm text-gray-600">Требуют внимания</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold text-success-600">
              {goodItems.length}
            </div>
            <div className="text-sm text-gray-600">Хорошо</div>
          </div>
        </div>
      </div>

      {/* Critical Issues */}
      {criticalIssues.length > 0 && (
        <div className="card border-l-4 border-danger-500">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-danger-600 mr-2" />
            Критичные замечания
          </h3>
          
          <div className="space-y-3">
            {criticalIssues.map((item) => {
              const templateItem = template.items.find(t => t.id === item.itemId);
              return (
                <div key={item.itemId} className="bg-danger-50 p-3 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-danger-900">
                        #{templateItem?.number} {templateItem?.zone}
                      </p>
                      <p className="text-sm text-danger-700 mt-1">
                        {templateItem?.description}
                      </p>
                      {item.comments && (
                        <p className="text-sm text-danger-600 mt-2 italic">
                          "{item.comments}"
                        </p>
                      )}
                    </div>
                    <span className="text-lg font-bold text-danger-600 ml-2">
                      {item.score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Complete Button */}
      <div className="card">
        <button
          onClick={handleCompleteClick}
          disabled={isLoading}
          className="w-full btn btn-success flex items-center justify-center text-lg py-4"
        >
          {isLoading ? (
            <LoadingSpinner size="small" className="mr-2" />
          ) : (
            <CheckCircle className="w-6 h-6 mr-2" />
          )}
          {isLoading ? 'Завершение...' : 'Завершить проверку'}
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          После завершения проверка будет отправлена на сервер
        </p>
      </div>

      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Signature className="w-5 h-5 mr-2" />
                Подпись
              </h3>
              <button
                onClick={() => setShowSignatureModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                disabled={isLoading}
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Введите ваше ФИО для подтверждения проверки
            </p>

            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Иван Петров"
              className="input"
              disabled={isLoading}
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setShowSignatureModal(false)}
                disabled={isLoading}
                className="flex-1 btn btn-secondary"
              >
                Отмена
              </button>
              <button
                onClick={handleSignatureSubmit}
                disabled={isLoading || !signature.trim()}
                className="flex-1 btn btn-primary"
              >
                {isLoading ? 'Завершение...' : 'Подтвердить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
