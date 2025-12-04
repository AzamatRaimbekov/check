import React from 'react';
import { WifiOff, Upload, AlertCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const StatusBar: React.FC = () => {
  const { isOnline, syncInProgress, pendingUploads } = useApp();

  if (isOnline && !syncInProgress && pendingUploads === 0) {
    return null; // Hide status bar when everything is normal
  }

  return (
    <div className="bg-gray-800 text-white text-xs px-4 py-1 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {!isOnline && (
          <>
            <WifiOff className="w-3 h-3" />
            <span>Оффлайн режим</span>
          </>
        )}
        
        {isOnline && syncInProgress && (
          <>
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            <span>Синхронизация...</span>
          </>
        )}
        
        {pendingUploads > 0 && (
          <>
            <Upload className="w-3 h-3" />
            <span>{pendingUploads} файлов в очереди</span>
          </>
        )}
      </div>
      
      {!isOnline && (
        <div className="flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>Данные сохраняются локально</span>
        </div>
      )}
    </div>
  );
};
