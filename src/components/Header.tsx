import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { useAuth } from '../store/AuthContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Проверки';
      case '/history':
        return 'История';
      case '/profile':
        return 'Профиль';
      default:
        if (location.pathname.startsWith('/inspection/')) {
          return 'Чек-лист';
        }
        return 'Куратор';
    }
  };

  const showBackButton = location.pathname.startsWith('/inspection/');

  return (
    <header className="bg-white border-b border-gray-200 safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 touch-target"
              aria-label="Назад"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900">
            {getTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 touch-target relative"
            aria-label="Уведомления"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full"></span>
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 touch-target"
            aria-label="Профиль"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
