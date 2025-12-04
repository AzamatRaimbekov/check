import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, History, User } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'dashboard',
      label: 'Главная',
      icon: Home,
      path: '/dashboard',
    },
    {
      id: 'history',
      label: 'История',
      icon: History,
      path: '/history',
    },
    {
      id: 'profile',
      label: 'Профиль',
      icon: User,
      path: '/profile',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 touch-target ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label={tab.label}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-primary-600' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-primary-600' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
