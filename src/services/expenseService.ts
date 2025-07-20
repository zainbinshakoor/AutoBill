import { apiService } from './apiService';
import { API_ENDPOINTS } from '../utils/constants';
import { 
  Expense, 
  CreateExpenseRequest, 
  UpdateExpenseRequest,
  ApiResponse, 
  ExpenseFilters,
  ExpenseStatsResponse,
  ExpenseCategory,
  ImageUploadResponse,
  PaginationParams
} from '../types';

export const expenseService = {
  // Get all expenses
  getExpenses: async (filters?: ExpenseFilters): Promise<ApiResponse<Expense[]>> => {
    try {
      const response = await apiService.get<ApiResponse<Expense[]>>(
        API_ENDPOINTS.EXPENSES.GET_ALL,
        filters
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single expense by ID
  getExpenseById: async (expenseId: string): Promise<ApiResponse<Expense>> => {
    try {
      const response = await apiService.get<ApiResponse<Expense>>(
        API_ENDPOINTS.EXPENSES.GET_BY_ID(expenseId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new expense
  createExpense: async (expenseData: CreateExpenseRequest): Promise<ApiResponse<Expense>> => {
    try {
      const response = await apiService.post<ApiResponse<Expense>>(
        API_ENDPOINTS.EXPENSES.CREATE,
        expenseData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update expense
  updateExpense: async (
    expenseId: string, 
    expenseData: Partial<CreateExpenseRequest>
  ): Promise<ApiResponse<Expense>> => {
    try {
      const response = await apiService.put<ApiResponse<Expense>>(
        API_ENDPOINTS.EXPENSES.UPDATE(expenseId),
        expenseData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete expense
  deleteExpense: async (expenseId: string): Promise<ApiResponse> => {
    try {
      const response = await apiService.delete<ApiResponse>(
        API_ENDPOINTS.EXPENSES.DELETE(expenseId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload image and extract expense data
  uploadAndExtractImage: async (imageUri: string): Promise<ImageUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'expense-receipt.jpg',
      } as any);

      const response = await apiService.upload<ImageUploadResponse>(
        API_ENDPOINTS.EXPENSES.UPLOAD_IMAGE,
        formData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get expense statistics
  getExpenseStats: async (
    startDate?: string, 
    endDate?: string
  ): Promise<ApiResponse<ExpenseStatsResponse>> => {
    try {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await apiService.get<ApiResponse<ExpenseStatsResponse>>(
        API_ENDPOINTS.EXPENSES.STATS,
        params
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get expenses by category
  getExpensesByCategory: async (
    category: ExpenseCategory, 
    pagination?: PaginationParams
  ): Promise<ApiResponse<Expense[]>> => {
    try {
      const params = {
        category,
        ...pagination,
      };

      const response = await apiService.get<ApiResponse<Expense[]>>(
        API_ENDPOINTS.EXPENSES.BY_CATEGORY,
        params
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get expenses by date range
  getExpensesByDateRange: async (
    startDate: string,
    endDate: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<Expense[]>> => {
    try {
      const params = {
        startDate,
        endDate,
        ...pagination,
      };

      const response = await apiService.get<ApiResponse<Expense[]>>(
        API_ENDPOINTS.EXPENSES.BY_DATE_RANGE,
        params
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search expenses
  searchExpenses: async (
    query: string, 
    pagination?: PaginationParams
  ): Promise<ApiResponse<Expense[]>> => {
    try {
      const params = {
        q: query,
        ...pagination,
      };

      const response = await apiService.get<ApiResponse<Expense[]>>(
        API_ENDPOINTS.EXPENSES.SEARCH,
        params
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export expenses
  exportExpenses: async (
    format: 'csv' | 'xlsx' | 'pdf' = 'csv',
    startDate?: string,
    endDate?: string
  ): Promise<Blob> => {
    try {
      const params: Record<string, string> = { format };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await apiService.download(
        API_ENDPOINTS.EXPENSES.EXPORT,
        params
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get expense categories
  getCategories: async (): Promise<ApiResponse<ExpenseCategory[]>> => {
    try {
      const response = await apiService.get<ApiResponse<ExpenseCategory[]>>(
        API_ENDPOINTS.EXPENSES.CATEGORIES
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Bulk delete expenses
  bulkDeleteExpenses: async (expenseIds: string[]): Promise<ApiResponse> => {
    try {
      const response = await apiService.post<ApiResponse>(
        API_ENDPOINTS.EXPENSES.BULK_DELETE,
        { expenseIds }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get expenses summary
  getExpensesSummary: async (
    period: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Promise<ApiResponse<{
    totalAmount: number;
    totalCount: number;
    averageAmount: number;
    topCategory: ExpenseCategory;
  }>> => {
    try {
      const response = await apiService.get<ApiResponse<any>>(
        `${API_ENDPOINTS.EXPENSES.GET_ALL}/summary`,
        { period }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Duplicate expense
  duplicateExpense: async (expenseId: string): Promise<ApiResponse<Expense>> => {
    try {
      const response = await apiService.post<ApiResponse<Expense>>(
        `${API_ENDPOINTS.EXPENSES.GET_BY_ID(expenseId)}/duplicate`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};