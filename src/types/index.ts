/**
 * Global Type Definitions
 * Centralized type exports for the application
 */

// Re-export types from API
export type {
  ApiError,
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionFilters,
} from "../lib/api";

// User interface
export interface User {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
}

// Form data types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  nickname: string;
  email: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Component props types
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Statistics types
export interface MonthlyStats {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  balanceChange: number;
  incomeChange: number;
  expensesChange: number;
  savingsChange: number;
}

export interface TransactionStats {
  total: number;
  income: number;
  expenses: number;
  count: number;
}

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface MonthlyChartData {
  name: string;
  ingresos: number;
  gastos: number;
}

// Filter types
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface TransactionFilterState {
  accountId?: number;
  tagId?: number;
  isIncome?: boolean;
  dateRange?: DateRange;
}
