import React from 'react';
import { LogOut, Phone, Mail, Settings, Shield } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useApp } from '../store/AppContext';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { isOnline, lastSyncTime, pendingUploads } = useApp();

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      logout();
    }
  };

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return 'Никогда';
    return new Date(timestamp).toLocaleString('ru-RU');
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      curator: 'Куратор',
      store_admin: 'Администратор магазина',
      manager: 'Менеджер',
      operations_director: 'Операционный директор',
      ceo: 'Генеральный директор',
      hr: 'HR',
      tech_director: 'Технический директор',
      marketing: 'Маркетинг',
      it: 'IT',
      super_admin: 'Супер-администратор',
    };
    return roleLabels[role] || role;
  };

  return (
    <div className="p-4 space-y-6">
      {/* User Info */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-xl font-medium text-primary-700">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600">{getRoleLabel(user?.role || '')}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Mail className="w-5 h-5 mr-3" />
            <span>{user?.email}</span>
          </div>
          {user?.phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="w-5 h-5 mr-3" />
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* App Status */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Статус приложения
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Подключение:</span>
            <span className={`font-medium ${isOnline ? 'text-success-600' : 'text-danger-600'}`}>
              {isOnline ? 'Онлайн' : 'Оффлайн'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Последняя синхронизация:</span>
            <span className="text-sm text-gray-500">
              {formatLastSync(lastSyncTime)}
            </span>
          </div>
          
          {pendingUploads > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Файлов в очереди:</span>
              <span className="font-medium text-warning-600">
                {pendingUploads}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Настройки
        </h3>
        
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">Уведомления</span>
            <span className="text-gray-400">›</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">Геолокация</span>
            <span className="text-gray-400">›</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">Качество фото</span>
            <span className="text-gray-400">›</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">Автосохранение</span>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">О приложении</h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Версия:</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Сборка:</span>
            <span>2025.11.16</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full btn btn-danger flex items-center justify-center"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Выйти
      </button>
    </div>
  );
};
