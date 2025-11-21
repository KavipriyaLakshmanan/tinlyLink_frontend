export interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  totalClicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export interface CreateLinkRequest {
  originalUrl: string;
  customCode?: string;
}

export interface CreateLinkResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
}

export interface LinkStats {
  shortCode: string;
  originalUrl: string;
  totalClicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export interface ApiError {
  error: string;
  existingLink?: {
    shortCode: string;
    shortUrl: string;
    originalUrl: string;
  };
}

export interface AxiosErrorResponse {
  response?: {
    data: ApiError;
    status: number;
    statusText: string;
  };
  message: string;
}

// Toast Manager
export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastManagerProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export interface DuplicateURLError {
  error: string;
  existingLink: {
    shortCode: string;
    shortUrl: string;
    originalUrl: string;
  };
}
export interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}