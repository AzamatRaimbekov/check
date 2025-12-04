import React, { useState, useEffect } from 'react';
import { Camera, MessageSquare, User, CheckCircle, AlertTriangle } from 'lucide-react';
import type { ChecklistItem, ItemResult, Photo } from '../types';
import { ScoreSelector } from './ScoreSelector';
import { PhotoUploader } from './PhotoUploader';

interface ChecklistItemCardProps {
  item: ChecklistItem;
  result: ItemResult;
  onScoreChange: (itemId: string, score: number) => void;
  onCommentChange: (itemId: string, comment: string) => void;
  onPhotoAdd: (itemId: string, photo: Photo) => void;
  onPhotoRemove: (itemId: string, photoId: string) => void;
  onToggleComplete: (itemId: string) => void;
}

export const ChecklistItemCard: React.FC<ChecklistItemCardProps> = ({
  item,
  result,
  onScoreChange,
  onCommentChange,
  onPhotoAdd,
  onPhotoRemove,
  onToggleComplete,
}) => {
  const [comment, setComment] = useState(result.comments || '');
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);

  // Когда переходим к следующему пункту (item/result меняются),
  // локальное состояние комментария должно синхронизироваться с данными.
  // Это очищает поле для нового пункта (у которого comments = '').
  useEffect(() => {
    setComment(result.comments || '');
  }, [item.id, result.itemId, result.comments]);

  const handleCommentBlur = () => {
    if (comment !== result.comments) {
      onCommentChange(item.id, comment);
    }
  };

  const needsAttention = result.score !== null && result.score <= item.notifyOnScoreLessOrEqual;

  return (
    <div className="card space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {item.number}
            </span>
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {item.zone}
            </span>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {item.description}
          </h3>
          
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Действие:</strong> {item.action}
          </div>
        </div>
        
        <button
          onClick={() => onToggleComplete(item.id)}
          className={`ml-4 p-2 rounded-lg transition-colors ${
            result.isCompleted
              ? 'bg-success-100 text-success-700'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          aria-label={result.isCompleted ? 'Отметить как не выполнено' : 'Отметить как выполнено'}
        >
          <CheckCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Score Selector */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Оценка</h4>
        <ScoreSelector
          selectedScore={result.score}
          onScoreSelect={(score) => onScoreChange(item.id, score)}
        />
        
        {needsAttention && (
          <div className="flex items-center p-3 bg-warning-50 border border-warning-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-warning-600 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-warning-800">Требует внимания</p>
              <p className="text-warning-700">
                Оценка {result.score} требует уведомления ответственного лица
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2" />
          Комментарий
        </h4>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onBlur={handleCommentBlur}
          placeholder="Добавьте комментарий..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>

      {/* Photos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Camera className="w-4 h-4 mr-2" />
            Фото ({result.photos.length}/{item.maxPhotos})
          </h4>
          
          {result.photos.length < item.maxPhotos && (
            <button
              onClick={() => setShowPhotoUploader(true)}
              className="btn btn-secondary text-sm"
            >
              Добавить фото
            </button>
          )}
        </div>

        {result.photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {result.photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.uri}
                  alt="Фото проверки"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => onPhotoRemove(item.id, photo.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-danger-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Удалить фото"
                >
                  ×
                </button>
                <div className="absolute bottom-2 left-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                  {photo.type === 'before' && 'ДО'}
                  {photo.type === 'after' && 'ПОСЛЕ'}
                  {photo.type === 'general' && 'Общее'}
                </div>
              </div>
            ))}
          </div>
        )}

        {showPhotoUploader && (
          <PhotoUploader
            onPhotoAdd={(photo) => {
              onPhotoAdd(item.id, photo);
              setShowPhotoUploader(false);
            }}
            onCancel={() => setShowPhotoUploader(false)}
            maxPhotos={item.maxPhotos - result.photos.length}
          />
        )}
      </div>

      {/* Responsible Person */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 flex items-center">
          <User className="w-4 h-4 mr-2" />
          Ответственный
        </h4>
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          {item.responsibleRole === 'store_admin' && 'Администратор магазина'}
          {item.responsibleRole === 'curator' && 'Куратор'}
          {item.responsibleRole === 'manager' && 'Менеджер'}
        </div>
      </div>

      {/* Required indicator */}
      {item.isRequired && (
        <div className="text-xs text-gray-500 flex items-center">
          <span className="w-2 h-2 bg-danger-500 rounded-full mr-2"></span>
          Обязательный пункт
        </div>
      )}
    </div>
  );
};
