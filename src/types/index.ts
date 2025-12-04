// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export type UserRole = 
  | 'curator' 
  | 'store_admin' 
  | 'manager' 
  | 'operations_director' 
  | 'ceo' 
  | 'hr' 
  | 'tech_director' 
  | 'marketing' 
  | 'it' 
  | 'super_admin';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Store Types
export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Checklist Template Types
export interface ChecklistTemplate {
  id: string;
  title: string;
  description?: string;
  version: string;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  number: number;
  zone: string;
  description: string;
  action: string;
  responsibleRole: UserRole;
  notifyOnScoreLessOrEqual: number;
  maxPhotos: number;
  isRequired: boolean;
}

// Inspection Types
export interface InspectionInstance {
  id: string;
  templateId: string;
  storeId: string;
  curatorId: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  items: ItemResult[];
  totalScore: number;
  averageScore: number;
  status: InspectionStatus;
  signature?: string;
  geolocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  syncStatus: SyncStatus;
  createdAt: string;
  updatedAt: string;
}

export type InspectionStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled';
export type SyncStatus = 'synced' | 'pending' | 'failed' | 'offline';

export interface ItemResult {
  itemId: string;
  score: number | null;
  comments: string;
  photos: Photo[];
  responsibleUserId?: string;
  isCompleted: boolean;
  notified: boolean;
  completedAt?: string;
}

export interface Photo {
  id: string;
  uri: string;
  type: PhotoType;
  timestamp: string;
  compressed?: boolean;
  uploaded?: boolean;
  size?: number;
}

export type PhotoType = 'before' | 'after' | 'general';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface InspectionFilters {
  status?: InspectionStatus[];
  dateFrom?: string;
  dateTo?: string;
  storeId?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export type NotificationType = 
  | 'inspection_assigned' 
  | 'low_score_alert' 
  | 'inspection_completed' 
  | 'system_update';

// Export/Report Types
export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf';
  dateFrom: string;
  dateTo: string;
  storeIds?: string[];
  includePhotos: boolean;
}

export interface ReportData {
  inspections: InspectionInstance[];
  summary: {
    totalInspections: number;
    averageScore: number;
    completionRate: number;
    criticalIssues: number;
  };
  storePerformance: Array<{
    storeId: string;
    storeName: string;
    averageScore: number;
    inspectionCount: number;
    criticalIssues: number;
  }>;
}

// Offline Storage Types
export interface OfflineQueue {
  id: string;
  type: 'create' | 'update' | 'delete';
  endpoint: string;
  data: any;
  timestamp: string;
  retryCount: number;
}

// App State Types
export interface AppState {
  isOnline: boolean;
  syncInProgress: boolean;
  lastSyncTime: string | null;
  pendingUploads: number;
}

// Component Props Types
export interface ScoreButtonProps {
  score: number;
  selected: boolean;
  onClick: (score: number) => void;
  disabled?: boolean;
}

export interface ChecklistItemCardProps {
  item: ChecklistItem;
  result: ItemResult;
  onScoreChange: (itemId: string, score: number) => void;
  onCommentChange: (itemId: string, comment: string) => void;
  onPhotoAdd: (itemId: string, photo: Photo) => void;
  onPhotoRemove: (itemId: string, photoId: string) => void;
  onToggleComplete: (itemId: string) => void;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Constants
export const SCORE_COLORS = {
  1: 'danger',
  2: 'warning', 
  3: 'yellow',
  4: 'blue',
  5: 'success'
} as const;

export const SCORE_LABELS = {
  1: 'Критично',
  2: 'Плохо',
  3: 'Удовлетворительно',
  4: 'Хорошо',
  5: 'Отлично'
} as const;
