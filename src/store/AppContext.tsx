import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, OfflineQueue } from '../types';

interface AppContextType extends AppState {
  setOnlineStatus: (isOnline: boolean) => void;
  setSyncStatus: (inProgress: boolean) => void;
  updateLastSyncTime: () => void;
  addToOfflineQueue: (item: Omit<OfflineQueue, 'id' | 'timestamp' | 'retryCount'>) => void;
  removeFromOfflineQueue: (id: string) => void;
  getOfflineQueue: () => OfflineQueue[];
  incrementPendingUploads: () => void;
  decrementPendingUploads: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_SYNC_STATUS'; payload: boolean }
  | { type: 'UPDATE_LAST_SYNC_TIME'; payload: string }
  | { type: 'ADD_TO_OFFLINE_QUEUE'; payload: OfflineQueue }
  | { type: 'REMOVE_FROM_OFFLINE_QUEUE'; payload: string }
  | { type: 'INCREMENT_PENDING_UPLOADS' }
  | { type: 'DECREMENT_PENDING_UPLOADS' };

const appReducer = (state: AppState & { offlineQueue: OfflineQueue[] }, action: AppAction) => {
  switch (action.type) {
    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        isOnline: action.payload,
      };
    case 'SET_SYNC_STATUS':
      return {
        ...state,
        syncInProgress: action.payload,
      };
    case 'UPDATE_LAST_SYNC_TIME':
      return {
        ...state,
        lastSyncTime: action.payload,
      };
    case 'ADD_TO_OFFLINE_QUEUE':
      return {
        ...state,
        offlineQueue: [...state.offlineQueue, action.payload],
      };
    case 'REMOVE_FROM_OFFLINE_QUEUE':
      return {
        ...state,
        offlineQueue: state.offlineQueue.filter(item => item.id !== action.payload),
      };
    case 'INCREMENT_PENDING_UPLOADS':
      return {
        ...state,
        pendingUploads: state.pendingUploads + 1,
      };
    case 'DECREMENT_PENDING_UPLOADS':
      return {
        ...state,
        pendingUploads: Math.max(0, state.pendingUploads - 1),
      };
    default:
      return state;
  }
};

const initialState: AppState & { offlineQueue: OfflineQueue[] } = {
  isOnline: navigator.onLine,
  syncInProgress: false,
  lastSyncTime: localStorage.getItem('lastSyncTime'),
  pendingUploads: 0,
  offlineQueue: [],
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load offline queue from localStorage
  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem('offlineQueue');
      if (savedQueue) {
        const queue: OfflineQueue[] = JSON.parse(savedQueue);
        queue.forEach(item => {
          dispatch({ type: 'ADD_TO_OFFLINE_QUEUE', payload: item });
        });
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }, []);

  // Save offline queue to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('offlineQueue', JSON.stringify(state.offlineQueue));
  }, [state.offlineQueue]);

  const setOnlineStatus = (isOnline: boolean) => {
    dispatch({ type: 'SET_ONLINE_STATUS', payload: isOnline });
  };

  const setSyncStatus = (inProgress: boolean) => {
    dispatch({ type: 'SET_SYNC_STATUS', payload: inProgress });
  };

  const updateLastSyncTime = () => {
    const now = new Date().toISOString();
    localStorage.setItem('lastSyncTime', now);
    dispatch({ type: 'UPDATE_LAST_SYNC_TIME', payload: now });
  };

  const addToOfflineQueue = (item: Omit<OfflineQueue, 'id' | 'timestamp' | 'retryCount'>) => {
    const queueItem: OfflineQueue = {
      ...item,
      id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };
    dispatch({ type: 'ADD_TO_OFFLINE_QUEUE', payload: queueItem });
  };

  const removeFromOfflineQueue = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_OFFLINE_QUEUE', payload: id });
  };

  const getOfflineQueue = () => state.offlineQueue;

  const incrementPendingUploads = () => {
    dispatch({ type: 'INCREMENT_PENDING_UPLOADS' });
  };

  const decrementPendingUploads = () => {
    dispatch({ type: 'DECREMENT_PENDING_UPLOADS' });
  };

  const value: AppContextType = {
    isOnline: state.isOnline,
    syncInProgress: state.syncInProgress,
    lastSyncTime: state.lastSyncTime,
    pendingUploads: state.pendingUploads,
    setOnlineStatus,
    setSyncStatus,
    updateLastSyncTime,
    addToOfflineQueue,
    removeFromOfflineQueue,
    getOfflineQueue,
    incrementPendingUploads,
    decrementPendingUploads,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
