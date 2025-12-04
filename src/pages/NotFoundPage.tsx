import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Страница не найдена
        </h1>
        <p className="text-gray-600 mb-8">
          Запрашиваемая страница не существует или была перемещена.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full btn btn-primary flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            На главную
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full btn btn-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Назад
          </button>
        </div>
      </div>
    </div>
  );
};
