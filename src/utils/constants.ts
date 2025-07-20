import { Dimensions } from 'react-native';
import { ExpenseCategory, StorageKeys } from '../types';

// API Configuration
export const API_BASE_URL: string = 'https://your-backend-api.com/api'; // Replace with your actual API URL

// App Colors
export const COLORS = {
  primary: '#6366f1',
  secondary: '#f59e0b',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  white: '#ffffff',
  black: '#000000',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  darkGray: '#374151',
  background: '#f9fafb',
  text: '#111827',
  textLight: '#6b7280',
  border: '#e5e7eb',
} as const;

// Font Sizes
export const FONTS = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Screen Dimensions
const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH: number = width;
export const SCREEN_HEIGHT: number = height;

// Expense Categories
export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Personal Care',
  'Others',
] as const;

// Storage Keys
export const STORAGE_KEYS: StorageKeys = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  EXPENSES: 'expenses',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  EXPENSES: {
    GET_ALL: '/expenses',
    GET_BY_ID: (id: string) => `/expenses/${id}`,
    CREATE: '/expenses',
    UPDATE: (id: string) => `/expenses/${id}`,
    DELETE: (id: string) => `/expenses/${id}`,
    UPLOAD_IMAGE: '/expenses/extract-from-image',
    STATS: '/expenses/stats',
    BY_CATEGORY: '/expenses/category',
    BY_DATE_RANGE: '/expenses/date-range',
    SEARCH: '/expenses/search',
    EXPORT: '/expenses/export',
    CATEGORIES: '/expenses/categories',
    BULK_DELETE: '/expenses/bulk-delete',
  },
} as const;

// Image Configuration
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  QUALITY: 0.8,
  MAX_WIDTH: 2000,
  MAX_HEIGHT: 2000,
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png'] as const,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  AMOUNT: {
    MIN: 0.01,
    MAX: 999999.99,
  },
  DESCRIPTION: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 500,
  },
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  API: 'YYYY-MM-DDTHH:mm:ss.sssZ',
} as const;

// Request Timeouts
export const TIMEOUTS = {
  DEFAULT: 10000, // 10 seconds
  IMAGE_UPLOAD: 30000, // 30 seconds
  FILE_DOWNLOAD: 60000, // 60 seconds
} as const;