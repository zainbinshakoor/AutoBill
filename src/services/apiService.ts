import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS, TIMEOUTS } from '../utils/constants';
import { ApiResponse } from '../types';

// Define error response structure
interface ErrorResponse {
  message?: string;
  error?: string;
  errors?: string[];
  statusCode?: number;
}

// Enhanced ApiError interface
export interface ApiError extends Error {
  status?: number;
  response?: AxiosResponse<ErrorResponse>;
  isAxiosError?: boolean;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUTS.DEFAULT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      try {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
        // Navigate to login screen (you can implement this with navigation ref)
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }
    
    // Transform error for consistent handling
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || 
                        errorData?.error || 
                        error.message || 
                        'An unexpected error occurred';
    
    const apiError: ApiError = new Error(errorMessage);
    apiError.status = error.response?.status;
    apiError.response = error.response;
    apiError.isAxiosError = true;
    
    return Promise.reject(apiError);
  }
);

// Generic API methods
export const apiService = {
  // GET request
  get: async <T = any>(url: string, params: Record<string, any> = {}): Promise<T> => {
    try {
      const response = await apiClient.get<T>(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async <T = any>(url: string, data: any = {}): Promise<T> => {
    try {
      const response = await apiClient.post<T>(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async <T = any>(url: string, data: any = {}): Promise<T> => {
    try {
      const response = await apiClient.put<T>(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async <T = any>(url: string, data: any = {}): Promise<T> => {
    try {
      const response = await apiClient.patch<T>(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async <T = any>(url: string): Promise<T> => {
    try {
      const response = await apiClient.delete<T>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload file (multipart/form-data)
  upload: async <T = any>(url: string, formData: FormData): Promise<T> => {
    try {
      const response = await apiClient.post<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: TIMEOUTS.IMAGE_UPLOAD,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Download file
  download: async (url: string, params: Record<string, any> = {}): Promise<Blob> => {
    try {
      const response = await apiClient.get(url, {
        params,
        responseType: 'blob',
        timeout: TIMEOUTS.FILE_DOWNLOAD,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Custom request with full config
  request: async <T = any>(config: any): Promise<T> => {
    try {
      const response = await apiClient.request<T>(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Set default timeout
  setTimeout: (timeout: number): void => {
    apiClient.defaults.timeout = timeout;
  },

  // Set base URL
  setBaseURL: (baseURL: string): void => {
    apiClient.defaults.baseURL = baseURL;
  },

  // Set default headers
  setDefaultHeaders: (headers: Record<string, string>): void => {
    Object.assign(apiClient.defaults.headers.common, headers);
  },

  // Remove default headers
  removeDefaultHeaders: (headerNames: string[]): void => {
    headerNames.forEach(name => {
      delete apiClient.defaults.headers.common[name];
    });
  },

  // Get current instance (for advanced usage)
  getInstance: (): AxiosInstance => apiClient,

  // Helper method to check if error is API error
  isApiError: (error: any): error is ApiError => {
    return error && typeof error === 'object' && 'isAxiosError' in error;
  },

  // Helper method to extract error message
  getErrorMessage: (error: any): string => {
    if (apiService.isApiError(error)) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unexpected error occurred';
  },

  // Helper method to get error status
  getErrorStatus: (error: any): number | undefined => {
    if (apiService.isApiError(error)) {
      return error.status;
    }
    return undefined;
  },
};

export default apiClient;