import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { useInspection, useChecklistTemplate, useUpdateInspectionItem, useCompleteInspection } from '../hooks/useInspections';
import { ChecklistItemCard } from '../components/ChecklistItemCard';
import { InspectionSummary } from '../components/InspectionSummary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { ItemResult } from '../types';

export const InspectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { data: inspection, isLoading: inspectionLoading } = useInspection(id!);
  const { data: template, isLoading: templateLoading } = useChecklistTemplate(
    inspection?.templateId || ''
  );
  
  const updateItemMutation = useUpdateInspectionItem();
  const completeInspectionMutation = useCompleteInspection();

  const isLoading = inspectionLoading || templateLoading;

  // Auto-save functionality
  useEffect(() => {
    let timeoutId: number;
    
    if (autoSaveStatus === 'saving') {
      timeoutId = setTimeout(() => {
        setAutoSaveStatus('saved');
      }, 1000);
    } else if (autoSaveStatus === 'saved') {
      timeoutId = setTimeout(() => {
        setAutoSaveStatus('idle');
      }, 2000);
    }

    return () => clearTimeout(timeoutId);
  }, [autoSaveStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!inspection || !template) {
    return (
      <div className="p-4">
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p className="text-danger-700">Проверка не найдена</p>
        </div>
      </div>
    );
  }

  const currentTemplateItem = template.items[currentItemIndex];
  const currentResult = inspection.items.find(
    item => item.itemId === currentTemplateItem?.id
  );

  const completedItems = inspection.items.filter(item => item.score !== null).length;
  const totalItems = inspection.items.length;
  const progress = (completedItems / totalItems) * 100;

  const handleItemUpdate = async (itemId: string, updates: Partial<ItemResult>) => {
    setAutoSaveStatus('saving');
    
    try {
      await updateItemMutation.mutateAsync({
        inspectionId: inspection.id,
        itemId,
        updates,
      });
      setAutoSaveStatus('saved');
    } catch (error) {
      setAutoSaveStatus('error');
      console.error('Failed to update item:', error);
    }
  };

  const handleScoreChange = (itemId: string, score: number) => {
    handleItemUpdate(itemId, { score });
  };

  const handleCommentChange = (itemId: string, comments: string) => {
    handleItemUpdate(itemId, { comments });
  };

  const handlePhotoAdd = (itemId: string, photo: any) => {
    const currentItem = inspection.items.find(item => item.itemId === itemId);
    if (currentItem) {
      const updatedPhotos = [...currentItem.photos, photo];
      handleItemUpdate(itemId, { photos: updatedPhotos });
    }
  };

  const handlePhotoRemove = (itemId: string, photoId: string) => {
    const currentItem = inspection.items.find(item => item.itemId === itemId);
    if (currentItem) {
      const updatedPhotos = currentItem.photos.filter(p => p.id !== photoId);
      handleItemUpdate(itemId, { photos: updatedPhotos });
    }
  };

  const handleToggleComplete = (itemId: string) => {
    const currentItem = inspection.items.find(item => item.itemId === itemId);
    if (currentItem) {
      handleItemUpdate(itemId, { 
        isCompleted: !currentItem.isCompleted,
        completedAt: !currentItem.isCompleted ? new Date().toISOString() : undefined,
      });
    }
  };

  const handleNext = () => {
    if (currentItemIndex < template.items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  const handleCompleteInspection = async (signature: string) => {
    try {
      await completeInspectionMutation.mutateAsync({
        inspectionId: inspection.id,
        signature,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete inspection:', error);
    }
  };

  if (showSummary) {
    return (
      <InspectionSummary
        inspection={inspection}
        template={template}
        onComplete={handleCompleteInspection}
        onBack={() => setShowSummary(false)}
        isLoading={completeInspectionMutation.isPending}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-semibold text-gray-900">
            {template.title}
          </h1>
          <div className="flex items-center space-x-2">
            {autoSaveStatus === 'saving' && (
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-1" />
                Сохранение...
              </div>
            )}
            {autoSaveStatus === 'saved' && (
              <div className="flex items-center text-sm text-success-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Сохранено
              </div>
            )}
            {autoSaveStatus === 'error' && (
              <div className="flex items-center text-sm text-danger-600">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Ошибка
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Пункт {currentItemIndex + 1} из {totalItems}</span>
          <span>{completedItems}/{totalItems} завершено</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Item */}
      <div className="p-4">
        {currentTemplateItem && currentResult && (
          <ChecklistItemCard
            item={currentTemplateItem}
            result={currentResult}
            onScoreChange={handleScoreChange}
            onCommentChange={handleCommentChange}
            onPhotoAdd={handlePhotoAdd}
            onPhotoRemove={handlePhotoRemove}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom">
        <div className="flex items-center justify-between space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentItemIndex === 0}
            className="btn btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Назад
          </button>
          
          <button
            onClick={handleNext}
            className="btn btn-primary flex-1"
          >
            {currentItemIndex === template.items.length - 1 ? 'Завершить' : 'Далее'}
          </button>
        </div>
      </div>
    </div>
  );
};
