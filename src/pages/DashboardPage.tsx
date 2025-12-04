import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Filter, Plus, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import type { InspectionInstance, InspectionStatus } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useInspections } from '../hooks/useInspections';

const statusConfig = {
  not_started: {
    label: 'Не начато',
    color: 'gray',
    icon: Clock,
  },
  in_progress: {
    label: 'В процессе',
    color: 'blue',
    icon: Clock,
  },
  completed: {
    label: 'Завершено',
    color: 'green',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Отменено',
    color: 'red',
    icon: XCircle,
  },
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<InspectionStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: inspections, isLoading, error } = useInspections();

  // Debug information
  console.log('Dashboard Debug:', { inspections, isLoading, error });

  const filteredInspections = inspections?.filter(inspection => 
    selectedStatus === 'all' || inspection.status === selectedStatus
  ) || [];

  const handleStartInspection = (inspectionId: string) => {
    navigate(`/inspection/${inspectionId}`);
  };

  const handleCreateNewInspection = () => {
    // In a real app, this would open a modal to select store and template
    const newInspectionId = `new-${Date.now()}`;
    navigate(`/inspection/${newInspectionId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-danger-600 mr-2" />
            <p className="text-danger-700">Ошибка загрузки данных</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Мои проверки</h2>
          <p className="text-sm text-gray-600">
            {filteredInspections.length} из {inspections?.length || 0} проверок
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'} p-2`}
            aria-label="Фильтры"
          >
            <Filter className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleCreateNewInspection}
            className="btn btn-primary p-2"
            aria-label="Новая проверка"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card">
          <h3 className="font-medium text-gray-900 mb-3">Фильтр по статусу</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Все
            </button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as InspectionStatus)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedStatus === status
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inspections List */}
      <div className="space-y-3">
        {filteredInspections.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedStatus === 'all' ? 'Нет проверок' : 'Нет проверок с выбранным статусом'}
            </h3>
            <p className="text-gray-600 mb-4">
              Создайте новую проверку или измените фильтры
            </p>
            <button
              onClick={handleCreateNewInspection}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Создать проверку
            </button>
          </div>
        ) : (
          filteredInspections.map((inspection) => (
            <InspectionCard
              key={inspection.id}
              inspection={inspection}
              onStart={() => handleStartInspection(inspection.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface InspectionCardProps {
  inspection: InspectionInstance;
  onStart: () => void;
}

const InspectionCard: React.FC<InspectionCardProps> = ({ inspection, onStart }) => {
  const config = statusConfig[inspection.status];
  const Icon = config.icon;
  
  const completedItems = inspection.items.filter(item => item.score !== null).length;
  const totalItems = inspection.items.length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card hover:shadow-md transition-shadow cursor-pointer" onClick={onStart}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium text-gray-900">Проверка магазина</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              inspection.status === 'completed' ? 'bg-green-100 text-green-700' :
              inspection.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
              inspection.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              <Icon className="w-3 h-3 mr-1" />
              {config.label}
            </span>
          </div>
          
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
      </div>

      {/* Progress */}
      {inspection.status === 'in_progress' && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Прогресс</span>
            <span>{completedItems}/{totalItems}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Score */}
      {inspection.status === 'completed' && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Итоговая оценка:</span>
          <span className={`font-medium ${
            inspection.averageScore >= 4 ? 'text-green-600' :
            inspection.averageScore >= 3 ? 'text-orange-600' : 'text-red-600'
          }`}>
            {inspection.averageScore.toFixed(1)}/5.0
          </span>
        </div>
      )}

      {/* Sync Status */}
      {inspection.syncStatus !== 'synced' && (
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            inspection.syncStatus === 'pending' ? 'bg-orange-400' :
            inspection.syncStatus === 'failed' ? 'bg-red-400' : 'bg-gray-400'
          }`} />
          {inspection.syncStatus === 'pending' && 'Ожидает синхронизации'}
          {inspection.syncStatus === 'failed' && 'Ошибка синхронизации'}
          {inspection.syncStatus === 'offline' && 'Сохранено локально'}
        </div>
      )}
    </div>
  );
};
