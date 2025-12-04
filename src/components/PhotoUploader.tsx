import React, { useRef } from 'react';
import { Camera, Image, X } from 'lucide-react';
import type { Photo } from '../types';

interface PhotoUploaderProps {
  onPhotoAdd: (photo: Photo) => void;
  onCancel: () => void;
  maxPhotos: number;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onPhotoAdd,
  onCancel,
  maxPhotos,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Размер файла не должен превышать 10MB');
      return;
    }

    // Create photo object
    const photo: Photo = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uri: URL.createObjectURL(file),
      type: 'general',
      timestamp: new Date().toISOString(),
      compressed: false,
      uploaded: false,
      size: file.size,
    };

    onPhotoAdd(photo);
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleGalleryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Добавить фото</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-gray-600">
          Можно добавить еще {maxPhotos} {maxPhotos === 1 ? 'фото' : 'фотографий'}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleCameraClick}
            className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Camera className="w-6 h-6 text-gray-600" />
            <span className="font-medium text-gray-700">Сделать фото</span>
          </button>

          <button
            onClick={handleGalleryClick}
            className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Image className="w-6 h-6 text-gray-600" />
            <span className="font-medium text-gray-700">Выбрать из галереи</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={onCancel}
          className="w-full btn btn-secondary"
        >
          Отмена
        </button>
      </div>
    </div>
  );
};
