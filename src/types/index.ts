// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Expense Types
export interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  merchant?: string;
  date: string;
  imageUrl?: string;
  extractedData?: ExtractedExpenseData;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  title: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  merchant?: string;
  date: string;
  imageUrl?: string;
  extractedData?: ExtractedExpenseData;
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {
  id: string;
}

export interface ExtractedExpenseData {
  title?: string;
  description?: string;
  amount?: number;
  merchant?: string;
  category?: ExpenseCategory;
  date?: string;
  confidence: number;
}

export type ExpenseCategory = 
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Healthcare'
  | 'Travel'
  | 'Education'
  | 'Personal Care'
  | 'Others';

// Image Types
export interface ImageData {
  uri: string;
  type?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ImageUploadResponse {
  success: boolean;
  extractedData?: ExtractedExpenseData;
  message?: string;
  error?: string;
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Camera: { expense?: Expense } | undefined;
  ExpenseDetail: { expense: Expense };
};

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ExpenseFormData {
  title: string;
  description: string;
  amount: string;
  category: ExpenseCategory;
  merchant: string;
  date: string;
}

// Validation Types
export interface ValidationErrors {
  [key: string]: string | null;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  expenses: Expense[];
  isAuthenticated: boolean;
  initializing: boolean;
  login: (email: string, password: string) => Promise<ApiResponse>;
  signup: (name: string, email: string, password: string) => Promise<ApiResponse>;
  logout: () => Promise<void>;
  uploadExpenseImage: (imageUri: string) => Promise<ImageUploadResponse>;
  addExpense: (expenseData: CreateExpenseRequest) => Promise<ApiResponse>;
  updateExpense: (expenseId: string, expenseData: Partial<CreateExpenseRequest>) => Promise<ApiResponse>;
  deleteExpense: (expenseId: string) => Promise<ApiResponse>;
  refreshExpenses: () => Promise<void>;
  getTotalExpenses: () => number;
  getExpensesByCategory: (category: ExpenseCategory) => Expense[];
}

// Component Props Types
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: any;
  textStyle?: any;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string | null;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  disabled?: boolean;
  required?: boolean;
  style?: any;
  inputStyle?: any;
  labelStyle?: any;
  containerStyle?: any;
}

export interface ExpenseCardProps {
  expense: Expense;
  onPress?: (expense: Expense) => void;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expenseId: string) => void;
  showActions?: boolean;
}

// API Service Types
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ExpenseFilters extends PaginationParams {
  category?: ExpenseCategory;
  startDate?: string;
  endDate?: string;
  query?: string;
}

export interface ExpenseStatsResponse {
  totalExpenses: number;
  totalAmount: number;
  categoryBreakdown: Array<{
    category: ExpenseCategory;
    amount: number;
    count: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
}

// Storage Types
export interface StorageKeys {
  USER_TOKEN: string;
  USER_DATA: string;
  EXPENSES: string;
}

// Error Types - Fixed with proper response typing
export interface ErrorResponse {
  message?: string;
  error?: string;
  errors?: string[];
  statusCode?: number;
}

export interface ApiError extends Error {
  status?: number;
  response?: {
    data?: ErrorResponse;
    status?: number;
    statusText?: string;
  };
  isAxiosError?: boolean;
}

// Screen Props Types (using proper navigation typing)
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;

export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
export type SignupScreenRouteProp = RouteProp<RootStackParamList, 'Signup'>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type CameraScreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;

export interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
}

export interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
  route: SignupScreenRouteProp;
}

export interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

export interface CameraScreenProps {
  navigation: CameraScreenNavigationProp;
  route: CameraScreenRouteProp;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Form State Types
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Theme Types (for future use)
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
}