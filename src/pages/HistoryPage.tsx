import React from 'react';
import { Calendar, MapPin, Star, Download } from 'lucide-react';
import type { InspectionInstance } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useInspections } from '../hooks/useInspections';

export const HistoryPage: React.FC = () => {
  const { data: inspections, isLoading } = useInspections();

  const completedInspections = inspections?.filter(
    inspection => inspection.status === 'completed'
  ) || [];

  const handleExport = () => {
    // Mock export functionality
    const data = JSON.stringify(completedInspections, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inspections-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">История проверок</h2>
          <p className="text-sm text-gray-600">
            {completedInspections.length} завершенных проверок
          </p>
        </div>
        
        {completedInspections.length > 0 && (
          <button
            onClick={handleExport}
            className="btn btn-secondary flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </button>
        )}
      </div>

      {completedInspections.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Нет завершенных проверок
          </h3>
          <p className="text-gray-600">
            Завершенные проверки будут отображаться здесь
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {completedInspections.map((inspection) => (
            <HistoryCard key={inspection.id} inspection={inspection} />
          ))}
        </div>
      )}
    </div>
  );
};

interface HistoryCardProps {
  inspection: InspectionInstance;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ inspection }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-success-600';
    if (score >= 3.5) return 'text-warning-600';
    return 'text-danger-600';
  };

  const criticalIssues = inspection.items.filter(
    item => item.score !== null && item.score <= 2
  ).length;

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">
            Проверка магазина
          </h3>
          
          <div className="flex items-center text-sm text-gray-600 space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Магазин #{inspection.storeId}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(inspection.date)}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-lg font-semibold ${getScoreColor(inspection.averageScore)}`}>
            {inspection.averageScore.toFixed(1)}/5.0
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Star className="w-3 h-3 mr-1" />
            <span>Средняя оценка</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Пунктов:</span>
          <div className="font-medium">{inspection.items.length}</div>
        </div>
        <div>
          <span className="text-gray-600">Общий балл:</span>
          <div className="font-medium">{inspection.totalScore}</div>
        </div>
        <div>
          <span className="text-gray-600">Критичных:</span>
          <div className={`font-medium ${criticalIssues > 0 ? 'text-danger-600' : 'text-success-600'}`}>
            {criticalIssues}
          </div>
        </div>
      </div>

      {inspection.signature && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Подпись: <span className="font-medium">{inspection.signature}</span>
          </div>
        </div>
      )}
    </div>
  );
};
