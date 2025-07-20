// import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// import { authService } from '../services/authService';
// import { expenseService } from '../services/expenseService';
// import { 
//   User, 
//   Expense, 
//   AuthContextType, 
//   ApiResponse, 
//   ImageUploadResponse,
//   CreateExpenseRequest,
//   ExpenseCategory
// } from '../types';

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [initializing, setInitializing] = useState<boolean>(true);

//   // Check if user is already logged in when app starts
//   useEffect(() => {
//     checkAuthState();
//   }, []);

//   const checkAuthState = async (): Promise<void> => {
//     try {
//       const userData = await authService.getCurrentUser();
//       if (userData) {
//         setUser(userData.user);
//         setIsAuthenticated(true);
//         // Load user's expenses
//         await loadExpenses();
//       }
//     } catch (error) {
//       console.error('Error checking auth state:', error);
//     } finally {
//       setInitializing(false);
//     }
//   };

//   // Login function
//   const login = async (email: string, password: string): Promise<ApiResponse> => {
//     setLoading(true);
//     try {
//       const response = await authService.login(email, password);
      
//       if (response.success) {
//         setUser(response.user);
//         setIsAuthenticated(true);
//         await loadExpenses();
//         return { success: true };
//       } else {
//         return { success: false, error: response.message || 'Login failed' };
//       }
//     } catch (error: any) {
//       return { success: false, error: error.message || 'An unexpected error occurred' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Signup function
//   const signup = async (name: string, email: string, password: string): Promise<ApiResponse> => {
//     setLoading(true);
//     try {
//       const response = await authService.signup(name, email, password);
      
//       if (response.success) {
//         setUser(response.user);
//         setIsAuthenticated(true);
//         return { success: true };
//       } else {
//         return { success: false, error: response.message || 'Signup failed' };
//       }
//     } catch (error: any) {
//       return { success: false, error: error.message || 'An unexpected error occurred' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logout function
//   const logout = async (): Promise<void> => {
//     setLoading(true);
//     try {
//       await authService.logout();
//     } catch (error) {
//       console.error('Logout error:', error);
//       // Continue with local logout even if API call fails
//     } finally {
//       // Clear all local state
//       setUser(null);
//       setIsAuthenticated(false);
//       setExpenses([]);
//       setLoading(false);
//     }
//   };

//   // Load expenses
//   const loadExpenses = async (): Promise<void> => {
//     try {
//       const response = await expenseService.getExpenses();
//       if (response.success && response.data) {
//         setExpenses(response.data);
//       } else {
//         setExpenses([]);
//       }
//     } catch (error) {
//       console.error('Error loading expenses:', error);
//       setExpenses([]);
//     }
//   };

//   // Upload image and extract expense data
//   const uploadExpenseImage = async (imageUri: string): Promise<ImageUploadResponse> => {
//     setLoading(true);
//     try {
//       const response = await expenseService.uploadAndExtractImage(imageUri);
      
//       if (response.success) {
//         return { 
//           success: true, 
//           extractedData: response.extractedData,
//           message: 'Image processed successfully'
//         };
//       } else {
//         return { 
//           success: false, 
//           error: response.error || 'Failed to process image'
//         };
//       }
//     } catch (error: any) {
//       return { 
//         success: false, 
//         error: error.message || 'Failed to upload and process image'
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add new expense
//   const addExpense = async (expenseData: CreateExpenseRequest): Promise<ApiResponse> => {
//     setLoading(true);
//     try {
//       const response = await expenseService.createExpense(expenseData);
      
//       if (response.success && response.data) {
//         // Add new expense to the beginning of the list
//         setExpenses(prev => [response.data!, ...prev]);
//         return { 
//           success: true, 
//           message: 'Expense added successfully' 
//         };
//       } else {
//         return { 
//           success: false, 
//           error: response.message || 'Failed to add expense' 
//         };
//       }
//     } catch (error: any) {
//       return { 
//         success: false, 
//         error: error.message || 'Failed to add expense'
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update expense
//   const updateExpense = async (
//     expenseId: string, 
//     expenseData: Partial<CreateExpenseRequest>
//   ): Promise<ApiResponse> => {
//     setLoading(true);
//     try {
//       const response = await expenseService.updateExpense(expenseId, expenseData);
      
//       if (response.success && response.data) {
//         // Update expense in the list
//         setExpenses(prev => 
//           prev.map(expense => 
//             expense.id === expenseId ? { ...expense, ...response.data } : expense
//           )
//         );
//         return { 
//           success: true, 
//           message: 'Expense updated successfully'
//         };
//       } else {
//         return { 
//           success: false, 
//           error: response.message || 'Failed to update expense' 
//         };
//       }
//     } catch (error: any) {
//       return { 
//         success: false, 
//         error: error.message || 'Failed to update expense'
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete expense
//   const deleteExpense = async (expenseId: string): Promise<ApiResponse> => {
//     setLoading(true);
//     try {
//       const response = await expenseService.deleteExpense(expenseId);
      
//       if (response.success) {
//         // Remove expense from the list
//         setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
//         return { 
//           success: true, 
//           message: 'Expense deleted successfully'
//         };
//       } else {
//         return { 
//           success: false, 
//           error: response.message || 'Failed to delete expense' 
//         };
//       }
//     } catch (error: any) {
//       return { 
//         success: false, 
//         error: error.message || 'Failed to delete expense'
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Refresh expenses
//   const refreshExpenses = async (): Promise<void> => {
//     await loadExpenses();
//   };

//   // Get total expenses
//   const getTotalExpenses = (): number => {
//     return expenses.reduce((total, expense) => total + expense.amount, 0);
//   };

//   // Get expenses by category
//   const getExpensesByCategory = (category: ExpenseCategory): Expense[] => {
//     return expenses.filter(expense => expense.category === category);
//   };

//   // Get expenses count
//   const getExpensesCount = (): number => {
//     return expenses.length;
//   };

//   // Get current month expenses
//   const getCurrentMonthExpenses = (): Expense[] => {
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth();
//     const currentYear = currentDate.getFullYear();
    
//     return expenses.filter(expense => {
//       const expenseDate = new Date(expense.date);
//       return expenseDate.getMonth() === currentMonth && 
//              expenseDate.getFullYear() === currentYear;
//     });
//   };

//   // Get current month total
//   const getCurrentMonthTotal = (): number => {
//     const currentMonthExpenses = getCurrentMonthExpenses();
//     return currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
//   };

//   // Get recent expenses (last 10)
//   const getRecentExpenses = (count: number = 10): Expense[] => {
//     return expenses
//       .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//       .slice(0, count);
//   };

//   // Get expenses by date range
//   const getExpensesByDateRange = (startDate: string, endDate: string): Expense[] => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
    
//     return expenses.filter(expense => {
//       const expenseDate = new Date(expense.date);
//       return expenseDate >= start && expenseDate <= end;
//     });
//   };

//   // Get category summary
//   const getCategorySummary = (): Array<{
//     category: ExpenseCategory;
//     total: number;
//     count: number;
//     percentage: number;
//   }> => {
//     const totalAmount = getTotalExpenses();
//     const categoryMap = new Map<ExpenseCategory, { total: number; count: number }>();
    
//     expenses.forEach(expense => {
//       const existing = categoryMap.get(expense.category) || { total: 0, count: 0 };
//       categoryMap.set(expense.category, {
//         total: existing.total + expense.amount,
//         count: existing.count + 1,
//       });
//     });
    
//     return Array.from(categoryMap.entries()).map(([category, data]) => ({
//       category,
//       total: data.total,
//       count: data.count,
//       percentage: totalAmount > 0 ? (data.total / totalAmount) * 100 : 0,
//     }));
//   };

//   // Search expenses
//   const searchExpenses = (query: string): Expense[] => {
//     const lowercaseQuery = query.toLowerCase();
//     return expenses.filter(expense => 
//       expense.title.toLowerCase().includes(lowercaseQuery) ||
//       expense.description.toLowerCase().includes(lowercaseQuery) ||
//       expense.category.toLowerCase().includes(lowercaseQuery) ||
//       (expense.merchant && expense.merchant.toLowerCase().includes(lowercaseQuery))
//     );
//   };

//   // Update user profile
//   const updateUserProfile = async (userData: Partial<User>): Promise<ApiResponse> => {
//     setLoading(true);
//     try {
//       const response = await authService.updateProfile(userData);
      
//       if (response.success && response.data) {
//         setUser(response.data);
//         return { 
//           success: true, 
//           message: 'Profile updated successfully'
//         };
//       } else {
//         return { 
//           success: false, 
//           error: response.message || 'Failed to update profile' 
//         };
//       }
//     } catch (error: any) {
//       return { 
//         success: false, 
//         error: error.message || 'Failed to update profile'
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Change password
//   const changePassword = async (currentPassword: string, newPassword: string): Promise<ApiResponse> => {
//     setLoading(true);
//     try {
//       const response = await authService.changePassword(currentPassword, newPassword);
      
//       if (response.success) {
//         return { 
//           success: true, 
//           message: 'Password changed successfully'
//         };
//       } else {
//         return { 
//           success: false, 
//           error: response.message || 'Failed to change password' 
//         };
//       }
//     } catch (error: any) {
//       return { 
//         success: false, 
//         error: error.message || 'Failed to change password'
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const value: AuthContextType = {
//     // State
//     user,
//     loading,
//     expenses,
//     isAuthenticated,
//     initializing,
    
//     // Auth functions
//     login,
//     signup,
//     logout,
    
//     // Expense functions
//     uploadExpenseImage,
//     addExpense,
//     updateExpense,
//     deleteExpense,
//     refreshExpenses,
    
//     // Utility functions
//     getTotalExpenses,
//     getExpensesByCategory,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // Additional hooks for specific use cases
// export const useExpenses = () => {
//   const { 
//     expenses, 
//     loading, 
//     addExpense, 
//     updateExpense, 
//     deleteExpense, 
//     refreshExpenses 
//   } = useAuth();
  
//   return {
//     expenses,
//     loading,
//     addExpense,
//     updateExpense,
//     deleteExpense,
//     refreshExpenses,
//   };
// };

// export const useExpenseStats = () => {
//   const { expenses } = useAuth();
  
//   const getTotalExpenses = (): number => {
//     return expenses.reduce((total, expense) => total + expense.amount, 0);
//   };

//   const getExpensesCount = (): number => {
//     return expenses.length;
//   };

//   const getCurrentMonthExpenses = (): Expense[] => {
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth();
//     const currentYear = currentDate.getFullYear();
    
//     return expenses.filter(expense => {
//       const expenseDate = new Date(expense.date);
//       return expenseDate.getMonth() === currentMonth && 
//              expenseDate.getFullYear() === currentYear;
//     });
//   };

//   const getCurrentMonthTotal = (): number => {
//     const currentMonthExpenses = getCurrentMonthExpenses();
//     return currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
//   };

//   const getCategorySummary = (): Array<{
//     category: ExpenseCategory;
//     total: number;
//     count: number;
//     percentage: number;
//   }> => {
//     const totalAmount = getTotalExpenses();
//     const categoryMap = new Map<ExpenseCategory, { total: number; count: number }>();
    
//     expenses.forEach(expense => {
//       const existing = categoryMap.get(expense.category) || { total: 0, count: 0 };
//       categoryMap.set(expense.category, {
//         total: existing.total + expense.amount,
//         count: existing.count + 1,
//       });
//     });
    
//     return Array.from(categoryMap.entries()).map(([category, data]) => ({
//       category,
//       total: data.total,
//       count: data.count,
//       percentage: totalAmount > 0 ? (data.total / totalAmount) * 100 : 0,
//     }));
//   };

//   return {
//     getTotalExpenses,
//     getExpensesCount,
//     getCurrentMonthExpenses,
//     getCurrentMonthTotal,
//     getCategorySummary,
//   };
// };
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  User, 
  Expense, 
  AuthContextType, 
  ApiResponse, 
  ImageUploadResponse,
  CreateExpenseRequest,
  ExpenseCategory
} from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// Mock expenses data
const mockExpenses: Expense[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    description: 'Weekly groceries at Walmart',
    amount: 85.50,
    category: 'Food & Dining',
    merchant: 'Walmart',
    date: '2024-01-15',
    userId: '1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Gas Station',
    description: 'Fuel for car',
    amount: 45.00,
    category: 'Transportation',
    merchant: 'Shell',
    date: '2024-01-14',
    userId: '1',
    createdAt: '2024-01-14T15:20:00Z',
    updatedAt: '2024-01-14T15:20:00Z',
  },
  {
    id: '3',
    title: 'Coffee Shop',
    description: 'Morning coffee and pastry',
    amount: 12.75,
    category: 'Food & Dining',
    merchant: 'Starbucks',
    date: '2024-01-13',
    userId: '1',
    createdAt: '2024-01-13T08:15:00Z',
    updatedAt: '2024-01-13T08:15:00Z',
  },
  {
    id: '4',
    title: 'Movie Tickets',
    description: 'Weekend movie with friends',
    amount: 28.00,
    category: 'Entertainment',
    merchant: 'AMC Theaters',
    date: '2024-01-12',
    userId: '1',
    createdAt: '2024-01-12T19:45:00Z',
    updatedAt: '2024-01-12T19:45:00Z',
  },
  {
    id: '5',
    title: 'Pharmacy',
    description: 'Prescription medication',
    amount: 35.20,
    category: 'Healthcare',
    merchant: 'CVS Pharmacy',
    date: '2024-01-11',
    userId: '1',
    createdAt: '2024-01-11T14:30:00Z',
    updatedAt: '2024-01-11T14:30:00Z',
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);

  // Check if user is already logged in when app starts
  useEffect(() => {
    // Simulate checking stored auth state
    setTimeout(() => {
      setInitializing(false);
    }, 1000);
  }, []);

  // Mock login function
  const login = async (email: string, password: string): Promise<ApiResponse> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock validation
        if (email && password) {
          setUser(mockUser);
          setIsAuthenticated(true);
          setExpenses(mockExpenses);
          setLoading(false);
          resolve({ success: true });
        } else {
          setLoading(false);
          resolve({ success: false, error: 'Invalid credentials' });
        }
      }, 1500); // Simulate network delay
    });
  };

  // Mock signup function
  const signup = async (name: string, email: string, password: string): Promise<ApiResponse> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        if (name && email && password) {
          const newUser = { ...mockUser, name, email };
          setUser(newUser);
          setIsAuthenticated(true);
          setExpenses([]);
          setLoading(false);
          resolve({ success: true });
        } else {
          setLoading(false);
          resolve({ success: false, error: 'Invalid data' });
        }
      }, 1500);
    });
  };

  // Mock logout function
  const logout = async (): Promise<void> => {
    setLoading(true);
    setTimeout(() => {
      setUser(null);
      setIsAuthenticated(false);
      setExpenses([]);
      setLoading(false);
    }, 500);
  };

  // Mock image upload
  const uploadExpenseImage = async (imageUri: string): Promise<ImageUploadResponse> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        setLoading(false);
        // Mock extracted data
        resolve({
          success: true,
          extractedData: {
            title: 'Restaurant Bill',
            description: 'Dinner at Italian Restaurant',
            amount: 42.50,
            merchant: 'Olive Garden',
            category: 'Food & Dining',
            date: new Date().toISOString().split('T')[0],
            confidence: 0.85,
          },
          message: 'Image processed successfully'
        });
      }, 2000); // Simulate image processing time
    });
  };

  // Mock add expense
  const addExpense = async (expenseData: CreateExpenseRequest): Promise<ApiResponse> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newExpense: Expense = {
          id: Date.now().toString(),
          ...expenseData,
          userId: user?.id || '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setExpenses(prev => [newExpense, ...prev]);
        setLoading(false);
        resolve({ success: true, message: 'Expense added successfully' });
      }, 1000);
    });
  };

  // Mock update expense
  const updateExpense = async (
    expenseId: string, 
    expenseData: Partial<CreateExpenseRequest>
  ): Promise<ApiResponse> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        setExpenses(prev => 
          prev.map(expense => 
            expense.id === expenseId 
              ? { ...expense, ...expenseData, updatedAt: new Date().toISOString() }
              : expense
          )
        );
        setLoading(false);
        resolve({ success: true, message: 'Expense updated successfully' });
      }, 1000);
    });
  };

  // Mock delete expense
  const deleteExpense = async (expenseId: string): Promise<ApiResponse> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
        setLoading(false);
        resolve({ success: true, message: 'Expense deleted successfully' });
      }, 500);
    });
  };

  // Mock refresh expenses
  const refreshExpenses = async (): Promise<void> => {
    // In mock mode, just simulate loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Get total expenses
  const getTotalExpenses = (): number => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  // Get expenses by category
  const getExpensesByCategory = (category: ExpenseCategory): Expense[] => {
    return expenses.filter(expense => expense.category === category);
  };

  const value: AuthContextType = {
    // State
    user,
    loading,
    expenses,
    isAuthenticated,
    initializing,
    
    // Auth functions
    login,
    signup,
    logout,
    
    // Expense functions
    uploadExpenseImage,
    addExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses,
    
    // Utility functions
    getTotalExpenses,
    getExpensesByCategory,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};