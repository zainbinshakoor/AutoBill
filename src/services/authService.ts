import { apiService } from './apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, API_ENDPOINTS } from '../utils/constants';
import { 
  LoginRequest, 
  SignupRequest, 
  AuthResponse, 
  User, 
  ApiResponse 
} from '../types';

export const authService = {
  // User login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const loginData: LoginRequest = { email, password };
      const response = await apiService.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        loginData
      );

      // Store token and user data
      if (response.success && response.token) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, response.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // User signup
  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const signupData: SignupRequest = { name, email, password };
      const response = await apiService.post<AuthResponse>(
        API_ENDPOINTS.AUTH.SIGNUP,
        signupData
      );

      // Store token and user data
      if (response.success && response.token) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, response.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // User logout
  logout: async (): Promise<void> => {
    try {
      // Call logout API (optional)
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with local logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local storage
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },

  // Get current user from storage
  getCurrentUser: async (): Promise<{ token: string; user: User } | null> => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      if (token && userData) {
        return {
          token,
          user: JSON.parse(userData) as User,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH);
      
      if (response.success && response.token) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const response = await apiService.put<ApiResponse<User>>(
        API_ENDPOINTS.AUTH.PROFILE,
        userData
      );
      
      if (response.success && response.data) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse> => {
    try {
      const response = await apiService.put<ApiResponse>(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        {
          currentPassword,
          newPassword,
        }
      );
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await apiService.post<ApiResponse>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email }
      );
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse> => {
    try {
      const response = await apiService.post<ApiResponse>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        {
          token,
          newPassword,
        }
      );
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Check if token is valid
  validateToken: async (): Promise<boolean> => {
    try {
      const response = await apiService.get<ApiResponse>(API_ENDPOINTS.AUTH.PROFILE);
      return response.success;
    } catch (error) {
      return false;
    }
  },

  // Clear all stored auth data
  clearAuthData: async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },
};